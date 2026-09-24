import { useEffect, useMemo, useState } from "react";
import type { FormEventHandler } from "react";
import { trackDiscoverySubmit } from "@/lib/analytics";
import {
    EmailSendError,
    sendDiscoveryCallEmail,
} from "@/lib/services/email";
import FlowBackground from "./Hero/FlowBackground";
import "./discovery.css";

type FormValues = {
    fullName: string;
    email: string;
    company: string;
    companySize: string;
    role: string;
    website: string;
    focus: string;
    brief: string;
};

type CalendarView = "week" | "month";
type ClockFormat = "12" | "24";
type SubmitState = "idle" | "submitting" | "success" | "error";

type CalendarCell = {
    key: string;
    label: string;
    date: number;
    value: string;
    inCurrentMonth: boolean;
};

const TIME_SLOT_MINUTES = [
    10 * 60,
    10 * 60 + 30,
    11 * 60,
    11 * 60 + 30,
    14 * 60,
    14 * 60 + 30,
    15 * 60,
    15 * 60 + 30,
];

const FALLBACK_TIME_ZONES = [
    "Asia/Dhaka",
    "Asia/Singapore",
    "Asia/Kolkata",
    "Asia/Dubai",
    "Europe/London",
    "Europe/Berlin",
    "America/New_York",
    "America/Chicago",
    "America/Los_Angeles",
    "Australia/Sydney",
];

const pad = (value: number) => String(value).padStart(2, "0");

const toLocalDateValue = (date: Date) =>
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const fromLocalDateValue = (value: string) => {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
};

/** Current calendar date + minutes-from-midnight in a given IANA timezone. */
const getNowInTimeZone = (timeZone: string) => {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
    }).formatToParts(new Date());

    const read = (type: Intl.DateTimeFormatPartTypes) =>
        parts.find((part) => part.type === type)?.value ?? "0";

    const dateValue = `${read("year")}-${read("month")}-${read("day")}`;
    const minutes = Number(read("hour")) * 60 + Number(read("minute"));

    return { dateValue, minutes };
};

const isDateBefore = (value: string, other: string) => value < other;

const addDays = (date: Date, amount: number) => {
    const next = new Date(date);
    next.setDate(next.getDate() + amount);
    return next;
};

const addMonths = (date: Date, amount: number) => {
    const next = new Date(date.getFullYear(), date.getMonth() + amount, 1);
    return next;
};

const startOfWeek = (date: Date) => {
    const next = new Date(date);
    const mondayIndex = (next.getDay() + 6) % 7;
    next.setDate(next.getDate() - mondayIndex);
    next.setHours(0, 0, 0, 0);
    return next;
};

const formatTime = (minutes: number, format: ClockFormat) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (format === "24") {
        return `${pad(hours)}:${pad(mins)}`;
    }

    const suffix = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;
    return `${hour12}:${pad(mins)} ${suffix}`;
};

