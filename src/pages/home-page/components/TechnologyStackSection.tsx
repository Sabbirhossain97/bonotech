import { useCallback, useEffect, useRef, useState } from "react";

import flutterLogo from "@/assets/technology/flutter.svg";
import phpLogo from "@/assets/technology/php.svg";
import railsLogo from "@/assets/technology/rails.svg";
import nodejsLogo from "@/assets/technology/nodejs.svg";
import javaLogo from "@/assets/technology/java.svg";
import reactLogo from "@/assets/technology/react.svg";
import dotnetLogo from "@/assets/technology/dotnet.svg";
import pythonLogo from "@/assets/technology/python.svg";
import csharpLogo from "@/assets/technology/csharp.svg";
import laravelLogo from "@/assets/technology/laravel.svg";
import moodleLogo from "@/assets/technology/moodle.svg";
import ionicLogo from "@/assets/technology/ionic.svg";
import golangLogo from "@/assets/technology/golang.svg";
import vueLogo from "@/assets/technology/vuejs.svg";
import androidLogo from "@/assets/technology/android.svg";
import cppLogo from "@/assets/technology/cplusplus.svg";
import javascriptLogo from "@/assets/technology/javascript.svg";
import iosLogo from "@/assets/technology/ios.svg";
import wordpressLogo from "@/assets/technology/wordpress.svg";
import webflowLogo from "@/assets/technology/webflow.svg";
import angularLogo from "@/assets/technology/angular.svg";
import bonotechMark from "@/assets/technology/bonotech-mark.png";

type Technology = {
    name: string;
    key: string;
    logo: string;
    imageClassName?: string;
};

type Connection = {
    path: string;
};

const technologies: Technology[] = [
    { name: "Flutter", key: "flutter", logo: flutterLogo },
    { name: "PHP", key: "php", logo: phpLogo, imageClassName: "w-[70%]" },
    { name: "Rails", key: "rails", logo: railsLogo },
    { name: "Node.js", key: "nodejs", logo: nodejsLogo },
    { name: "Java", key: "java", logo: javaLogo },
    { name: "React", key: "react", logo: reactLogo },
    { name: ".NET", key: "dotnet", logo: dotnetLogo },

    { name: "Python", key: "python", logo: pythonLogo },
    { name: "C#", key: "csharp", logo: csharpLogo },
    { name: "Laravel", key: "laravel", logo: laravelLogo },
    { name: "Moodle", key: "moodle", logo: moodleLogo },
    { name: "Ionic", key: "ionic", logo: ionicLogo },
    { name: "Golang", key: "golang", logo: golangLogo, imageClassName: "w-[70%]" },
    { name: "Vue.js", key: "vuejs", logo: vueLogo },

    { name: "Android", key: "android", logo: androidLogo },
    { name: "C++", key: "cplusplus", logo: cppLogo },
    { name: "JavaScript", key: "javascript", logo: javascriptLogo },
    { name: "iOS", key: "ios", logo: iosLogo, imageClassName: "brightness-0 invert opacity-90" },
    { name: "WordPress", key: "wordpress", logo: wordpressLogo, imageClassName: "brightness-0 invert opacity-90" },
    { name: "Webflow", key: "webflow", logo: webflowLogo },
    { name: "Angular", key: "angular", logo: angularLogo },
];

const orbitItems = [
    { logo: flutterLogo, orbit: 0, duration: "79s", begin: "0s" },
    { logo: phpLogo, orbit: 1, duration: "97s", begin: "-8s" },
    { logo: railsLogo, orbit: 2, duration: "113s", begin: "-16s" },
    { logo: nodejsLogo, orbit: 0, duration: "79s", begin: "-11.29s" },
    { logo: javaLogo, orbit: 1, duration: "97s", begin: "-21.86s" },
    { logo: reactLogo, orbit: 2, duration: "113s", begin: "-32.14s" },
    { logo: dotnetLogo, orbit: 0, duration: "79s", begin: "-22.57s" },
    { logo: pythonLogo, orbit: 1, duration: "97s", begin: "-35.71s" },
    { logo: csharpLogo, orbit: 2, duration: "113s", begin: "-48.29s" },
    { logo: laravelLogo, orbit: 0, duration: "79s", begin: "-33.86s" },
    { logo: moodleLogo, orbit: 1, duration: "97s", begin: "-49.57s" },
    { logo: ionicLogo, orbit: 2, duration: "113s", begin: "-64.43s" },
    { logo: golangLogo, orbit: 0, duration: "79s", begin: "-45.14s" },
    { logo: vueLogo, orbit: 1, duration: "97s", begin: "-63.43s" },
    { logo: androidLogo, orbit: 2, duration: "113s", begin: "-80.57s" },
    { logo: cppLogo, orbit: 0, duration: "79s", begin: "-56.43s" },
    { logo: javascriptLogo, orbit: 1, duration: "97s", begin: "-77.29s" },
    { logo: iosLogo, orbit: 2, duration: "113s", begin: "-96.71s" },
    { logo: wordpressLogo, orbit: 0, duration: "79s", begin: "-67.71s" },
    { logo: webflowLogo, orbit: 1, duration: "97s", begin: "-91.14s" },
    { logo: angularLogo, orbit: 2, duration: "113s", begin: "-112.86s" },
];

