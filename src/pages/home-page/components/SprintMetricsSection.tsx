import { useEffect, useRef, useState } from "react";

const SprintMetricsSection = () => {
    const sectionRef = useRef<HTMLElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const preference = window.matchMedia("(prefers-reduced-motion: reduce)");

        const syncPreference = () => {
            setReducedMotion(preference.matches);
        };

        syncPreference();
        preference.addEventListener("change", syncPreference);

        return () => {
            preference.removeEventListener("change", syncPreference);
        };
    }, []);

    useEffect(() => {
        const section = sectionRef.current;

        if (!section) return;

        if (reducedMotion || !("IntersectionObserver" in window)) {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;

                setIsVisible(true);
                observer.disconnect();
            },
            { threshold: 0.12 },
        );

        observer.observe(section);

        return () => observer.disconnect();
    }, [reducedMotion]);

    return (
        <section ref={sectionRef} id="sprint-numbers" aria-labelledby="sprint-metrics-title" className="relative overflow-hidden bg-[#12091D] px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-[110px]">
            <div className="mx-auto w-full max-w-[1200px]">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[180px_177px_200px_180px] lg:gap-5">
                    {/* Heading */}
                    <header className={`relative z-10 pb-7 transition-all duration-700 ease-out md:col-span-2 lg:col-span-1 lg:row-span-1 lg:pb-0 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
                        <div className="mb-5 flex h-3 items-center gap-[5px]">
                            <span className="h-2 w-2 bg-[#AC89EC]" />
                            <span className="h-2 w-2 bg-[#AC89EC]/70" />
                            <span className="h-2 w-2 bg-[#AC89EC]/40" />
                            <span className="h-2 w-2 bg-[#AC89EC]/20" />
                        </div>

                        <h2 id="sprint-metrics-title" className="m-0 max-w-[330px] text-[40px] font-normal leading-[1.05] tracking-[-0.06em] text-[#F8F5FD] sm:text-[44px] lg:text-[46px]">
                            <span className="block">Numbers That</span>
                            <span className="block">Define Our</span>
                            <span className="block font-bold text-[#B99BED]">Sprints</span>
                        </h2>
                    </header>

                    {/* Development */}
                    <article
                        className={`group relative flex min-h-[560px] flex-col overflow-hidden rounded-[4px] border border-[#E1D4F4]/20 bg-white px-7 pb-7 pt-7 text-[#2F1952] transition-all duration-700 ease-out hover:border-[#CAAEF6]/70 hover:shadow-[0_18px_45px_rgba(7,0,20,.18)] sm:px-8 md:min-h-[610px] lg:col-start-1 lg:row-start-2 lg:row-end-5 lg:min-h-0 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
                        style={{ transitionDelay: reducedMotion ? "0ms" : "80ms" }}
                    >
                        <div className="mb-7 flex items-center justify-between text-[12px] tracking-[0.04em] text-[#2F1952]/50">
                            <span>01</span>

                            <span className="relative block h-3 w-3 border border-current">
                                <span className="absolute -right-[5px] -top-[5px] h-1 w-1 bg-current" />
                            </span>
                        </div>

                        <div className="relative z-10">
                            <p className="mb-5 flex items-end text-[82px] font-normal leading-[0.94] tracking-[-0.075em] sm:text-[92px] lg:text-[100px]">
                                400
                                <span className="ml-[0.05em] text-[0.52em] tracking-[-0.07em]">%</span>
                            </p>

                            <h3 className="mb-3 text-[22px] font-bold leading-[1.18] tracking-[-0.055em] sm:text-[24px]">Faster Development</h3>

                            <p className="max-w-[31ch] text-[16px] font-light leading-[1.6] tracking-[-0.035em] text-[#665C74]">
                                Focused sprints, one team across the whole surface, and no hand-off lag between disciplines.
                            </p>
                        </div>

                        <svg viewBox="0 0 320 185" aria-hidden="true" focusable="false" className="mt-auto h-auto w-full max-w-[320px] self-center pt-8">
                            <defs>
                                <linearGradient id="growth-ink-react" x1="0" y1="1" x2="1" y2="0">
                                    <stop offset="0" stopColor="#2f1952" />
                                    <stop offset="1" stopColor="#8954e8" />
                                </linearGradient>
                            </defs>

                            <path d="M4 165H316" fill="none" stroke="currentColor" strokeOpacity=".12" />

                            <g fill="url(#growth-ink-react)" className="origin-bottom transition-transform duration-700 ease-out group-hover:-translate-y-1">
                                <path d="M10 143h10v10H10z M22 143h10v10H22z M22 131h10v10H22z M34 131h10v10H34z M46 131h10v10H46z M46 119h10v10H46z M58 119h10v10H58z M70 119h10v10H70z M70 107h10v10H70z M82 107h10v10H82z M94 107h10v10H94z M94 95h10v10H94z M106 95h10v10H106z M118 95h10v10H118z M118 83h10v10H118z M130 83h10v10H130z M142 83h10v10H142z M142 71h10v10H142z M154 71h10v10H154z M166 71h10v10H166z M166 59h10v10H166z M178 59h10v10H178z M190 59h10v10H190z M190 47h10v10H190z M202 47h10v10H202z M214 47h10v10H214z M214 35h10v10H214z M226 35h10v10H226z M238 35h10v10H238z M238 23h10v10H238z M250 23h10v10H250z M262 23h10v10H262z M262 11h10v10H262z M274 11h10v10H274z M286 11h10v10H286z" />
                            </g>

                            <g fill="#674ea5" opacity=".20">
                                <path d="M10 131h10v10H10z M46 143h10v10H46z M82 131h10v10H82z M106 71h10v10H106z M142 107h10v10H142z M178 83h10v10H178z M214 11h10v10H214z M250 47h10v10H250z M286 35h10v10H286z" />
                            </g>
                        </svg>
                    </article>

                    {/* Automation */}
                    <article
                        className={`group relative flex min-h-[610px] flex-col overflow-hidden rounded-[4px] border border-[#E1D4F4]/20 bg-[#EEE8F7] px-7 pb-8 pt-7 text-[#2F1952] transition-all duration-700 ease-out hover:border-[#CAAEF6]/70 hover:shadow-[0_18px_45px_rgba(7,0,20,.18)] sm:px-8 md:min-h-[650px] lg:col-start-2 lg:row-start-1 lg:row-end-4 lg:min-h-0 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
                        style={{ transitionDelay: reducedMotion ? "0ms" : "160ms" }}
                    >
                        <div className="mb-5 flex items-center justify-between text-[12px] tracking-[0.04em] text-[#2F1952]/50">
                            <span>02</span>

                            <span className="relative block h-3 w-3 border border-current">
                                <span className="absolute -right-[5px] -top-[5px] h-1 w-1 bg-current" />
                            </span>
                        </div>

                        <svg viewBox="0 0 320 278" aria-hidden="true" focusable="false" className="mx-auto h-auto w-full max-w-[320px] pb-3">
                            <g fill="none" stroke="#674ea5">
                                <circle cx="160" cy="137" r="111" strokeOpacity=".18" />
                                <circle cx="160" cy="137" r="82" strokeOpacity=".27" />
                                <circle cx="160" cy="137" r="52" strokeOpacity=".4" />
                            </g>

                            <g className="origin-center transition-transform duration-[1600ms] ease-[cubic-bezier(.2,.65,.2,1)] group-hover:rotate-[12deg]">
                                <rect x="43" y="116" width="25" height="25" rx="2" fill="#2f1952" />
                                <path d="M51 124h3v3h-3z M57 124h3v3h-3z M51 130h3v3h-3z M57 130h3v3h-3z" fill="#fff" />
                                <rect x="206" y="45" width="29" height="29" rx="2" fill="#652cd8" />
                                <path d="m216 59 3 3 6-7" fill="none" stroke="#fff" strokeWidth="2" />
                                <rect x="188" y="215" width="17" height="17" rx="1" fill="#674ea5" />
                                <rect x="247" y="163" width="10" height="10" fill="#b6a1d9" />
                                <rect x="105" y="60" width="9" height="9" fill="#b6a1d9" />
                            </g>

                            <rect x="137" y="114" width="46" height="46" rx="8" fill="#652cd8" />

                            <path d="M146 128h5v5h-5z M157.5 128h5v5h-5z M169 128h5v5h-5z M146 139h5v5h-5z M157.5 139h5v5h-5z M169 139h5v5h-5z" fill="#fff" />
                        </svg>

                        <div className="relative z-10 mt-auto pt-4">
                            <p className="mb-5 flex items-end text-[82px] font-normal leading-[0.94] tracking-[-0.075em] sm:text-[92px] lg:text-[100px]">
                                40
                                <span className="ml-[0.05em] text-[0.52em] tracking-[-0.07em]">%</span>
                            </p>

                            <h3 className="mb-3 text-[22px] font-bold leading-[1.18] tracking-[-0.055em] sm:text-[24px]">Less Repetitive Work</h3>

                            <p className="max-w-[31ch] text-[16px] font-light leading-[1.6] tracking-[-0.035em] text-[#665C74]">
                                AI-assisted capture, validation and intelligent RPA take the re-keying out of the day.
                            </p>
                        </div>
                    </article>

                    {/* QA */}
                    <article
                        className={`group relative flex min-h-[560px] flex-col overflow-hidden rounded-[4px] border border-[#E1D4F4]/20 bg-[#652CD8] px-7 pb-7 pt-7 text-white transition-all duration-700 ease-out hover:border-[#CAAEF6]/70 hover:shadow-[0_18px_45px_rgba(7,0,20,.22)] sm:px-8 md:col-span-2 md:min-h-[390px] lg:col-span-1 lg:col-start-3 lg:row-start-2 lg:row-end-5 lg:min-h-0 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
                        style={{ transitionDelay: reducedMotion ? "0ms" : "240ms" }}
                    >
                        <div className="mb-7 flex items-center justify-between text-[12px] tracking-[0.04em] text-[#D8C2FF]/65">
                            <span>03</span>

                            <span className="relative block h-3 w-3 border border-current">
                                <span className="absolute -right-[5px] -top-[5px] h-1 w-1 bg-current" />
                            </span>
                        </div>

                        <div className="relative z-10">
                            <p className="mb-5 flex items-end text-[82px] font-normal leading-[0.94] tracking-[-0.075em] sm:text-[92px] lg:text-[100px]">
                                200
                                <span className="ml-[0.05em] text-[0.52em] tracking-[-0.07em]">%</span>
                            </p>

                            <h3 className="mb-3 text-[22px] font-bold leading-[1.18] tracking-[-0.055em] sm:text-[24px]">Faster QA Cycles</h3>

                            <p className="max-w-[31ch] text-[16px] font-light leading-[1.6] tracking-[-0.035em] text-[#E9DCFF]">
                                Automated regression and continuous checks, so hardening does not become its own project.
                            </p>
                        </div>

                        <svg viewBox="0 0 320 192" aria-hidden="true" focusable="false" className="mt-auto h-auto w-full max-w-[320px] self-center pt-8">
                            <g className="transition-transform duration-700 ease-out group-hover:translate-x-1">
                                <rect x="5" y="15" width="44" height="44" rx="3" fill="#fff" fillOpacity=".12" />
                                <path d="m17 36 7 7 13-15" fill="none" stroke="#fff" strokeWidth="2" />
                                <path d="M72 28h119 M72 44h73" stroke="#fff" strokeOpacity=".22" strokeWidth="5" />
                                <rect x="274" y="30" width="14" height="14" fill="#fff" />
                            </g>

                            <g className="transition-transform duration-700 ease-out delay-75 group-hover:translate-x-1">
                                <rect x="5" y="75" width="44" height="44" rx="3" fill="#fff" fillOpacity=".12" />
                                <path d="m17 96 7 7 13-15" fill="none" stroke="#fff" strokeWidth="2" />
                                <path d="M72 88h158 M72 104h99" stroke="#fff" strokeOpacity=".22" strokeWidth="5" />
                                <rect x="274" y="90" width="14" height="14" fill="#fff" fillOpacity=".65" />
                            </g>

                            <g className="transition-transform duration-700 ease-out delay-150 group-hover:translate-x-1">
                                <rect x="5" y="135" width="44" height="44" rx="3" fill="#fff" fillOpacity=".12" />
                                <path d="m17 156 7 7 13-15" fill="none" stroke="#fff" strokeWidth="2" />
                                <path d="M72 148h101 M72 164h134" stroke="#fff" strokeOpacity=".22" strokeWidth="5" />
                                <rect x="274" y="150" width="14" height="14" fill="#fff" fillOpacity=".35" />
                            </g>
                        </svg>
                    </article>
                </div>
            </div>
        </section>
    );
};

export default SprintMetricsSection;
