import { useEffect, useMemo, useRef, useState } from "react";

import evoLogo from "@/assets/clients/evo.svg";
import polysignalsLogo from "@/assets/clients/polysignals.svg";
import zatiqLogo from "@/assets/clients/zatiq.svg";
import gustavLogo from "@/assets/clients/gustav.svg";
import ditechLogo from "@/assets/clients/ditech.svg";

import evanMilho from "@/assets/testimonials/evan-milho.png";
import nafisAbrar from "@/assets/testimonials/nafis-abrar.png";
import sultanMoni from "@/assets/testimonials/sultan-moni-new.png";
import shohiduzzamanShakil from "@/assets/testimonials/shohiduzzaman-shakil.png";
import rakibulHasanRaihan from "@/assets/testimonials/rakibul-hasan-raihan.png";
import SectionEdgeFade from "./SectionEdgeFade";

type Testimonial = {
    name: string;
    role: string;
    handle: string;
    quote: string;
    logo: string;
    portrait: string;
    logoClassName?: string;
    portraitClassName?: string;
};

const testimonials: Testimonial[] = [
    {
        name: "Evan Milho",
        role: "CEO, EVO Grading",
        handle: "@evocardprep",
        quote:
            "I couldn’t believe my eyes when I first saw what the team had built out for me. Looks so good. There are massive companies in the space who still haven’t modernised a proper web-based application form — so excited to be the first to launch one for card prep & cleaning.",
        logo: evoLogo,
        portrait: evanMilho,
        logoClassName: "h-10 w-[34px]",
        portraitClassName: "object-[50%_24%]",
    },
    {
        name: "Nafis Abrar",
        role: "ML Engineer at Meta",
        handle: "@polysignals.app",
        quote:
            "Polysignals is the highest quality app built in the shortest possible time that I have seen in quite some time. Speaking as someone who works with the highest level of engineers on a daily basis, bonotech is the real deal!",
        logo: polysignalsLogo,
        portrait: nafisAbrar,
        portraitClassName: "object-[50%_26%]",
    },
    {
        name: "Sultan Moni",
        role: "Founder and CEO, Zatiq",
        handle: "@zatiqglobal",
        quote:
            "Bonotech brought a thoughtful product perspective to the table. Their consultancy helped us look at the experience more strategically, and I especially loved the UI/UX suggestions, it gives users a quick, engaging win while making the product easier to understand from the start.",
        logo: zatiqLogo,
        portrait: sultanMoni,
        logoClassName: "w-[92px]",
        portraitClassName: "object-[50%_30%]",
    },
    {
        name: "MD. Shohiduzzaman Shakil",
        role: "Generalist — Human Resources, Mermaid Beach Resort",
        handle: "@gustavclub",
        quote:
            "Gustav is a user-friendly, visually appealing all-in-one cloud PMS. Intuitive, time-saving, and reliable — with excellent reports and friendly support for effortless hotel management.",
        logo: gustavLogo,
        portrait: shohiduzzamanShakil,
        portraitClassName: "object-[50%_22%]",
    },
    {
        name: "MD. Rakibul Hasan Raihan",
        role: "Project Coordinator, DITECH",
        handle: "@ditechbd",
        quote:
            "The CRM has significantly improved how we monitor and manage our sales team by consolidating key information into one centralized dashboard. What impressed me most was how quickly everything came together, the speed of delivery was genuinely new and remarkable to me.",
        logo: ditechLogo,
        portrait: rakibulHasanRaihan,
        portraitClassName: "object-[50%_25%]",
    },
];

