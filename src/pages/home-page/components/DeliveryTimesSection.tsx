import { useCallback, useEffect, useRef, useState } from "react";

import websiteVideo from "@/assets/delivery/website-background.mp4";
import appVideo from "@/assets/delivery/mobile-september-background.mp4";
import enterpriseVideo from "@/assets/delivery/enterprise-updated-background.mp4";

type DeliveryItem = {
    id: number;
    value: string;
    unit: string;
    descriptionPrefix: string;
    descriptionStrong: string;
    video: string;
    label: string;
};

const deliveryItems: DeliveryItem[] = [
    {
        id: 0,
        value: "3",
        unit: "Days",
        descriptionPrefix: "Average time to develop a full-fledged",
        descriptionStrong: "website.",
        video: websiteVideo,
        label: "Website",
    },
    {
        id: 1,
        value: "30",
        unit: "Days",
        descriptionPrefix: "Average time to develop a full",
        descriptionStrong: "mobile + web app.",
        video: appVideo,
        label: "Mobile + Web App",
    },
    {
        id: 2,
        value: "60",
        unit: "Days",
        descriptionPrefix: "Average time to develop",
        descriptionStrong: "enterprise-grade software.",
        video: enterpriseVideo,
        label: "Enterprise-Grade Software",
    },
];

