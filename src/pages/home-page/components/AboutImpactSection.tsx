import { useEffect, useRef, useState } from "react";

import projectsBackground from "@/assets/about/projects-background.mp4";
import ludovicoMassari from "@/assets/about/ludovico-massari.jpeg";
import divcLogo from "@/assets/about/divc.svg";
import dataMotion from "@/assets/about/data-motion.mp4";

type VideoCardProps = {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    isPaused: boolean;
    onToggle: () => void;
    label: string;
};

const VideoControl = ({
    // videoRef,
    isPaused,
    onToggle,
    label,
}: VideoCardProps) => {
    return (
        <button
            type="button"
            onClick={onToggle}
            aria-label={`${isPaused ? "Play" : "Pause"} ${label} video`}
            aria-pressed={isPaused}
            className="absolute right-4 top-4 z-30 grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-[#11091d]/50 text-white backdrop-blur-md transition hover:bg-[#211233]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a8ff]"
        >
            {isPaused ? (
                <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-4 w-4"
                >
                    <path d="M6 3.5 16 10 6 16.5z" />
                </svg>
            ) : (
                <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-4 w-4"
                >
                    <rect x="5" y="4" width="3" height="12" rx=".7" />
                    <rect x="12" y="4" width="3" height="12" rx=".7" />
                </svg>
            )}
        </button>
    );
};

