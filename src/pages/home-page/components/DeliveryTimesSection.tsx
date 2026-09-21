import { useCallback, useEffect, useRef, useState } from "react";

import websiteVideo from "@/assets/delivery/website-background.mp4";
import appVideo from "@/assets/delivery/mobile-september-background.mp4";
import enterpriseVideo from "@/assets/delivery/enterprise-updated-background.mp4";
import SectionEdgeFade from "./SectionEdgeFade";

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
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    const [videosPaused, setVideosPaused] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);

    const syncVideos = useCallback(() => {
        videoRefs.current.forEach((video) => {
            if (!video) return;

            video.muted = true;

            if (isVisible && !document.hidden && !videosPaused && !reducedMotion) {
                video.play().catch(() => {});
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

    return (
        <section
            ref={sectionRef}
            id="delivery-times"
            aria-labelledby="delivery-times-title"
            className="relative isolate flex min-h-screen items-center overflow-hidden bg-[#110a1d] px-5 py-20 text-white sm:px-6 md:py-24 lg:px-8 lg:py-[90px]"
        >
            {/* Background */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-30 bg-[#110a1d]"
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_50%_48%,rgba(91,56,139,0.30)_0%,rgba(57,34,85,0.20)_38%,rgba(25,15,39,0.08)_63%,transparent_80%)]"
            />

            <SectionEdgeFade />

            <div className="relative z-10 mx-auto w-full max-w-[1200px]">
                {/* Heading */}
                <header className="mx-auto mb-[34px] max-w-[650px] text-center sm:mb-10 lg:mb-[38px]">
                    <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-[#a994bd] sm:text-[11px]">
                        Average Delivery Times
                    </p>

                    <h2
                        id="delivery-times-title"
                        className="m-0 text-[36px] font-light leading-[1.05] tracking-[-0.05em] text-[#f7f1fb] sm:text-[44px] md:text-[49px] lg:text-[52px]"
                    >
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

                {/* Static responsive layout: 2 + 1 on small/tablet screens, 3 side by side from 768px+ */}
                <div
                    role="region"
                    aria-label="Average delivery times"
                    className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3"
                >
                    {deliveryItems.map((item, index) => (
                        <div
                            key={item.id}
                            role="group"
                            aria-label={`${item.label}: ${item.value} ${item.unit}`}
                            className={`relative h-[359px] w-full overflow-hidden rounded-[4px] border border-[#4d3d5e]/55 bg-[linear-gradient(145deg,#1b1226_0%,#160d21_55%,#12091c_100%)] shadow-[0_20px_38px_-18px_rgba(0,0,0,.85)] ${
                                index === deliveryItems.length - 1
                                    ? "sm:col-span-2 sm:w-[calc(50%_-_10px)] sm:justify-self-center md:col-span-1 md:w-full md:justify-self-auto"
                                    : ""
                            }`}
                        >
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
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DeliveryTimesSection;