const DeliveryTimesSection = () => {
    const sectionRef = useRef<HTMLElement | null>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
    const dragStartX = useRef<number | null>(null);

    const [activeIndex, setActiveIndex] = useState(1);
    const [videosPaused, setVideosPaused] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);

    const syncVideos = useCallback(() => {
        videoRefs.current.forEach((video) => {
            if (!video) return;

            video.muted = true;

            if (isVisible && !document.hidden && !videosPaused && !reducedMotion) {
                video.play().catch(() => { });
            } else {
                video.pause();
            }
        });
    }, [isVisible, videosPaused, reducedMotion]);

    useEffect(() => {
        const preference = window.matchMedia("(prefers-reduced-motion: reduce)");

        const handlePreferenceChange = () => {
            setReducedMotion(preference.matches);

            if (preference.matches) {
                setVideosPaused(true);
            }
        };

        handlePreferenceChange();

        preference.addEventListener("change", handlePreferenceChange);

        return () => {
            preference.removeEventListener("change", handlePreferenceChange);
        };
    }, []);

    useEffect(() => {
        const section = sectionRef.current;

        if (!section) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.05 },
        );

        observer.observe(section);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        syncVideos();

        const handleVisibilityChange = () => {
            syncVideos();
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [syncVideos]);

    const selectCard = (index: number) => {
        const next = (index + deliveryItems.length) % deliveryItems.length;

        setActiveIndex(next);

        if (window.innerWidth < 768) {
            cardRefs.current[next]?.scrollIntoView({
                behavior: reducedMotion ? "auto" : "smooth",
                inline: "center",
                block: "nearest",
            });
        }
    };

    const handlePrevious = () => {
        selectCard(activeIndex - 1);
    };

    const handleNext = () => {
        selectCard(activeIndex + 1);
    };

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        dragStartX.current = event.clientX;
    };

    const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
        if (dragStartX.current === null) return;

        const difference = event.clientX - dragStartX.current;

        if (Math.abs(difference) > 45) {
            if (difference < 0) {
                handleNext();
            } else {
                handlePrevious();
            }
        }

        dragStartX.current = null;
    };

    return (
        <section
            ref={sectionRef}
            id="delivery-times"
            aria-labelledby="delivery-times-title"
            onKeyDown={(event) => {
                if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    handlePrevious();
                }

                if (event.key === "ArrowRight") {
                    event.preventDefault();
                    handleNext();
                }
            }}
            className="relative isolate flex min-h-screen items-center overflow-hidden bg-[#110a1d] px-5 py-20 text-white sm:px-6 md:py-24 lg:px-8 lg:py-[90px]"
        >
            {/* Background */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-30 bg-[#110a1d]" />

            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_50%_48%,rgba(91,56,139,0.30)_0%,rgba(57,34,85,0.20)_38%,rgba(25,15,39,0.08)_63%,transparent_80%)]" />

            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[160px] bg-gradient-to-b from-[#0a0710] via-[#0f0919]/90 to-transparent" />

            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[170px] bg-gradient-to-t from-[#0a0710] via-[#0f0919]/85 to-transparent" />

            <div className="mx-auto w-full max-w-[1200px]">
                {/* Heading */}
                <header className="mx-auto mb-[34px] max-w-[650px] text-center sm:mb-10 lg:mb-[38px]">
                    <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-[#a994bd] sm:text-[11px]">
                        Average Delivery Times
                    </p>

                    <h2 id="delivery-times-title" className="m-0 text-[36px] font-light leading-[1.05] tracking-[-0.05em] text-[#f7f1fb] sm:text-[44px] md:text-[49px] lg:text-[52px]">
                        Built for Momentum
                        <span className="mt-1 block font-semibold text-[#ba94e0]">
                            Measured in Days
                        </span>
                    </h2>

                    <p className="mx-auto mt-4 max-w-[480px] text-[13px] font-light leading-[1.5] tracking-[-0.025em] text-[#a99db3] sm:text-[14px]">
                        These are Bonotech&apos;s average build times for websites,
                        <br className="hidden sm:block" />
                        mobile and web apps, and enterprise-grade software.
                    </p>
                </header>

                {/* Carousel */}
                <div role="region" aria-roledescription="carousel" aria-label="Average delivery times" className="relative">
                    <div
                        onPointerDown={handlePointerDown}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={() => {
                            dragStartX.current = null;
                        }}
                        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-5 lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0"
                    >
                        {deliveryItems.map((item, index) => {
                            const isActive = activeIndex === index;

                            return (
                                <div
                                    key={item.id}
                                    ref={(element) => {
                                        cardRefs.current[index] = element;
                                    }}
                                    role="group"
                                    aria-roledescription="slide"
                                    aria-label={`${index + 1} of ${deliveryItems.length}: ${item.label}`}
                                    className="relative h-[359px] w-[min(84vw,385px)] flex-none snap-center overflow-hidden rounded-[4px] border border-[#4d3d5e]/55 bg-[linear-gradient(145deg,#1b1226_0%,#160d21_55%,#12091c_100%)] shadow-[0_20px_38px_-18px_rgba(0,0,0,.85)] md:w-[385px] lg:w-full lg:max-w-[385px]"
                                >
                                    <button type="button" aria-label={`Bring ${item.label} to the center`} aria-pressed={isActive} onClick={() => selectCard(index)} className="absolute inset-0 z-20 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#b993df]" />

                                    <div className="relative z-10 px-[22px] pt-[22px]">
                                        <h3 className="m-0 whitespace-nowrap text-[55px] font-extralight leading-[0.98] tracking-[-0.075em] text-[#e5deeb] sm:text-[58px] lg:text-[60px]">
                                            {item.value}
                                            <span className="ml-2 font-extralight tracking-[-0.06em]">
                                                {item.unit}
                                            </span>
                                        </h3>

                                        <p className="mt-[12px] max-w-[310px] text-[12px] font-light leading-[1.5] tracking-[-0.02em] text-[#9d91a8] sm:text-[13px]">
                                            {item.descriptionPrefix}{" "}
                                            <strong className="font-semibold text-[#d9d0df]">
                                                {item.descriptionStrong}
                                            </strong>
                                        </p>
                                    </div>

                                    <div
                                        className="absolute bottom-[22px] left-[22px] right-[22px] h-[139px] overflow-hidden rounded-[3px] bg-transparent"
                                        style={{
                                            WebkitMaskImage:
                                                "linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent), linear-gradient(180deg, transparent, #000 8%, #000 92%, transparent)",
                                            maskImage:
                                                "linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent), linear-gradient(180deg, transparent, #000 8%, #000 92%, transparent)",
                                            WebkitMaskComposite: "source-in",
                                            maskComposite: "intersect",
                                        }}
                                    >
                                        <video
                                            ref={(element) => {
                                                videoRefs.current[index] = element;
                                            }}
                                            src={item.video}
                                            muted
                                            loop
                                            playsInline
                                            preload="metadata"
                                            tabIndex={-1}
                                            aria-hidden="true"
                                            className="pointer-events-none h-full w-full object-cover opacity-90 grayscale contrast-[1.1]"
                                        />

                                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(20,6,40,.77),rgba(59,18,104,.66)_55%,rgba(19,5,39,.9))]" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Navigation */}
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <button type="button" onClick={handlePrevious} aria-label="Previous delivery card" className="grid h-9 w-9 place-items-center rounded-[4px] border border-[#4c3b5f]/65 bg-[#150c20]/85 text-[#b6a5c5] transition hover:border-[#8a67aa] hover:bg-[#21122f] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a57acb]">
                            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-[16px] w-[16px]">
                                <path d="m14 7-5 5 5 5M9 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        <div className="flex items-center gap-[11px]" aria-label="Choose a delivery timeline">
                            {deliveryItems.map((item, index) => {
                                const isActive = activeIndex === index;

                                return (
                                    <button key={item.id} type="button" onClick={() => selectCard(index)} aria-label={`Show ${item.label}`} aria-current={isActive ? "true" : undefined} className="relative grid h-4 w-4 place-items-center">
                                        {isActive ? (
                                            <>
                                                <span className="absolute h-[12px] w-[12px] rounded-full border border-[#9676b7]/85" />
                                                <span className="h-[4px] w-[4px] rounded-full bg-[#a787ca]" />
                                            </>
                                        ) : (
                                            <span className="h-[3px] w-[3px] rounded-full bg-[#785d90]" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <button type="button" onClick={handleNext} aria-label="Next delivery card" className="grid h-9 w-9 place-items-center rounded-[4px] border border-[#4c3b5f]/65 bg-[#150c20]/85 text-[#b6a5c5] transition hover:border-[#8a67aa] hover:bg-[#21122f] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a57acb]">
                            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-[16px] w-[16px]">
                                <path d="m10 7 5 5-5 5M5 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        <button type="button" onClick={() => setVideosPaused((current) => !current)} aria-label={videosPaused ? "Play delivery videos" : "Pause delivery videos"} aria-pressed={videosPaused} className="grid h-9 w-9 place-items-center text-[#a99ab6] transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a57acb]">
                            {videosPaused ? (
                                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-[17px] w-[17px]">
                                    <path d="m9 6 9 6-9 6V6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-[17px] w-[17px]">
                                    <path d="M9 6v12M15 6v12" stroke="currentColor" strokeWidth="1.6" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
                        {deliveryItems[activeIndex].value} {deliveryItems[activeIndex].unit}. {deliveryItems[activeIndex].descriptionPrefix} {deliveryItems[activeIndex].descriptionStrong}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default DeliveryTimesSection;
