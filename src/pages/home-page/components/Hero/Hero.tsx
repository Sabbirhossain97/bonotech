import { useEffect, useRef, useState } from "react";
import FlowBackground from "./FlowBackground";
import "./Hero.css";

const ENGINEERING_LETTERS = "ENGINEERING".split("");

const Hero = () => {
    const headlineRef = useRef<HTMLHeadingElement>(null);
    const keyImageRef = useRef<HTMLImageElement>(null);
    const keyFloatRef = useRef<Animation | null>(null);
    const [heroReady, setHeroReady] = useState(false);
    const [motionPaused, setMotionPaused] = useState(() =>
        typeof window !== "undefined"
            ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
            : false,
    );

    useEffect(() => {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduced) {
            setHeroReady(true);
            return;
        }

        // Wait one frame so opacity:0 paints, then kick the entrance animation.
        const frame = requestAnimationFrame(() => setHeroReady(true));
        return () => cancelAnimationFrame(frame);
    }, []);

    useEffect(() => {
        const headline = headlineRef.current;
        if (!headline) return;

        const measurement = document.createElement("canvas").getContext("2d");
        if (!measurement) return;

        const fitHeadline = () => {
            measurement.font = "700 100px Montserrat";
            const widthAt100 =
                measurement.measureText("OF EXCEPTIONAL").width - 4.5 * 13;
            const size = (headline.clientWidth / widthAt100) * 100;
            headline.style.fontSize = `${size}px`;
        };

        document.fonts.ready.then(fitHeadline);
        const observer = new ResizeObserver(fitHeadline);
        observer.observe(headline);
        fitHeadline();

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
        const handleChange = () => {
            if (preference.matches) setMotionPaused(true);
        };
        preference.addEventListener("change", handleChange);
        return () => preference.removeEventListener("change", handleChange);
    }, []);

    useEffect(() => {
        const keyImage = keyImageRef.current;
        if (!keyImage) return;

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

        const startKeyFloat = () => {
            if (
                reducedMotion.matches ||
                !keyImage.animate ||
                keyFloatRef.current?.effect?.getTiming().iterations === Infinity
            ) {
                return;
            }

            const restingPose = getComputedStyle(keyImage).transform;
            keyFloatRef.current?.cancel();
            keyFloatRef.current = keyImage.animate(
                [
                    { transform: restingPose, easing: "ease-in-out" },
                    {
                        transform: "translate3d(0,-7px,0) rotateX(1deg) rotateY(-1deg)",
                        easing: "ease-in-out",
                    },
                    { transform: restingPose },
                ],
                { duration: 4600, iterations: Infinity },
            );
        };

        const stopKeyFloat = (immediate = false) => {
            const current = keyFloatRef.current;
            if (!current) return;

            const currentPose = getComputedStyle(keyImage).transform;
            current.cancel();
            keyFloatRef.current = null;

            if (immediate) return;

            const settle = keyImage.animate(
                [{ transform: currentPose }, { transform: "none" }],
                { duration: 650, easing: "cubic-bezier(.22,1,.36,1)" },
            );
            keyFloatRef.current = settle;
            settle.onfinish = () => {
                if (keyFloatRef.current === settle) keyFloatRef.current = null;
            };
        };

        const key = keyImage.closest(".home-key");
        if (!key) return;

        const onEnter = (event: Event) => {
            const pointerType = (event as PointerEvent).pointerType;
            if (pointerType === "mouse" || pointerType === "pen") startKeyFloat();
        };
        const onLeave = () => {
            if (!key.matches(":focus-visible")) stopKeyFloat();
        };
        const onFocus = () => {
            if (key.matches(":focus-visible")) startKeyFloat();
        };
        const onBlur = () => {
            if (!key.matches(":hover")) stopKeyFloat();
        };
        const onReduced = (event: MediaQueryListEvent) => {
            if (event.matches) stopKeyFloat(true);
        };

        key.addEventListener("pointerenter", onEnter);
        key.addEventListener("pointerleave", onLeave);
        key.addEventListener("focus", onFocus);
        key.addEventListener("blur", onBlur);
        reducedMotion.addEventListener("change", onReduced);

        return () => {
            key.removeEventListener("pointerenter", onEnter);
            key.removeEventListener("pointerleave", onLeave);
            key.removeEventListener("focus", onFocus);
            key.removeEventListener("blur", onBlur);
            reducedMotion.removeEventListener("change", onReduced);
            stopKeyFloat(true);
        };
    }, []);

    return (
        <section
            id="home"
            className={`hero${heroReady ? " is-ready" : ""}`}
            aria-labelledby="hero-title"
        >
            <div className="atmosphere" aria-hidden="true">
                <div className="background-still" />
                <FlowBackground className="flow-canvas" paused={motionPaused} />
                <div className="readability" />
            </div>

            <div className="hero-nav-spacer" aria-hidden="true" />

            <div className="hero-composition">
                <div className="introduction">
                    <p className="intro-copy intro-left">
                        Bonotech turns
                        <br />
                        <strong>business needs</strong>
                        <br />
                        into <strong>software</strong>
                        <br />
                        built with <strong>precision</strong>
                        <br />
                        <strong>and speed.</strong>
                    </p>

                    <div className="key-stage">
                        <button
                            className="home-key"
                            type="button"
                            aria-label="Home"
                            title="Home"
                        >
                            <img
                                ref={keyImageRef}
                                src="/hero-section/home-key.png"
                                alt=""
                                width={2499}
                                height={2132}
                                fetchPriority="high"
                                draggable={false}
                            />
                        </button>
                    </div>

                    <p className="intro-copy intro-right">
                        From <strong>custom software</strong>
                        <br />
                        to <strong>applied AI</strong>, we move fast,
                        <br />
                        refine faster and <strong>engineer</strong>
                        <br />
                        <strong>technology</strong> around how
                        <br />
                        businesses actually work.
                    </p>
                </div>

                <h1
                    ref={headlineRef}
                    id="hero-title"
                    className="headline"
                    aria-label="Home of exceptional engineering"
                >
                    <span className="title-line" aria-hidden="true">
                        OF EXCEPTIONAL
                    </span>
                    <span className="engineering" aria-hidden="true">
                        {ENGINEERING_LETTERS.map((letter, index) => (
                            <span key={`${letter}-${index}`}>{letter}</span>
                        ))}
                    </span>
                </h1>
            </div>

            <div className="hero-bottom">
                <button
                    id="motion-toggle"
                    className="motion-toggle"
                    type="button"
                    aria-label={
                        motionPaused
                            ? "Play background animation"
                            : "Pause background animation"
                    }
                    aria-pressed={motionPaused}
                    title={
                        motionPaused
                            ? "Play background animation"
                            : "Pause background animation"
                    }
                    onClick={() => setMotionPaused((value) => !value)}
                >
                    <svg
                        className="pause-icon"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <rect x="5" y="4" width="3" height="12" rx=".7" />
                        <rect x="12" y="4" width="3" height="12" rx=".7" />
                    </svg>
                    <svg
                        className="play-icon"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path d="M6 3.5 16 10 6 16.5z" />
                    </svg>
                </button>
            </div>
        </section>
    );
};

export default Hero;