const TechnologyStackSection = () => {
    const stageRef = useRef<HTMLDivElement | null>(null);
    const coreRef = useRef<HTMLDivElement | null>(null);
    const nodeRefs = useRef<(HTMLLIElement | null)[]>([]);
    const orbitSvgRef = useRef<SVGSVGElement | null>(null);

    const [connections, setConnections] = useState<Connection[]>([]);
    const [stageSize, setStageSize] = useState({ width: 1200, height: 780 });
    const [activeTech, setActiveTech] = useState<number | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);

    const calculateLayout = useCallback(() => {
        const stage = stageRef.current;
        const core = coreRef.current;

        if (!stage || !core) return;

        const stageRect = stage.getBoundingClientRect();
        const coreRect = core.getBoundingClientRect();

        const targetX = coreRect.left + coreRect.width / 2 - stageRect.left;
        const targetY = coreRect.top + coreRect.height / 2 - stageRect.top;

        const nextConnections = nodeRefs.current.map((node) => {
            if (!node) {
                return { path: "" };
            }

            const disc = node.querySelector("[data-tech-disc]") as HTMLElement | null;

            if (!disc) {
                return { path: "" };
            }

            const nodeRect = disc.getBoundingClientRect();

            const x = nodeRect.left + nodeRect.width / 2 - stageRect.left;
            const y = nodeRect.bottom - stageRect.top;

            const controlY1 = y + Math.max(58, stageRect.height * 0.085);
            const controlX2 = targetX + (x - targetX) * 0.13;
            const controlY2 = targetY - Math.max(85, stageRect.height * 0.135);

            return {
                path: `M ${x} ${y} C ${x} ${controlY1}, ${controlX2} ${controlY2}, ${targetX} ${targetY}`,
            };
        });

        setStageSize({
            width: stageRect.width,
            height: stageRect.height,
        });

        setConnections(nextConnections);
    }, []);

    useEffect(() => {
        const preference = window.matchMedia("(prefers-reduced-motion: reduce)");

        const handlePreference = () => {
            setReducedMotion(preference.matches);
        };

        handlePreference();

        preference.addEventListener("change", handlePreference);

        return () => {
            preference.removeEventListener("change", handlePreference);
        };
    }, []);

    useEffect(() => {
        const stage = stageRef.current;

        if (!stage) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.05 },
        );

        observer.observe(stage);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const svg = orbitSvgRef.current;

        if (!svg) return;

        if (isVisible && !reducedMotion && !document.hidden) {
            svg.unpauseAnimations?.();
        } else {
            svg.pauseAnimations?.();
        }
    }, [isVisible, reducedMotion]);

    useEffect(() => {
        const stage = stageRef.current;

        if (!stage) return;

        const runLayout = () => {
            requestAnimationFrame(calculateLayout);
        };

        const observer = new ResizeObserver(runLayout);

        observer.observe(stage);

        document.fonts?.ready.then(runLayout);

        window.addEventListener("resize", runLayout);

        runLayout();

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", runLayout);
        };
    }, [calculateLayout]);

    useEffect(() => {
        const handleVisibility = () => {
            const svg = orbitSvgRef.current;

            if (!svg) return;

            if (isVisible && !reducedMotion && !document.hidden) {
                svg.unpauseAnimations?.();
            } else {
                svg.pauseAnimations?.();
            }
        };

        document.addEventListener("visibilitychange", handleVisibility);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, [isVisible, reducedMotion]);

    const orbitGeometry = [
        { radius: 548, centerY: 620, height: 122 },
        { radius: 485, centerY: 636, height: 107 },
        { radius: 423, centerY: 652, height: 91 },
    ];

    const getOrbitPath = (index: number) => {
        const geometry = orbitGeometry[index];

        const cx = stageSize.width / 2;
        const rx = (stageSize.width * geometry.radius) / 1200;
        const cy = (stageSize.height * geometry.centerY) / 780;

        const mobileFlatten = stageSize.width < 600 ? 0.42 : 1;
        const ry = (stageSize.height * geometry.height) / 780 * mobileFlatten;

        return `M ${cx - rx} ${cy} a ${rx} ${ry} 0 1 0 ${rx * 2} 0 a ${rx} ${ry} 0 1 0 ${-rx * 2} 0`;
    };

    return (
        <section id="our-technology" aria-labelledby="technology-title" className="relative isolate min-h-screen overflow-hidden bg-[linear-gradient(180deg,#0d0716_0%,#10091b_28%,#12081e_100%)] px-5 pb-12 pt-20 text-white sm:px-6 sm:pt-24 lg:px-8 lg:pb-[70px] lg:pt-[105px]">
            {/* subtle atmosphere */}
            <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[64%] -z-10 h-[60%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(99,45,182,.24)_0%,rgba(75,24,133,.13)_40%,transparent_72%)] blur-[35px]" />

            <div className="mx-auto w-full max-w-[1200px]">
                {/* Heading */}
                <header className="relative z-20 mx-auto mb-[28px] max-w-[950px] text-center lg:mb-[34px]">
                    <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.16em] text-[#ae96c8] sm:mb-5 sm:text-xs">
                        Our Technology Stack
                    </p>

                    <h2 id="technology-title" className="m-0 text-[38px] font-light leading-[1.04] tracking-[-0.055em] text-[#faf7ff] sm:text-[48px] md:text-[56px] lg:text-[60px]">
                        The Right Tools
                        <span className="mt-1 block font-semibold text-[#bda2e5]">
                            Built Around Your Business
                        </span>
                    </h2>

                    <p className="mx-auto mt-5 max-w-[620px] text-[14px] font-light leading-[1.55] tracking-[-0.025em] text-[#afa6bd] sm:text-base">
                        From mobile experiences to enterprise systems,
                        <br className="hidden sm:block" />
                        we bring the right technologies together to build what your business needs.
                    </p>
                </header>

                {/* Main technology stage */}
                <div ref={stageRef} className="relative isolate mx-auto h-[590px] w-full max-w-[1200px] sm:h-[650px] md:h-[700px] lg:h-[760px]">
                    {/* Ground glow */}
                    <div aria-hidden="true" className="pointer-events-none absolute left-[8%] right-[8%] top-[47%] z-0 h-[52%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(100,44,182,.28)_0%,rgba(75,24,133,.17)_32%,transparent_68%)] blur-[4px]" />

                    {/* Connections */}
                    <svg aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] h-full w-full overflow-visible" viewBox={`0 0 ${stageSize.width} ${stageSize.height}`} preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="technology-wire-gradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#8651cf" stopOpacity="0.25" />
                                <stop offset="40%" stopColor="#b987f4" />
                                <stop offset="65%" stopColor="#f0dcff" />
                                <stop offset="100%" stopColor="#8954d7" stopOpacity="0.3" />
                            </linearGradient>
                        </defs>

                        {connections.map((connection, index) => (
                            <g key={`connection-${index}`}>
                                <path d={connection.path} fill="none" stroke={activeTech === index ? "rgba(186,131,250,.6)" : "rgba(156,98,216,.23)"} strokeWidth={activeTech === index ? 1.5 : 1} className="transition-all duration-300" />

                                {!reducedMotion && (
                                    <path d={connection.path} pathLength="100" fill="none" stroke="url(#technology-wire-gradient)" strokeWidth={activeTech === index ? 2.6 : 1.6} strokeLinecap="round" strokeDasharray="14 106" opacity={activeTech === index ? 0.95 : 0.45}>
                                        <animate attributeName="stroke-dashoffset" values="120;0" dur="6.5s" begin={`${-index * 0.61}s`} repeatCount="indefinite" />
                                        <animate attributeName="opacity" values="0;0.75;0.85;0" keyTimes="0;0.15;0.8;1" dur="6.5s" begin={`${-index * 0.61}s`} repeatCount="indefinite" />
                                    </path>
                                )}
                            </g>
                        ))}
                    </svg>

                    {/* Technology nodes */}
                    <ul aria-label="Technologies we work with" className="relative z-[3] mx-auto grid w-full max-w-[780px] grid-cols-7 gap-x-1 gap-y-4 px-0 pt-2 sm:gap-x-3 sm:gap-y-[18px] sm:pt-4 md:w-[88%] md:gap-x-5 lg:w-[76%] lg:gap-x-[26px] lg:gap-y-5">
                        {technologies.map((technology, index) => (
                            <li
                                key={technology.key}
                                ref={(element) => {
                                    nodeRefs.current[index] = element;
                                }}
                                onPointerEnter={() => setActiveTech(index)}
                                onPointerLeave={() => setActiveTech(null)}
                                className="group flex min-w-0 flex-col items-center gap-[5px] sm:gap-2"
                            >
                                <span data-tech-disc className="grid h-[38px] w-[38px] place-items-center rounded-full border border-[#b694e5]/10 bg-[radial-gradient(circle_at_30%_18%,#382548_0%,#23172f_70%)] shadow-[inset_0_1px_0_rgba(225,195,255,.04)] transition-all duration-300 group-hover:-translate-y-[3px] group-hover:border-[#ad7be1]/50 group-hover:bg-[#30203f] group-hover:shadow-[0_0_24px_rgba(153,85,217,.16)] sm:h-[48px] sm:w-[48px] md:h-14 md:w-14 lg:h-[62px] lg:w-[62px]">
                                    <img src={technology.logo} alt="" loading="lazy" decoding="async" className={`h-[58%] w-[58%] object-contain sm:h-8 sm:w-8 lg:h-[35px] lg:w-[35px] ${technology.imageClassName ?? ""}`} />
                                </span>

                                <span className="whitespace-nowrap rounded-[3px] bg-[#10091b]/90 px-[2px] py-[1px] text-center text-[7px] leading-tight tracking-[-0.03em] text-[#b3a3c3] transition-colors duration-300 group-hover:text-[#f2e3ff] sm:px-1 sm:text-[9px] md:text-[10px] lg:text-[11px]">
                                    {technology.name}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* Orbit tracks */}
                    <svg ref={orbitSvgRef} aria-hidden="true" focusable="false" className="pointer-events-none absolute inset-0 z-[2] h-full w-full overflow-visible" viewBox={`0 0 ${stageSize.width} ${stageSize.height}`} preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="technology-orbit-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#6d419f" stopOpacity="0.12" />
                                <stop offset="60%" stopColor="#9262c9" stopOpacity="0.58" />
                                <stop offset="100%" stopColor="#b683ea" stopOpacity="0.85" />
                            </linearGradient>
                        </defs>

                        {[0, 1, 2].map((index) => (
                            <path key={`orbit-${index}`} id={`technology-orbit-${index}`} d={getOrbitPath(index)} fill="none" stroke="url(#technology-orbit-gradient)" strokeWidth="1.1" />
                        ))}

                        {!reducedMotion &&
                            orbitItems.map((item, index) => (
                                <g key={`orbit-logo-${index}`} opacity="0.26">
                                    <image href={item.logo} x="-9" y="-9" width="18" height="18" opacity="0.65" />
                                    <animateMotion dur={item.duration} begin={item.begin} repeatCount="indefinite">
                                        <mpath href={`#technology-orbit-${item.orbit}`} />
                                    </animateMotion>
                                </g>
                            ))}
                    </svg>

                    {/* Bonotech core */}
                    <div ref={coreRef} className="absolute left-1/2 top-[70%] z-[4] flex aspect-square w-[138px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-2 rounded-full border border-[#bb85ff]/20 bg-[radial-gradient(circle_at_38%_28%,#7040ae_0%,#42217b_44%,#32145c_74%,#1f103b_100%)] shadow-[inset_0_1px_2px_rgba(214,179,255,.13),inset_0_-10px_32px_rgba(32,7,55,.49),0_0_75px_rgba(130,55,210,.32),0_28px_80px_rgba(88,35,141,.22)] sm:w-[155px] md:w-[175px] lg:top-[69.5%] lg:w-[190px]">
                        <div aria-hidden="true" className="pointer-events-none absolute -inset-[22%] -z-10 rounded-full bg-[radial-gradient(circle,rgba(174,98,255,.15)_0%,transparent_66%)] blur-[2px]" />

                        <img src={bonotechMark} alt="Bonotech" loading="lazy" decoding="async" className="h-[52%] w-[36%] object-contain drop-shadow-[0_0_10px_rgba(231,198,255,.4)]" />

                        <span className="text-[7px] tracking-[0.19em] text-[#e0ccf5] sm:text-[8px] lg:text-[10px]">
                            BONOTECH
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TechnologyStackSection;