const DiscoveryCallSection = () => {
    const browserTimeZone = useMemo(
        () => Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Dhaka",
        [],
    );

    const timeZones = useMemo(
        () => Array.from(new Set([browserTimeZone, ...FALLBACK_TIME_ZONES])),
        [browserTimeZone],
    );

    const [form, setForm] = useState<FormValues>({
        fullName: "",
        email: "",
        company: "",
        companySize: "",
        role: "",
        website: "",
        focus: "",
        brief: "",
    });

    const [calendarView, setCalendarView] = useState<CalendarView>("week");
    const [clockFormat, setClockFormat] = useState<ClockFormat>("12");
    const [timeZone, setTimeZone] = useState(browserTimeZone);
    const nowInZone = getNowInTimeZone(timeZone);
    const todayValue = nowInZone.dateValue;
    const todayDate = useMemo(
        () => fromLocalDateValue(todayValue),
        [todayValue],
    );

    const [anchorDate, setAnchorDate] = useState(todayDate);
    const [selectedDate, setSelectedDate] = useState(todayValue);
    const [selectedTime, setSelectedTime] = useState<number | null>(null);
    const [showReview, setShowReview] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [submitState, setSubmitState] = useState<SubmitState>("idle");
    const [submitMessage, setSubmitMessage] = useState("");
    const [confirmedSummary, setConfirmedSummary] = useState<{
        name: string;
        dateLabel: string;
        time: string;
        timeZone: string;
    } | null>(null);

    const isSlotAvailable = (dateValue: string, slotMinutes: number) => {
        if (isDateBefore(dateValue, todayValue)) return false;
        if (dateValue > todayValue) return true;
        return slotMinutes > nowInZone.minutes;
    };

    const availableSlots = useMemo(
        () =>
            selectedDate
                ? TIME_SLOT_MINUTES.filter((slot) =>
                      isSlotAvailable(selectedDate, slot),
                  )
                : [],
        // eslint-disable-next-line react-hooks/exhaustive-deps -- recompute from live clock + selection
        [selectedDate, todayValue, nowInZone.minutes],
    );

    const canGoPrevious = useMemo(() => {
        if (calendarView === "week") {
            const previousWeekEnd = addDays(startOfWeek(anchorDate), -1);
            return toLocalDateValue(previousWeekEnd) >= todayValue;
        }

        const previousMonth = addMonths(anchorDate, -1);
        const lastDay = new Date(
            previousMonth.getFullYear(),
            previousMonth.getMonth() + 1,
            0,
        );
        return toLocalDateValue(lastDay) >= todayValue;
    }, [anchorDate, calendarView, todayValue]);

    useEffect(() => {
        if (selectedDate && isDateBefore(selectedDate, todayValue)) {
            setSelectedDate(todayValue);
            setSelectedTime(null);
            return;
        }

        if (
            selectedTime !== null &&
            selectedDate &&
            !isSlotAvailable(selectedDate, selectedTime)
        ) {
            setSelectedTime(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate, selectedTime, todayValue, nowInZone.minutes, timeZone]);

    const calendarCells = useMemo<CalendarCell[]>(() => {
        if (calendarView === "week") {
            const weekStart = startOfWeek(anchorDate);

            return Array.from({ length: 7 }, (_, index) => {
                const date = addDays(weekStart, index);
                return {
                    key: toLocalDateValue(date),
                    label: date.toLocaleDateString("en-US", { weekday: "short" }),
                    date: date.getDate(),
                    value: toLocalDateValue(date),
                    inCurrentMonth: true,
                };
            });
        }

        const monthStart = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 1);
        const gridStart = startOfWeek(monthStart);

        return Array.from({ length: 42 }, (_, index) => {
            const date = addDays(gridStart, index);
            return {
                key: toLocalDateValue(date),
                label: date.toLocaleDateString("en-US", { weekday: "short" }),
                date: date.getDate(),
                value: toLocalDateValue(date),
                inCurrentMonth: date.getMonth() === anchorDate.getMonth(),
            };
        });
    }, [anchorDate, calendarView]);

    const selectedDateLabel = useMemo(() => {
        if (!selectedDate) return "";
        return fromLocalDateValue(selectedDate).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
    }, [selectedDate]);

    const headingLabel = useMemo(
        () =>
            anchorDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
            }),
        [anchorDate],
    );

    const isEmailValid = /^\S+@\S+\.\S+$/.test(form.email.trim());
    const isFormValid = Boolean(
        form.fullName.trim() &&
            isEmailValid &&
            form.company.trim() &&
            form.companySize &&
            form.focus &&
            selectedDate &&
            selectedTime !== null &&
            isSlotAvailable(selectedDate, selectedTime),
    );

    const updateField = (field: keyof FormValues, value: string) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const selectDate = (value: string) => {
        if (isDateBefore(value, todayValue)) return;

        const next = fromLocalDateValue(value);
        setSelectedDate(value);
        setSelectedTime(null);

        // If an adjacent-month day is clicked in month view, move the heading too.
        if (
            calendarView === "month" &&
            (next.getMonth() !== anchorDate.getMonth() ||
                next.getFullYear() !== anchorDate.getFullYear())
        ) {
            setAnchorDate(new Date(next.getFullYear(), next.getMonth(), 1));
        }
    };

    const goToToday = () => {
        setAnchorDate(todayDate);
        setSelectedDate(todayValue);
        setSelectedTime(null);
    };

    const goPrevious = () => {
        if (!canGoPrevious) return;
        setAnchorDate((current) =>
            calendarView === "week" ? addDays(current, -7) : addMonths(current, -1),
        );
        setSelectedTime(null);
    };

    const goNext = () => {
        setAnchorDate((current) =>
            calendarView === "week" ? addDays(current, 7) : addMonths(current, 1),
        );
        setSelectedTime(null);
    };

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        if (!isFormValid) return;

        setSubmitState("idle");
        setSubmitMessage("");
        setShowReview(true);
    };

    const resetForm = () => {
        setForm({
            fullName: "",
            email: "",
            company: "",
            companySize: "",
            role: "",
            website: "",
            focus: "",
            brief: "",
        });
        setSelectedDate(todayValue);
        setSelectedTime(null);
        setAnchorDate(todayDate);
        setTimeZone(browserTimeZone);
        setSubmitState("idle");
        setSubmitMessage("");
    };

    const handleConfirmBooking = async () => {
        if (!isFormValid || selectedTime === null) return;

        setSubmitState("submitting");
        setSubmitMessage("");

        const timeLabel = formatTime(selectedTime, clockFormat);

        try {
            await sendDiscoveryCallEmail({
                ...form,
                date: selectedDate,
                dateLabel: selectedDateLabel,
                time: timeLabel,
                timeZone,
                durationMinutes: 30,
            });
            trackDiscoverySubmit();

            setConfirmedSummary({
                name: form.fullName.trim(),
                dateLabel: selectedDateLabel,
                time: timeLabel,
                timeZone,
            });
            setShowReview(false);
            setShowSuccess(true);
            setSubmitState("success");
            resetForm();
        } catch (error) {
            setSubmitState("error");
            setSubmitMessage(
                error instanceof EmailSendError
                    ? error.message
                    : "Could not submit the discovery call request. Please try again.",
            );
        }
    };

    const closeSuccess = () => {
        setShowSuccess(false);
        setConfirmedSummary(null);
        setSubmitState("idle");
    };

    const selectedTimeSummary =
        selectedTime !== null
            ? `${selectedDateLabel} · ${formatTime(selectedTime, clockFormat)} · ${timeZone}`
            : "Select a date and time above.";

    return (
        <>
            <section
                id="discovery-call"
                className="discovery"
                aria-labelledby="discovery-title"
            >
                <div className="discovery-atmosphere" aria-hidden="true">
                    <FlowBackground
                        className="discovery-flow"
                        maxPixelRatio={1}
                        ringCenterY={0.43}
                        initialElapsed={4}
                    />
                </div>

                <header className="discovery-heading">
                    <p className="discovery-eyebrow">SCHEDULE A FREE DISCOVERY CALL</p>
                    <h2 id="discovery-title">
                        Turn Your Next Challenge
                        <span>Into a Clear Build Plan</span>
                    </h2>
                    <p className="discovery-description">
                        Tell us what&apos;s slowing your business down—or what you want to
                        build next.{" "}
                        <br className="hidden sm:block" />
                        Let&apos;s map the opportunity, explore the right approach, and
                        define your next step.
                    </p>
                </header>

                <form className="discovery-booking" onSubmit={handleSubmit}>
                    <div className="discovery-details">
                        <div className="discovery-panel-heading">
                            <span className="discovery-step">01</span>
                            <div>
                                <h3>A Little About Your Business</h3>
                                <p>
                                    Give us the context to make our first conversation count.
                                </p>
                            </div>
                        </div>

                        <div className="discovery-fields">
                            <label>
                                Full name <span aria-hidden="true">*</span>
                                <input
                                    required
                                    value={form.fullName}
                                    onChange={(e) =>
                                        updateField("fullName", e.target.value)
                                    }
                                    name="fullName"
                                    autoComplete="name"
                                    placeholder="Alex Morgan"
                                    maxLength={100}
                                />
                            </label>

                            <label>
                                Work email <span aria-hidden="true">*</span>
                                <input
                                    required
                                    value={form.email}
                                    onChange={(e) => updateField("email", e.target.value)}
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="alex@company.com"
                                    maxLength={254}
                                />
                            </label>

                            <label>
                                Company name <span aria-hidden="true">*</span>
                                <input
                                    required
                                    value={form.company}
                                    onChange={(e) =>
                                        updateField("company", e.target.value)
                                    }
                                    name="company"
                                    autoComplete="organization"
                                    placeholder="Your company"
                                    maxLength={160}
                                />
                            </label>

                            <label>
                                Company size <span aria-hidden="true">*</span>
                                <select
                                    required
                                    value={form.companySize}
                                    onChange={(e) =>
                                        updateField("companySize", e.target.value)
                                    }
                                    name="companySize"
                                >
                                    <option value="">Select team size</option>
                                    <option>1–10 people</option>
                                    <option>11–50 people</option>
                                    <option>51–200 people</option>
                                    <option>201–500 people</option>
                                    <option>501–1,000 people</option>
                                    <option>1,000+ people</option>
                                </select>
                            </label>

                            <label>
                                Your role <small>Optional</small>
                                <input
                                    value={form.role}
                                    onChange={(e) => updateField("role", e.target.value)}
                                    name="role"
                                    autoComplete="organization-title"
                                    placeholder="Founder, product lead…"
                                    maxLength={120}
                                />
                            </label>

                            <label>
                                Company website <small>Optional</small>
                                <input
                                    value={form.website}
                                    onChange={(e) =>
                                        updateField("website", e.target.value)
                                    }
                                    name="website"
                                    inputMode="url"
                                    autoComplete="url"
                                    placeholder="company.com"
                                    maxLength={250}
                                />
                            </label>

                            <label className="discovery-field-wide">
                                What can we help with? <span aria-hidden="true">*</span>
                                <select
                                    required
                                    value={form.focus}
                                    onChange={(e) => updateField("focus", e.target.value)}
                                    name="focus"
                                >
                                    <option value="">Choose your starting point</option>
                                    <option>Shape an idea and build a plan</option>
                                    <option>Build a website, mobile or web app</option>
                                    <option>Review our technology and delivery</option>
                                    <option>Digitize and connect enterprise systems</option>
                                    <option>Apply AI or automate workflows</option>
                                    <option>Help me find the right approach</option>
                                </select>
                            </label>

                            <label className="discovery-field-wide">
                                What would a successful outcome look like?{" "}
                                <small>Optional</small>
                                <textarea
                                    value={form.brief}
                                    onChange={(e) => updateField("brief", e.target.value)}
                                    name="brief"
                                    rows={3}
                                    maxLength={2000}
                                    placeholder="The challenge, who it affects, and what you’d like to change…"
                                />
                            </label>
                        </div>

                        <p className="discovery-form-note">
                            A focused conversation about your business. No preparation needed.
                            <br />
                            <span>Fields marked * are required.</span>
                        </p>
                    </div>

                    <div className="discovery-schedule">
                        <div className="discovery-panel-heading">
                            <span className="discovery-step">02</span>
                            <div>
                                <h3>Find a Time That Works</h3>
                                <p>
                                    <span className="discovery-duration">
                                        30-minute discovery call
                                    </span>{" "}
                                    · Online
                                </p>
                            </div>
                        </div>

                        <div className="discovery-calendar">
                            <div className="discovery-calendar-toolbar">
                                <div
                                    className="discovery-view"
                                    role="group"
                                    aria-label="Calendar view"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setCalendarView("week")}
                                        aria-pressed={calendarView === "week"}
                                    >
                                        Weekly
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCalendarView("month")}
                                        aria-pressed={calendarView === "month"}
                                    >
                                        Monthly
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    className="discovery-today"
                                    onClick={goToToday}
                                >
                                    Today
                                </button>
                            </div>

                            <div className="discovery-calendar-heading">
                                <h4 id="discovery-month">{headingLabel}</h4>
                                <div>
                                    <button
                                        type="button"
                                        className="discovery-nav"
                                        onClick={goPrevious}
                                        disabled={!canGoPrevious}
                                        aria-label={`Previous ${calendarView}`}
                                    >
                                        <svg viewBox="0 0 24 24" fill="none">
                                            <path
                                                d="m14 6-6 6 6 6"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        className="discovery-nav"
                                        onClick={goNext}
                                        aria-label={`Next ${calendarView}`}
                                    >
                                        <svg viewBox="0 0 24 24" fill="none">
                                            <path
                                                d="m10 6 6 6-6 6"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {calendarView === "month" && (
                                <div className="discovery-dates is-month">
                                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                                        (label) => (
                                            <span key={label} className="discovery-weekday">
                                                {label}
                                            </span>
                                        ),
                                    )}
                                </div>
                            )}

                            <div
                                className={`discovery-dates${
                                    calendarView === "month" ? " is-month" : ""
                                }`}
                                role="group"
                                aria-labelledby="discovery-month"
                            >
                                {calendarCells.map((day) => {
                                    const selected = selectedDate === day.value;
                                    const isToday = day.value === todayValue;
                                    const isPast = isDateBefore(day.value, todayValue);

                                    return (
                                        <button
                                            key={day.key}
                                            type="button"
                                            className="discovery-date"
                                            onClick={() => selectDate(day.value)}
                                            disabled={isPast}
                                            aria-pressed={selected}
                                            aria-current={isToday ? "date" : undefined}
                                            style={
                                                !day.inCurrentMonth &&
                                                calendarView === "month"
                                                    ? { opacity: 0.35 }
                                                    : undefined
                                            }
                                        >
                                            {calendarView === "week" && (
                                                <small>{day.label}</small>
                                            )}
                                            {day.date}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="discovery-schedule-options">
                                <label>
                                    Time zone
                                    <select
                                        value={timeZone}
                                        onChange={(e) => {
                                            setTimeZone(e.target.value);
                                            setSelectedTime(null);
                                        }}
                                    >
                                        {timeZones.map((zone) => (
                                            <option key={zone} value={zone}>
                                                {zone}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <div
                                    className="discovery-clock-format"
                                    role="group"
                                    aria-label="Time format"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setClockFormat("12")}
                                        aria-pressed={clockFormat === "12"}
                                    >
                                        12h
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setClockFormat("24")}
                                        aria-pressed={clockFormat === "24"}
                                    >
                                        24h
                                    </button>
                                </div>
                            </div>

                            <p className="discovery-preview-note">
                                Pick a preferred time — we&apos;ll confirm by email.
                            </p>

                            <div className="discovery-slots-header">
                                <h4 id="discovery-slot-range">{selectedDateLabel}</h4>
                                <span>30 min</span>
                            </div>

                            <div
                                className="discovery-slot-list"
                                role="group"
                                aria-labelledby="discovery-slot-range"
                            >
                                <div className="discovery-slot-buttons discovery-slot-buttons--stack">
                                    {TIME_SLOT_MINUTES.map((slot) => {
                                        const available = isSlotAvailable(
                                            selectedDate,
                                            slot,
                                        );

                                        return (
                                            <button
                                                key={slot}
                                                type="button"
                                                className="discovery-slot"
                                                onClick={() => setSelectedTime(slot)}
                                                disabled={!available}
                                                aria-pressed={selectedTime === slot}
                                            >
                                                <span>
                                                    {formatTime(slot, clockFormat)}
                                                </span>
                                                <span>
                                                    {available ? "30 min" : "Unavailable"}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                                {availableSlots.length === 0 && (
                                    <p className="discovery-no-slots">
                                        No open times left for this day — pick another
                                        date.
                                    </p>
                                )}
                            </div>

                            <div className="discovery-selected" aria-live="polite">
                                {selectedTimeSummary}
                            </div>

                            <button
                                type="submit"
                                className="discovery-submit"
                                disabled={!isFormValid}
                            >
                                <span>Review Call Details</span>
                                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path
                                        d="M4 12h15m-6-6 6 6-6 6"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </form>
            </section>

            {showReview && (
                <div className="discovery-review-overlay">
                    <div
                        className="discovery-review"
                        role="dialog"
                        aria-labelledby="discovery-review-title"
                    >
                        <button
                            type="button"
                            className="discovery-review-close"
                            onClick={() => setShowReview(false)}
                            aria-label="Close booking review"
                        >
                            ×
                        </button>

                        <p className="discovery-eyebrow">YOUR DISCOVERY CALL</p>
                        <h3 id="discovery-review-title">A Clear Starting Point</h3>
                        <p>
                            Check your preferred time and business details before you send
                            the request.
                        </p>

                        <dl className="discovery-review-details">
                            <dt>Name</dt>
                            <dd>{form.fullName}</dd>
                            <dt>Email</dt>
                            <dd>{form.email}</dd>
                            <dt>Company</dt>
                            <dd>{form.company}</dd>
                            <dt>Date</dt>
                            <dd>{selectedDateLabel}</dd>
                            <dt>Time</dt>
                            <dd>
                                {selectedTime !== null
                                    ? formatTime(selectedTime, clockFormat)
                                    : "—"}
                            </dd>
                            <dt>Time zone</dt>
                            <dd>{timeZone}</dd>
                        </dl>

                        {submitMessage && submitState === "error" && (
                            <p className="discovery-error" role="alert">
                                {submitMessage}
                            </p>
                        )}

                        <div className="discovery-review-actions">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowReview(false);
                                    setSubmitState("idle");
                                    setSubmitMessage("");
                                }}
                            >
                                Edit Details
                            </button>

                            <button
                                type="button"
                                className="discovery-review-confirm"
                                onClick={handleConfirmBooking}
                                disabled={submitState === "submitting"}
                            >
                                {submitState === "submitting"
                                    ? "Sending request…"
                                    : "Confirm Discovery Call"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showSuccess && confirmedSummary && (
                <div className="discovery-review-overlay">
                    <div
                        className="discovery-review"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="discovery-success-title"
                    >
                        <button
                            type="button"
                            className="discovery-review-close"
                            onClick={closeSuccess}
                            aria-label="Close success message"
                        >
                            ×
                        </button>

                        <div className="discovery-success-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                                <path
                                    d="M5 12.5 9.5 17 19 7.5"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>

                        <p className="discovery-eyebrow">Request Received</p>
                        <h3 id="discovery-success-title">We&apos;ll Confirm Your Time</h3>
                        <p>
                            Thanks
                            {confirmedSummary.name
                                ? `, ${confirmedSummary.name.split(" ")[0]}`
                                : ""}
                            . We received your preferred slot and will follow up by email
                            to confirm your discovery call.
                        </p>

                        <dl className="discovery-review-details">
                            <dt>Date</dt>
                            <dd>{confirmedSummary.dateLabel}</dd>
                            <dt>Time</dt>
                            <dd>{confirmedSummary.time}</dd>
                            <dt>Time zone</dt>
                            <dd>{confirmedSummary.timeZone}</dd>
                        </dl>

                        <button
                            type="button"
                            className="discovery-submit"
                            onClick={closeSuccess}
                        >
                            <span>Done</span>
                            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path
                                    d="M4 12h15m-6-6 6 6-6 6"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default DiscoveryCallSection;