const AboutImpactSection = () => {
    const projectsVideoRef = useRef<HTMLVideoElement | null>(null);
    const dataVideoRef = useRef<HTMLVideoElement | null>(null);

    const projectsCardRef = useRef<HTMLElement | null>(null);
    const dataCardRef = useRef<HTMLElement | null>(null);

    const [projectsPaused, setProjectsPaused] = useState(false);
    const [dataPaused, setDataPaused] = useState(false);

    const projectsPausedRef = useRef(false);
    const dataPausedRef = useRef(false);

    useEffect(() => {
        projectsPausedRef.current = projectsPaused;
    }, [projectsPaused]);

    useEffect(() => {
        dataPausedRef.current = dataPaused;
    }, [dataPaused]);

    useEffect(() => {
        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        );

        const setups = [
            {
                card: projectsCardRef.current,
                video: projectsVideoRef.current,
                getPaused: () => projectsPausedRef.current,
                setPaused: setProjectsPaused,
            },
            {
                card: dataCardRef.current,
                video: dataVideoRef.current,
                getPaused: () => dataPausedRef.current,
                setPaused: setDataPaused,
            },
        ];

        const cleanups: Array<() => void> = [];

        setups.forEach(({ card, video, getPaused, setPaused }) => {
            if (!card || !video) return;

            let visible = false;

            video.muted = true;
            video.loop = true;
            video.playsInline = true;

            const sync = () => {
                const shouldPause =
                    !visible ||
                    document.hidden ||
                    getPaused() ||
                    reducedMotion.matches;

                if (shouldPause) {
                    video.pause();
                    return;
                }

                video.play().catch(() => {
                    setPaused(true);
                });
            };

            const observer = new IntersectionObserver(
                ([entry]) => {
                    visible = entry.isIntersecting;
                    sync();
                },
                {
                    threshold: 0.08,
                },
            );

            observer.observe(card);

            const handleVisibility = () => sync();

            const handleReducedMotion = () => {
                if (reducedMotion.matches) {
                    setPaused(true);
                }

                sync();
            };

            document.addEventListener(
                "visibilitychange",
                handleVisibility,
            );

            reducedMotion.addEventListener(
                "change",
                handleReducedMotion,
            );

            cleanups.push(() => {
                observer.disconnect();

                document.removeEventListener(
                    "visibilitychange",
                    handleVisibility,
                );

                reducedMotion.removeEventListener(
                    "change",
                    handleReducedMotion,
                );

                video.pause();
            });
        });

        return () => {
            cleanups.forEach((cleanup) => cleanup());
        };
    }, []);

    const toggleProjectsVideo = () => {
        const video = projectsVideoRef.current;

        if (!video) return;

        if (video.paused) {
            projectsPausedRef.current = false;
            setProjectsPaused(false);

            video.play().catch(() => {
                projectsPausedRef.current = true;
                setProjectsPaused(true);
            });
        } else {
            projectsPausedRef.current = true;
            setProjectsPaused(true);
            video.pause();
        }
    };

    const toggleDataVideo = () => {
        const video = dataVideoRef.current;

        if (!video) return;

        if (video.paused) {
            dataPausedRef.current = false;
            setDataPaused(false);

            video.play().catch(() => {
                dataPausedRef.current = true;
                setDataPaused(true);
            });
        } else {
            dataPausedRef.current = true;
            setDataPaused(true);
            video.pause();
        }
    };

    return (
        <section
            id="about-bonotech"
            aria-labelledby="about-title"
            className="relative isolate overflow-hidden bg-[#12091D] px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-[110px]"
        >
            {/* Background */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
            >
                {/* Base */}
                <div className="absolute inset-0 bg-[#12091D]" />

                {/* Subtle center ambience */}
                <div className="absolute left-1/2 top-[52%] h-[82%] w-[115%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(79,42,123,0.22)_0%,rgba(56,29,88,0.15)_38%,rgba(35,19,55,0.07)_60%,transparent_80%)] blur-[48px]" />

                {/* Slight purple lift behind cards */}
                <div className="absolute left-1/2 top-[64%] h-[48%] w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[#542B80]/[0.08] blur-[105px]" />

                {/* Top dark falloff */}
                <div className="absolute inset-x-0 top-0 h-[155px] bg-gradient-to-b from-[#09060E] via-[#0D0714]/75 to-transparent" />

                {/* Bottom dark falloff */}
                <div className="absolute inset-x-0 bottom-0 h-[160px] bg-gradient-to-t from-[#09060E] via-[#0D0714]/70 to-transparent" />
            </div>

            <div className="relative z-10 mx-auto w-full max-w-[1200px]">
                {/* Heading */}
                <header className="mx-auto mb-10 max-w-[850px] text-center sm:mb-12 lg:mb-[52px]">
                    <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.16em] text-[#c0aed9] sm:text-xs">
                        About Bonotech
                    </p>

                    <h2
                        id="about-title"
                        className="text-[38px] font-light leading-[1.04] tracking-[-0.05em] text-white sm:text-[48px] md:text-[56px] lg:text-[60px]"
                    >
                        Built for Business

                        <span className="mt-1 block font-semibold text-[#c9a9f2]">
                            Proven in Practice
                        </span>
                    </h2>

                    <p className="mx-auto mt-5 max-w-[570px] text-[15px] font-light leading-[1.55] tracking-[-0.025em] text-[#cec0dd] sm:text-base md:text-[17px]">
                        A global consulting partner dedicated to building
                        <br className="hidden sm:block" />
                        smarter and more adaptive tech.
                    </p>
                </header>

                {/* Bento */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr] lg:grid-rows-[minmax(370px,1fr)_118px] lg:gap-[18px]">
                    {/* Projects */}
                    <article
                        ref={projectsCardRef}
                        aria-labelledby="projects-title"
                        className="group relative isolate flex min-h-[520px] overflow-hidden rounded-[5px] border border-white/15 bg-[#241038] md:min-h-[570px] lg:row-span-2 lg:min-h-[560px]"
                    >
                        <div className="absolute inset-0 z-0 overflow-hidden">
                            <video
                                ref={projectsVideoRef}
                                src={projectsBackground}
                                muted
                                loop
                                playsInline
                                preload="metadata"
                                tabIndex={-1}
                                className="h-full w-full object-cover opacity-90"
                            />

                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,5,37,0.72)_0%,rgba(25,7,47,0.30)_42%,rgba(20,5,37,0.78)_77%,rgba(18,4,33,0.97)_100%)]" />
                        </div>

                        <VideoControl
                            videoRef={projectsVideoRef}
                            isPaused={projectsPaused}
                            onToggle={toggleProjectsVideo}
                            label="project"
                        />

                        <div className="relative z-10 mt-auto w-full p-7 sm:p-8 lg:p-[30px]">
                            <h3
                                id="projects-title"
                                className="m-0 font-normal text-white"
                            >
                                <span className="block text-[86px] font-light leading-[0.88] tracking-[-0.075em] sm:text-[96px] lg:text-[104px]">
                                    23
                                    <span className="text-[0.55em]">+</span>
                                </span>

                                <span className="mt-8 block max-w-[230px] text-[19px] font-light leading-[1.42] tracking-[-0.045em] text-[#f3eafb] sm:text-[20px]">
                                    projects—and that&apos;s just the last{" "}
                                    <strong className="font-semibold">
                                        6 months.
                                    </strong>
                                </span>
                            </h3>
                        </div>
                    </article>

                    {/* Commitment */}
                    <article
                        aria-labelledby="commitment-title"
                        className="relative isolate flex min-h-[600px] flex-col overflow-hidden rounded-[5px] border border-white/15 bg-[#44525b] p-5 text-white sm:p-6 md:min-h-[570px] lg:row-span-2 lg:min-h-[560px]"
                    >
                        <img
                            src={ludovicoMassari}
                            alt="Ludovico Massari beside a mountain river"
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 h-full w-full object-cover object-[55%_48%]"
                        />

                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,10,24,0.56)_0%,rgba(15,10,23,0.10)_38%,rgba(13,8,20,0.12)_55%,rgba(13,8,20,0.66)_100%)]" />

                        <div className="relative z-10 flex items-center justify-between px-1 pt-1">
                            <h3
                                id="commitment-title"
                                className="text-[16px] font-light tracking-[-0.035em] sm:text-[18px]"
                            >
                                Measurable Commitment
                            </h3>

                            <span
                                aria-hidden="true"
                                className="relative h-[14px] w-[14px]"
                            >
                                <span className="absolute bottom-0 left-0 h-[9px] w-[9px] border border-white/80" />
                                <span className="absolute right-0 top-0 h-[4px] w-[4px] bg-white/80" />
                            </span>
                        </div>

                        <p className="relative z-10 mt-3 text-[70px] font-light leading-none tracking-[-0.075em] sm:text-[78px] lg:text-[82px]">
                            100
                            <span className="text-[0.58em]">%</span>
                        </p>

                        <figure className="relative z-10 mt-auto rounded-[4px] bg-[#faf8fd] p-6 text-[#242128] shadow-[0_14px_35px_rgba(10,5,20,0.22)] sm:p-7">
                            <blockquote className="m-0 text-[17px] leading-[1.52] tracking-[-0.035em] sm:text-[18px]">
                                <p>
                                    “Their automation strategy completely
                                    reshaped how we work. It&apos;s efficient,
                                    intelligent, and seamless.”
                                </p>
                            </blockquote>

                            <figcaption className="mt-5 flex items-center justify-between gap-4 border-t border-[#ddd4e7] pt-4">
                                <div className="flex min-w-0 flex-col gap-1">
                                    <span className="text-[14px] font-semibold tracking-[-0.035em] text-[#242128] sm:text-[15px]">
                                        Ludovico Massari
                                    </span>

                                    <span className="text-[12px] tracking-[-0.02em] text-[#777077] sm:text-[13px]">
                                        Head of Marketing
                                    </span>
                                </div>

                                <img
                                    src={divcLogo}
                                    alt="DIVC"
                                    loading="lazy"
                                    decoding="async"
                                    className="h-auto w-[58px] flex-shrink-0 sm:w-[64px]"
                                />
                            </figcaption>
                        </figure>
                    </article>

                    {/* Data */}
                    <article
                        ref={dataCardRef}
                        aria-labelledby="data-title"
                        className="relative isolate flex min-h-[365px] flex-col overflow-hidden rounded-[5px] border border-white/15 bg-[#250d3d] p-7 text-white sm:p-8 lg:min-h-0"
                    >
                        <div className="absolute inset-0 z-0 overflow-hidden">
                            <video
                                ref={dataVideoRef}
                                src={dataMotion}
                                muted
                                loop
                                playsInline
                                preload="metadata"
                                tabIndex={-1}
                                className="h-full w-full object-cover opacity-90 grayscale"
                            />

                            <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(24,6,44,0.84)_0%,rgba(60,20,105,0.60)_52%,rgba(20,5,38,0.93)_100%)]" />
                        </div>

                        <VideoControl
                            videoRef={dataVideoRef}
                            isPaused={dataPaused}
                            onToggle={toggleDataVideo}
                            label="data"
                        />

                        <h3
                            id="data-title"
                            className="relative z-10 text-[17px] font-light tracking-[-0.035em] sm:text-[18px]"
                        >
                            Data Points
                        </h3>

                        <p className="relative z-10 mt-5 whitespace-nowrap text-[68px] font-light leading-none tracking-[-0.075em] sm:text-[76px] lg:text-[80px]">
                            520k
                            <span className="text-[0.55em]">+</span>
                        </p>

                        <p className="relative z-10 mt-auto max-w-[270px] pt-10 text-[15px] font-light leading-[1.55] tracking-[-0.025em] text-[#f0e5fa] sm:text-base">
                            Analyzed monthly to power smarter tech for
                            businesses.
                        </p>
                    </article>

                    {/* CTA */}
                    <button
                        type="button"
                        className="group relative isolate flex min-h-[118px] items-center justify-between overflow-hidden rounded-[5px] border border-white/15 bg-[#211033] px-7 text-left text-white transition hover:border-[#c6a1f0]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a5f7] sm:px-8 lg:min-h-0"
                    >
                        <span className="absolute inset-0 origin-bottom scale-y-0 bg-[linear-gradient(125deg,#6d39bd,#4a217f)] transition-transform duration-500 ease-out group-hover:scale-y-100 group-focus-visible:scale-y-100" />

                        <span className="relative z-10 text-[21px] font-light tracking-[-0.04em] sm:text-[23px]">
                            Get In Touch
                        </span>

                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                            className="relative z-10 h-6 w-6 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                        >
                            <path
                                d="M5 19 19 5M5 5h14v14"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default AboutImpactSection;