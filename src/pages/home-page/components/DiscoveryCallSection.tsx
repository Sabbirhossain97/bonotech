import { useMemo, useState } from "react";
import type { FormEventHandler } from "react";
import SectionEdgeFade from "./SectionEdgeFade";

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

const SelectChevron = () => (
    <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        className="pointer-events-none absolute right-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8E7A9B]"
    >
        <path
            d="m6 8 4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const DiscoveryCallSection = () => {
    const today = useMemo(() => {
        const value = new Date();
        value.setHours(0, 0, 0, 0);
        return value;
    }, []);

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
    const [anchorDate, setAnchorDate] = useState(today);
    const [selectedDate, setSelectedDate] = useState(toLocalDateValue(today));
    const [selectedTime, setSelectedTime] = useState<number | null>(null);
    const [timeZone, setTimeZone] = useState(browserTimeZone);
    const [showReview, setShowReview] = useState(false);
    const [submitState, setSubmitState] = useState<SubmitState>("idle");
    const [submitMessage, setSubmitMessage] = useState("");

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
            selectedTime !== null,
    );

    const updateField = (field: keyof FormValues, value: string) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const selectDate = (value: string) => {
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
        setAnchorDate(today);
        setSelectedDate(toLocalDateValue(today));
        setSelectedTime(null);
    };

    const goPrevious = () => {
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

    const handleConfirmBooking = async () => {
        if (!isFormValid || selectedTime === null) return;

        const endpoint = import.meta.env.VITE_DISCOVERY_CALL_ENDPOINT as string | undefined;

        if (!endpoint) {
            setSubmitState("error");
            setSubmitMessage(
                "Booking endpoint is not configured. Add VITE_DISCOVERY_CALL_ENDPOINT to your .env file.",
            );
            return;
        }

        setSubmitState("submitting");
        setSubmitMessage("");

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...form,
                    date: selectedDate,
                    timeMinutes: selectedTime,
                    time: formatTime(selectedTime, clockFormat),
                    clockFormat,
                    timeZone,
                    durationMinutes: 30,
                }),
            });

            if (!response.ok) {
                throw new Error(`Booking request failed (${response.status})`);
            }

            setSubmitState("success");
            setSubmitMessage("Your discovery call request has been submitted.");
        } catch (error) {
            setSubmitState("error");
            setSubmitMessage(
                error instanceof Error
                    ? error.message
                    : "Could not submit the discovery call request.",
            );
        }
    };

    const fieldClass =
        "h-[42px] w-full rounded-[4px] border border-[#9B72BE]/20 bg-[#160B25]/70 px-3 text-[12px] text-[#F1E8F8] placeholder:text-[13px] outline-none transition placeholder:text-[#806F8E] focus:border-[#A574D5]/70 focus:ring-2 focus:ring-[#A574D5]/10";

    const selectClass = `${fieldClass} appearance-none pr-11`;

    const labelClass = "mb-[7px] block text-[14px] font-medium tracking-[-0.01em] text-[#C0AFCB]";

    return (
        <>
            <section
                id="discovery-call"
                aria-labelledby="discovery-title"
                className="relative isolate overflow-hidden bg-[#11091B] px-4 py-20 text-white sm:px-6 sm:py-24 lg:px-8 lg:py-[100px]"
            >
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-30 bg-[#11091B]"
                />

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-[50%] -z-20 h-[105%] w-[135%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(96,39,164,0.26)_0%,rgba(65,27,111,0.15)_38%,rgba(31,15,49,0.05)_62%,transparent_82%)] blur-[60px]"
                />

                <SectionEdgeFade />

                <div className="relative z-10 mx-auto w-full max-w-[1200px]">
                    <header className="mx-auto mb-10 max-w-[850px] text-center sm:mb-12">
                        <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.16em] text-[#A995BB] sm:text-xs">
                            Schedule a Free Discovery Call
                        </p>

                        <h2
                            id="discovery-title"
                            className="m-0 text-[38px] font-light leading-[1.04] tracking-[-0.055em] text-[#F8F4FC] sm:text-[48px] md:text-[56px] lg:text-[58px]"
                        >
                            Turn Your Next Challenge
                            <span className="mt-1 block font-semibold text-[#BD9DE5]">
                                Into a Clear Build Plan
                            </span>
                        </h2>

                        <p className="mx-auto mt-5 max-w-[670px] text-[14px] font-light leading-[1.55] tracking-[-0.025em] text-[#AFA2BA] sm:text-[15px]">
                            Tell us what&apos;s slowing your business down—or what you want to
                            build next.{" "}
                            <br className="hidden sm:block" />
                            Let&apos;s map the opportunity, explore the right approach, and
                            define your next step.
                        </p>
                    </header>

                    <form
                        onSubmit={handleSubmit}
                        className="grid overflow-hidden rounded-[5px] border border-[#C4A4DE]/25 bg-[linear-gradient(135deg,rgba(239,226,255,0.055),rgba(57,27,82,0.08)),rgba(17,8,30,0.78)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_30px_80px_rgba(4,0,12,0.28)] backdrop-blur-xl lg:grid-cols-2"
                    >
                        <div className="border-b border-[#B695CE]/15 p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-[36px]">
                            <div className="mb-7 flex gap-4">
                                <span className="pt-[3px] text-[11px] tracking-[0.08em] text-[#9A82AC]">
                                    01
                                </span>

                                <div>
                                    <h3 className="text-[24px] font-light tracking-[-0.04em] text-[#F1EAF6]">
                                        A Little About Your Business
                                    </h3>
                                    <p className="mt-2 text-[16px] leading-[1.5] text-[#8F819A]">
                                        Give us the context to make our first conversation count.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                                <label>
                                    <span className={labelClass}>
                                        Full name <span className="text-[#B995D6]">*</span>
                                    </span>
                                    <input
                                        required
                                        value={form.fullName}
                                        onChange={(e) => updateField("fullName", e.target.value)}
                                        name="fullName"
                                        autoComplete="name"
                                        placeholder="Alex Morgan"
                                        maxLength={100}
                                        className={fieldClass}
                                    />
                                </label>

                                <label>
                                    <span className={labelClass}>
                                        Work email <span className="text-[#B995D6]">*</span>
                                    </span>
                                    <input
                                        required
                                        value={form.email}
                                        onChange={(e) => updateField("email", e.target.value)}
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="alex@company.com"
                                        maxLength={254}
                                        className={fieldClass}
                                    />
                                </label>

                                <label>
                                    <span className={labelClass}>
                                        Company name <span className="text-[#B995D6]">*</span>
                                    </span>
                                    <input
                                        required
                                        value={form.company}
                                        onChange={(e) => updateField("company", e.target.value)}
                                        name="company"
                                        autoComplete="organization"
                                        placeholder="Your company"
                                        maxLength={160}
                                        className={fieldClass}
                                    />
                                </label>

                                <label>
                                    <span className={labelClass}>
                                        Company size <span className="text-[#B995D6]">*</span>
                                    </span>
                                    <div className="relative">
                                        <select
                                            required
                                            value={form.companySize}
                                            onChange={(e) => updateField("companySize", e.target.value)}
                                            name="companySize"
                                            className={selectClass}
                                        >
                                            <option value="">Select team size</option>
                                            <option>1–10 people</option>
                                            <option>11–50 people</option>
                                            <option>51–200 people</option>
                                            <option>201–500 people</option>
                                            <option>501–1,000 people</option>
                                            <option>1,000+ people</option>
                                        </select>
                                        <SelectChevron />
                                    </div>
                                </label>

                                <label>
                                    <span className={labelClass}>
                                        Your role{" "}
                                        <small className="ml-1 text-[11px] font-normal text-[#74677D]">
                                            Optional
                                        </small>
                                    </span>
                                    <input
                                        value={form.role}
                                        onChange={(e) => updateField("role", e.target.value)}
                                        name="role"
                                        autoComplete="organization-title"
                                        placeholder="Founder, product lead..."
                                        maxLength={120}
                                        className={fieldClass}
                                    />
                                </label>

                                <label>
                                    <span className={labelClass}>
                                        Company website{" "}
                                        <small className="ml-1 text-[11px] font-normal text-[#74677D]">
                                            Optional
                                        </small>
                                    </span>
                                    <input
                                        value={form.website}
                                        onChange={(e) => updateField("website", e.target.value)}
                                        name="website"
                                        inputMode="url"
                                        autoComplete="url"
                                        placeholder="company.com"
                                        maxLength={250}
                                        className={fieldClass}
                                    />
                                </label>

                                <label className="sm:col-span-2">
                                    <span className={labelClass}>
                                        What can we help with?{" "}
                                        <span className="text-[#B995D6]">*</span>
                                    </span>
                                    <div className="relative">
                                        <select
                                            required
                                            value={form.focus}
                                            onChange={(e) => updateField("focus", e.target.value)}
                                            name="focus"
                                            className={selectClass}
                                        >
                                            <option value="">Choose your starting point</option>
                                            <option>Shape an idea and build a plan</option>
                                            <option>Build a website, mobile or web app</option>
                                            <option>Review our technology and delivery</option>
                                            <option>Digitize and connect enterprise systems</option>
                                            <option>Apply AI or automate workflows</option>
                                            <option>Help me find the right approach</option>
                                        </select>
                                        <SelectChevron />
                                    </div>
                                </label>

                                <label className="sm:col-span-2">
                                    <span className={labelClass}>
                                        What would a successful outcome look like?{" "}
                                        <small className="ml-1 text-[11px] font-normal text-[#74677D]">
                                            Optional
                                        </small>
                                    </span>
                                    <textarea
                                        value={form.brief}
                                        onChange={(e) => updateField("brief", e.target.value)}
                                        name="brief"
                                        rows={3}
                                        maxLength={2000}
                                        placeholder="The challenge, who it affects, and what you'd like to change..."
                                        className="min-h-[92px] w-full resize-none rounded-[4px] border border-[#9B72BE]/20 bg-[#160B25]/70 px-3 py-3 text-[12px] leading-[1.5] text-[#F1E8F8] outline-none transition placeholder:text-[13px] placeholder:text-[#806F8E] focus:border-[#A574D5]/70 focus:ring-2 focus:ring-[#A574D5]/10"
                                    />
                                </label>
                            </div>

                            <p className="mt-9 text-[12px] leading-[1.6] text-[#96899F]">
                                A focused conversation about your business. No preparation needed.
                                <br />
                                <span className="text-[#6F6377]">
                                    Fields marked * are required.
                                </span>
                            </p>
                        </div>

                        <div className="p-6 sm:p-8 lg:p-[36px]">
                            <div className="mb-7 flex gap-4">
                                <span className="pt-[3px] text-[11px] tracking-[0.08em] text-[#9A82AC]">
                                    02
                                </span>
                                <div>
                                    <h3 className="text-[24px] font-light tracking-[-0.04em] text-[#F1EAF6]">
                                        Find a Time That Works
                                    </h3>
                                    <p className="mt-2 text-[16px] leading-[1.5] text-[#8F819A]">
                                        <span>30-minute discovery call</span> · Online
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="inline-flex rounded-[4px] bg-[#170C26] p-[3px]">
                                    <button
                                        type="button"
                                        onClick={() => setCalendarView("week")}
                                        aria-pressed={calendarView === "week"}
                                        className={`rounded-[3px] px-4 py-2 text-[11px] transition ${
                                            calendarView === "week"
                                                ? "bg-[#E2CBF4] text-[#2D183D]"
                                                : "text-[#A493B0] hover:text-white"
                                        }`}
                                    >
                                        Weekly
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCalendarView("month")}
                                        aria-pressed={calendarView === "month"}
                                        className={`rounded-[3px] px-4 py-2 text-[11px] transition ${
                                            calendarView === "month"
                                                ? "bg-[#E2CBF4] text-[#2D183D]"
                                                : "text-[#A493B0] hover:text-white"
                                        }`}
                                    >
                                        Monthly
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={goToToday}
                                    className="text-[11px] text-[#85778F] transition hover:text-white"
                                >
                                    Today
                                </button>
                            </div>

                            <div className="mt-6 flex items-center justify-between">
                                <h4 className="text-[23px] font-light tracking-[-0.04em] text-[#D9CDE1]">
                                    {headingLabel}
                                </h4>

                                <div className="flex gap-1">
                                    <button
                                        type="button"
                                        onClick={goPrevious}
                                        aria-label={`Previous ${calendarView}`}
                                        className="grid h-8 w-8 place-items-center rounded-[4px] border border-[#A37ABE]/10 text-[#655872] transition hover:border-[#A37ABE]/40 hover:text-white"
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
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
                                        onClick={goNext}
                                        aria-label={`Next ${calendarView}`}
                                        className="grid h-8 w-8 place-items-center rounded-[4px] border border-[#A37ABE]/20 text-[#9884A7] transition hover:border-[#A37ABE]/50 hover:text-white"
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
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
                                <div className="mt-4 grid grid-cols-7 gap-1 px-1">
                                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                                        (label) => (
                                            <span
                                                key={label}
                                                className="py-1 text-center text-[10px] text-[#64566F]"
                                            >
                                                {label}
                                            </span>
                                        ),
                                    )}
                                </div>
                            )}

                            <div
                                className={`grid grid-cols-7 gap-1 ${
                                    calendarView === "month" ? "mt-1" : "mt-4"
                                }`}
                            >
                                {calendarCells.map((day) => {
                                    const selected = selectedDate === day.value;
                                    const isToday = day.value === toLocalDateValue(today);

                                    return (
                                        <button
                                            key={day.key}
                                            type="button"
                                            onClick={() => selectDate(day.value)}
                                            className={`rounded-[5px] border px-1 text-center transition ${
                                                calendarView === "month" ? "py-2" : "py-3"
                                            } ${
                                                selected
                                                    ? "border-[#9C6CC7]/50 bg-[#3A2051]/45"
                                                    : "border-transparent hover:border-[#714F89]/25 hover:bg-[#22102F]/40"
                                            } ${
                                                !day.inCurrentMonth && calendarView === "month"
                                                    ? "opacity-35"
                                                    : ""
                                            }`}
                                        >
                                            {calendarView === "week" && (
                                                <span className="block text-[11px] text-[#6F6278]">
                                                    {day.label}
                                                </span>
                                            )}
                                            <span
                                                className={`block text-[12px] ${
                                                    calendarView === "week" ? "mt-2" : ""
                                                } ${
                                                    selected
                                                        ? "text-[#E4D8EB]"
                                                        : isToday
                                                          ? "text-[#CFB0E7]"
                                                          : "text-[#83748D]"
                                                }`}
                                            >
                                                {day.date}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-5 flex items-end justify-between gap-4 border-t border-[#A37ABE]/10 pt-4">
                                <label className="min-w-0 max-w-[220px] flex-1">
                                    <span className="mb-2 block text-[12px] text-[#75687E]">
                                        Time zone
                                    </span>

                                    <div className="relative">
                                        <select
                                            value={timeZone}
                                            onChange={(e) => {
                                                setTimeZone(e.target.value);
                                                setSelectedTime(null);
                                            }}
                                            className="h-9 w-full appearance-none rounded-[4px] border border-[#9B72BE]/15 bg-[#160B25]/60 pl-3 pr-10 text-[11px] text-[#AEA0B7] outline-none transition focus:border-[#A574D5]/50"
                                        >
                                            {timeZones.map((zone) => (
                                                <option key={zone} value={zone} className="bg-[#170C26]">
                                                    {zone}
                                                </option>
                                            ))}
                                        </select>
                                        <SelectChevron />
                                    </div>
                                </label>

                                <div
                                    role="group"
                                    aria-label="Time format"
                                    className="inline-flex rounded-[4px] bg-[#170C26] p-[2px]"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setClockFormat("12")}
                                        className={`rounded-[3px] px-2 py-1.5 text-[11px] ${
                                            clockFormat === "12"
                                                ? "bg-[#2C173C] text-[#D8C8E4]"
                                                : "text-[#73647E]"
                                        }`}
                                    >
                                        12h
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setClockFormat("24")}
                                        className={`rounded-[3px] px-2 py-1.5 text-[11px] ${
                                            clockFormat === "24"
                                                ? "bg-[#2C173C] text-[#D8C8E4]"
                                                : "text-[#73647E]"
                                        }`}
                                    >
                                        24h
                                    </button>
                                </div>
                            </div>

                            <p className="mt-5 text-[12px] text-[#776A81]">
                                Choose a date, time zone and available time.
                            </p>

                            <div className="mt-4 flex items-center justify-between">
                                <h4 className="text-[12px] font-medium text-[#B6A7C0]">
                                    {selectedDateLabel}
                                </h4>
                                <span className="text-[11px] text-[#716577]">30 min</span>
                            </div>

                            <div className="mt-3 max-h-[142px] space-y-1.5 overflow-y-auto pr-1 [scrollbar-width:thin]">
                                {TIME_SLOT_MINUTES.map((slot) => (
                                    <button
                                        key={slot}
                                        type="button"
                                        onClick={() => setSelectedTime(slot)}
                                        className={`flex w-full items-center justify-between rounded-[4px] border px-3 py-2.5 text-left text-[12px] transition ${
                                            selectedTime === slot
                                                ? "border-[#9B70C7]/50 bg-[#321C45] text-[#F0E6F8]"
                                                : "border-transparent text-[#86798F] hover:border-[#704E88]/25 hover:bg-[#190C25]"
                                        }`}
                                    >
                                        <span>{formatTime(slot, clockFormat)}</span>
                                        <span className="text-[11px] text-[#65596C]">30 min</span>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-4 border-t border-[#A37ABE]/10 pt-4">
                                <p className="mb-4 text-[12px] text-[#887A90]">
                                    {selectedTime !== null
                                        ? `${selectedDateLabel} · ${formatTime(
                                              selectedTime,
                                              clockFormat,
                                          )} · ${timeZone}`
                                        : "Select a date and time above."}
                                </p>

                                <button
                                    type="submit"
                                    disabled={!isFormValid}
                                    className={`flex h-[44px] w-full items-center justify-between rounded-[4px] px-4 text-[11px] font-medium transition ${
                                        isFormValid
                                            ? "bg-[#DDC7F0] text-[#2C183B] hover:bg-[#E8D7F7]"
                                            : "cursor-not-allowed bg-[#DCC6ED] text-[#5B4967] opacity-50"
                                    }`}
                                >
                                    <span>Review Call Details</span>
                                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
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
                </div>
            </section>

            {showReview && (
                <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-5 backdrop-blur-md">
                    <div className="relative w-full max-w-[520px] rounded-[6px] border border-[#B48BD0]/25 bg-[#160C24] p-7 text-white shadow-[0_30px_100px_rgba(0,0,0,.55)] sm:p-9">
                        <button
                            type="button"
                            onClick={() => setShowReview(false)}
                            aria-label="Close booking review"
                            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/10 text-xl text-[#A896B5] hover:text-white"
                        >
                            ×
                        </button>

                        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#A995BB]">
                            Your Discovery Call
                        </p>
                        <h3 className="mt-3 text-[30px] font-light tracking-[-0.05em]">
                            A Clear Starting Point
                        </h3>
                        <p className="mt-2 text-[13px] text-[#9F91A8]">
                            Check your preferred time and business details.
                        </p>

                        <dl className="mt-7 grid gap-4 rounded-[5px] border border-[#A97DCA]/15 bg-[#100719] p-5 text-[12px]">
                            <div className="flex justify-between gap-4">
                                <dt className="text-[#766A7D]">Name</dt>
                                <dd>{form.fullName}</dd>
                            </div>
                            <div className="flex justify-between gap-4">
                                <dt className="text-[#766A7D]">Email</dt>
                                <dd className="text-right">{form.email}</dd>
                            </div>
                            <div className="flex justify-between gap-4">
                                <dt className="text-[#766A7D]">Company</dt>
                                <dd>{form.company}</dd>
                            </div>
                            <div className="flex justify-between gap-4">
                                <dt className="text-[#766A7D]">Date</dt>
                                <dd>{selectedDateLabel}</dd>
                            </div>
                            <div className="flex justify-between gap-4">
                                <dt className="text-[#766A7D]">Time</dt>
                                <dd>
                                    {selectedTime !== null
                                        ? formatTime(selectedTime, clockFormat)
                                        : "—"}
                                </dd>
                            </div>
                            <div className="flex justify-between gap-4">
                                <dt className="text-[#766A7D]">Time zone</dt>
                                <dd>{timeZone}</dd>
                            </div>
                        </dl>

                        {submitMessage && (
                            <div
                                className={`mt-5 rounded-[5px] border p-4 text-[11px] leading-[1.5] ${
                                    submitState === "success"
                                        ? "border-emerald-300/20 bg-emerald-300/5 text-emerald-100"
                                        : "border-rose-300/20 bg-rose-300/5 text-rose-100"
                                }`}
                            >
                                {submitMessage}
                            </div>
                        )}

                        <div className="mt-6 flex gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowReview(false);
                                    setSubmitState("idle");
                                    setSubmitMessage("");
                                }}
                                className="h-11 flex-1 rounded-[4px] border border-[#A17AB9]/20 text-[11px] text-[#BAA8C7] transition hover:border-[#A17AB9]/50 hover:text-white"
                            >
                                Edit Details
                            </button>

                            <button
                                type="button"
                                onClick={handleConfirmBooking}
                                disabled={submitState === "submitting" || submitState === "success"}
                                className="h-11 flex-1 rounded-[4px] bg-[#DDC7F0] text-[11px] font-medium text-[#2C183B] transition hover:bg-[#E8D7F7] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submitState === "submitting"
                                    ? "Submitting..."
                                    : submitState === "success"
                                      ? "Submitted"
                                      : "Confirm Discovery Call"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DiscoveryCallSection;