const TestimonialsSection = () => {
    const sectionRef = useRef<HTMLElement | null>(null);
    const sliderRef = useRef<HTMLDivElement | null>(null);
    const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
    const timerRef = useRef<number | null>(null);

    const [activeIndex, setActiveIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isPageVisible, setIsPageVisible] = useState(true);

    const activeTestimonial = testimonials[activeIndex];

    const autoDelay = useMemo(() => {
        const words = activeTestimonial.quote.trim().split(/\s+/).length;

        return Math.min(5000, Math.max(7000, words * 120 + 2500));
    }, [activeTestimonial]);

    useEffect(() => {
        const section = sectionRef.current;

        if (!section) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.2 },
        );

        observer.observe(section);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (timerRef.current) {
            window.clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        if (
            paused ||
            !isVisible ||
            !isPageVisible
        ) {
            return;
        }

        timerRef.current = window.setTimeout(() => {
            setActiveIndex((current) => (current + 1) % testimonials.length);
        }, autoDelay);

        return () => {
            if (timerRef.current) {
                window.clearTimeout(timerRef.current);
            }
        };
    }, [activeIndex, paused, isVisible, isPageVisible, autoDelay]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsPageVisible(!document.hidden);
        };

        handleVisibilityChange();
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    const selectSlide = (index: number) => {
        setActiveIndex((index + testimonials.length) % testimonials.length);
    };

    const handlePrevious = () => {
        selectSlide(activeIndex - 1);
    };

    const handleNext = () => {
        selectSlide(activeIndex + 1);
    };

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.pointerType === "mouse") return;

        pointerStartRef.current = {
            x: event.clientX,
            y: event.clientY,
        };
    };

    const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
        const pointerStart = pointerStartRef.current;

        if (!pointerStart) return;

        const dx = event.clientX - pointerStart.x;
        const dy = event.clientY - pointerStart.y;

        pointerStartRef.current = null;

        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) {
            if (dx < 0) {
                handleNext();
            } else {
                handlePrevious();
            }
        }
    };

    return (
        <section
            ref={sectionRef}
            id="client-testimonials"
            aria-labelledby="testimonials-title"
            className="relative isolate flex min-h-screen flex-col items-center justify-center gap-8 overflow-hidden bg-[#12081e] px-5 py-14 text-white sm:px-6 lg:gap-10 lg:px-8 lg:py-16"
        >
            <SectionEdgeFade />
            {/* Purple wave atmosphere */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(180deg,#12081e_0%,#27123f_30%,#53239a_58%,#652cd8_68%,#24103d_84%,#12081e_100%)] [mask-image:linear-gradient(180deg,transparent_0%,transparent_8%,black_36%,black_82%,transparent_100%)] [-webkit-mask-image:linear-gradient(180deg,transparent_0%,transparent_8%,black_36%,black_82%,transparent_100%)]" />

            <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[64%] -z-10 h-[60%] w-[115%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(110,47,215,.56)_0%,rgba(74,28,147,.28)_40%,transparent_74%)] blur-[55px]" />

            <header className="relative z-10 text-center">
                <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.16em] text-[#c1a9d6] sm:text-xs">
                    Client Testimonials
                </p>

                <h2 id="testimonials-title" className="m-0 text-[36px] font-light leading-[1.05] tracking-[-0.055em] text-[#faf7ff] sm:text-[46px] md:text-[52px] lg:text-[56px]">
                    What Our Clients Say
                    <span className="mt-1 block font-semibold text-[#bda2e5]">
                        After Go-Live
                    </span>
                </h2>
            </header>

            <div
                ref={sliderRef}
                role="region"
                aria-roledescription="carousel"
                aria-label="Client testimonials"
                onKeyDown={(event) => {
                    if (
                        event.altKey ||
                        event.ctrlKey ||
                        event.metaKey ||
                        event.shiftKey
                    ) {
                        return;
                    }

                    if (event.key === "ArrowLeft") {
                        event.preventDefault();
                        handlePrevious();
                    }

                    if (event.key === "ArrowRight") {
                        event.preventDefault();
                        handleNext();
                    }
                }}
                className="relative z-10 w-full max-w-[1220px] rounded-[5px] border border-[#eee1ff]/25 bg-[linear-gradient(135deg,rgba(241,230,255,.14),rgba(205,180,249,.04)_45%,rgba(27,16,43,.27)),rgba(22,12,40,.54)] p-5 text-[#f7f0ff] shadow-[inset_0_1px_0_rgba(255,244,255,.21),inset_0_-1px_0_rgba(222,196,251,.08),0_14px_50px_rgba(6,2,14,.3)] backdrop-blur-[26px] backdrop-saturate-[1.3] sm:p-7 lg:p-10"
            >
                <div
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={() => {
                        pointerStartRef.current = null;
                    }}
                    className="grid touch-pan-y"
                >
                    {testimonials.map((testimonial, index) => {
                        const isActive = index === activeIndex;

                        return (
                            <figure
                                key={testimonial.name}
                                aria-hidden={!isActive}
                                className={`col-start-1 row-start-1 m-0 grid min-w-0 grid-cols-[minmax(0,1fr)_96px] grid-rows-[auto_1fr_auto] items-center gap-x-4 gap-y-5 transition-all duration-500 sm:grid-cols-[minmax(0,1fr)_180px] sm:gap-x-8 md:grid-cols-[minmax(0,1fr)_220px] lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-x-12 ${isActive ? "pointer-events-auto visible opacity-100" : "pointer-events-none invisible opacity-0"}`}
                            >
                                <div className="col-start-1 row-start-1 flex min-h-[92px] flex-col items-start justify-center gap-3 sm:min-h-0 sm:flex-row sm:items-center sm:justify-start sm:gap-4">
                                    <img
                                        src={testimonial.logo}
                                        alt={testimonial.name}
                                        loading="lazy"
                                        decoding="async"
                                        className={`h-[34px] ${index === 0 ? 'w-0': 'w-[110px]'} object-contain object-left ${testimonial.logoClassName ?? "brightness-0 invert opacity-90"}`}
                                    />

                                    <span className="text-[10px] tracking-[0.02em] text-[#c9b8d8] sm:border-l sm:border-[#dac3ef]/25 sm:pl-4 sm:text-[11px]">
                                        {testimonial.handle}
                                    </span>
                                </div>

                                <blockquote className="col-span-2 col-start-1 row-start-2 m-0 self-start text-[18px] font-normal leading-[1.6] tracking-[-0.025em] text-[#f5effc] sm:col-span-1 sm:text-[20px] md:text-[22px] lg:text-[25px] lg:leading-[1.5]">
                                    “{testimonial.quote}”
                                </blockquote>

                                <figcaption className="col-span-2 col-start-1 row-start-3 relative flex flex-col gap-1 pl-7 text-[12px] leading-[1.5] tracking-[-0.015em] text-[#cbbdd7] sm:col-span-1 sm:pl-9 sm:text-[13px]">
                                    <span className="absolute left-0 top-[10px] h-px w-[18px] bg-[#b9a0d0] sm:w-[23px]" />

                                    <strong className="text-[14px] font-bold leading-[1.4] text-[#fff8ff] sm:text-[15px]">
                                        {testimonial.name}
                                    </strong>

                                    <span>{testimonial.role}</span>
                                </figcaption>

                                <div className="col-start-2 row-start-1 h-[128px] w-[96px] overflow-hidden rounded-[4px] border border-[#f4e6ff]/15 bg-[#271933] sm:row-span-3 sm:h-auto sm:w-full sm:aspect-[3/4]">
                                    <img
                                        src={testimonial.portrait}
                                        alt={testimonial.name}
                                        loading="lazy"
                                        decoding="async"
                                        className={`h-full w-full object-cover ${testimonial.portraitClassName ?? "object-center"}`}
                                    />
                                </div>
                            </figure>
                        );
                    })}
                </div>

                <div className="mt-6 flex items-center justify-between gap-2 border-t border-[#d8b9f0]/15 pt-5 sm:mt-7 sm:gap-4 sm:pt-6">
                    <div className="flex items-center">
                        {testimonials.map((testimonial, index) => {
                            const isActive = index === activeIndex;

                            return (
                                <button
                                    key={testimonial.name}
                                    type="button"
                                    onClick={() => selectSlide(index)}
                                    aria-label={`Show ${testimonial.name}'s testimonial`}
                                    aria-current={isActive ? "true" : undefined}
                                    className="relative grid h-9 w-7 place-items-center sm:h-11 sm:w-9"
                                >
                                    {isActive ? (
                                        <>
                                            <span className="absolute h-[14px] w-[14px] rounded-full border border-[#dcc1f5]/40" />
                                            <span className="h-[6px] w-[6px] rounded-full bg-[#e5caff]" />
                                        </>
                                    ) : (
                                        <span className="h-[3.5px] w-[3.5px] rounded-full bg-[#bfa8d2]" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2">
                        <span className="mr-1 hidden whitespace-nowrap text-[10px] tracking-[0.12em] text-[#a994bb] sm:block sm:text-[11px]">
                            <span className="text-[#e7d3f7]">
                                {String(activeIndex + 1).padStart(2, "0")}
                            </span>{" "}
                            / {String(testimonials.length).padStart(2, "0")}
                        </span>

                        <button
                            type="button"
                            onClick={() => setPaused((current) => !current)}
                            aria-label={paused ? "Play automatic testimonials" : "Pause automatic testimonials"}
                            aria-pressed={paused}
                            className="grid h-10 w-9 place-items-center text-[#e6d5f4] transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9b4fc] sm:h-11 sm:w-11"
                        >
                            {paused ? (
                                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
                                    <path d="m9 6 9 6-9 6V6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
                                    <path d="M9 6v12M15 6v12" stroke="currentColor" strokeWidth="1.7" />
                                </svg>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handlePrevious}
                            aria-label="Previous testimonial"
                            className="grid h-10 w-10 place-items-center rounded-[4px] border border-[#dbc4f0]/25 bg-transparent text-[#e6d5f4] transition hover:border-[#d0adef] hover:bg-[#dab5ff]/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9b4fc] sm:h-11 sm:w-11"
                        >
                            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
                                <path d="m14 7-5 5 5 5M9 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        <button
                            type="button"
                            onClick={handleNext}
                            aria-label="Next testimonial"
                            className="grid h-10 w-10 place-items-center rounded-[4px] border border-[#dbc4f0]/25 bg-transparent text-[#e6d5f4] transition hover:border-[#d0adef] hover:bg-[#dab5ff]/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9b4fc] sm:h-11 sm:w-11"
                        >
                            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
                                <path d="m10 7 5 5-5 5M5 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>

                <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
                    Testimonial {activeIndex + 1} of {testimonials.length}: {activeTestimonial.name}
                </p>
            </div>
        </section>
    );
};

export default TestimonialsSection;