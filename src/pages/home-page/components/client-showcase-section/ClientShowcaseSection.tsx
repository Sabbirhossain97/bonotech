import { useEffect, useRef, useState } from "react";
import "./ClientShowcaseSection.css";
import SectionEdgeFade from "../SectionEdgeFade";

import getMyGrailLogo from "@/assets/clients/get-my-grail.svg";
import ditechLogo from "@/assets/clients/ditech.svg";
import gustavLogo from "@/assets/clients/gustav.svg";
import olmoLogo from "@/assets/clients/olmo.svg";
import dekkoIshoLogo from "@/assets/clients/dekko-isho.svg";
import evoLogo from "@/assets/clients/evo.svg";
import polysignalsLogo from "@/assets/clients/polysignals.svg";

type Client = {
    name: string;
    logo: string;
    className: string;
    width: number;
    height: number;
};

type Movement = {
    from: number;
    to: number;
    start: number;
};

const clients: Client[] = [
    {
        name: "Get My Grail",
        logo: getMyGrailLogo,
        className: "logo-grail",
        width: 316,
        height: 141,
    },
    {
        name: "DITECH",
        logo: ditechLogo,
        className: "logo-ditech",
        width: 633,
        height: 120,
    },
    {
        name: "Gustav",
        logo: gustavLogo,
        className: "logo-gustav",
        width: 454,
        height: 134,
    },
    {
        name: "Olmo",
        logo: olmoLogo,
        className: "logo-olmo",
        width: 422,
        height: 138,
    },
    {
        name: "Dekko ISHO",
        logo: dekkoIshoLogo,
        className: "logo-dekko",
        width: 362,
        height: 139,
    },
    {
        name: "EVO",
        logo: evoLogo,
        className: "logo-evo",
        width: 118,
        height: 138,
    },
    {
        name: "Polysignals",
        logo: polysignalsLogo,
        className: "logo-polysignals",
        width: 643,
        height: 85,
    },
];

const clientPose = (
    index: number,
    phase: number,
    count: number,
    stageWidth: number,
    cardWidth: number,
) => {
    const slot = ((index - phase + count / 2) % count + count) % count - count / 2;

    const spacing = Math.max(
        cardWidth + 58,
        (stageWidth + cardWidth * 2.4) / count,
    );

    const x = slot * spacing;

    const across = Math.max(
        -1,
        Math.min(1, x / Math.max(stageWidth * 0.55, 360)),
    );

    const recess = Math.max(0, 1 - across * across);

    return {
        x,
        y: recess * 18,
        z: -320 * recess,
        angle: -across * 28,
        light: 1 - 0.1 * recess,
    };
};

const ClientShowcaseSection = () => {
    const sectionRef = useRef<HTMLElement | null>(null);
    const orbitRef = useRef<HTMLUListElement | null>(null);
    const controlsRef = useRef<HTMLDivElement | null>(null);
    const cardRefs = useRef<(HTMLLIElement | null)[]>([]);

    const phaseRef = useRef(0);
    const stageWidthRef = useRef(0);
    const cardWidthRef = useRef(0);

    const visibleRef = useRef(false);
    const hoveredRef = useRef(false);
    const focusedRef = useRef(false);
    const userPausedRef = useRef(false);

    const lastRef = useRef(0);
    const frameRef = useRef(0);

    const movementRef = useRef<Movement | null>(null);

    const [isPaused, setIsPaused] = useState(false);
    const [announcement, setAnnouncement] = useState("");

    useEffect(() => {
        const section = sectionRef.current;
        const orbit = orbitRef.current;
        const controls = controlsRef.current;
        const cards = cardRefs.current.filter(Boolean) as HTMLLIElement[];

        if (!section || !orbit || !controls || !cards.length) return;

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

        section.classList.add("is-enhanced");

        const render = () => {
            cards.forEach((card, index) => {
                const p = clientPose(
                    index,
                    phaseRef.current,
                    cards.length,
                    stageWidthRef.current,
                    cardWidthRef.current,
                );

                card.style.transform = `translate(-50%, -50%) translate3d(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px, ${p.z.toFixed(2)}px) rotateY(${p.angle.toFixed(2)}deg)`;
                card.style.filter = `brightness(${p.light.toFixed(3)})`;
                card.style.zIndex = String(Math.round(1000 + p.z));
            });
        };

        const size = () => {
            stageWidthRef.current = orbit.clientWidth;

            const firstCard = cards[0];

            if (firstCard) {
                cardWidthRef.current = firstCard.offsetWidth;
            }

            render();
        };

        const syncPause = () => {
            setIsPaused(userPausedRef.current);
        };

        const announceSelection = () => {
            const index =
                ((Math.round(phaseRef.current) % cards.length) + cards.length) %
                cards.length;

            const brand = cards[index]?.dataset.brand ?? "";

            setAnnouncement(brand);
        };

        const go = (direction: number) => {
            const movement = movementRef.current;

            const destination =
                (movement ? movement.to : Math.round(phaseRef.current)) + direction;

            userPausedRef.current = true;

            syncPause();

            if (reduced.matches) {
                phaseRef.current = destination;
                movementRef.current = null;

                render();
                announceSelection();

                return;
            }

            movementRef.current = {
                from: phaseRef.current,
                to: destination,
                start: performance.now(),
            };
        };

        const handlePrevious = () => {
            go(-1);
        };

        const handleNext = () => {
            go(1);
        };

        const handleToggle = () => {
            userPausedRef.current = !userPausedRef.current;
            syncPause();
        };

        const handlePointerEnter = (event: PointerEvent) => {
            if (event.pointerType !== "touch") {
                hoveredRef.current = true;
            }
        };

        const handlePointerLeave = () => {
            hoveredRef.current = false;
        };

        const handleFocusIn = () => {
            focusedRef.current = true;
        };

        const handleFocusOut = (event: FocusEvent) => {
            focusedRef.current = controls.contains(event.relatedTarget as Node);
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

            event.preventDefault();

            go(event.key === "ArrowRight" ? 1 : -1);
        };

        const handleReducedMotionChange = () => {
            const movement = movementRef.current;

            if (movement) {
                phaseRef.current = movement.to;
                movementRef.current = null;
            }

            render();
        };

        let intersectionObserver: IntersectionObserver | null = null;

        if ("IntersectionObserver" in window) {
            intersectionObserver = new IntersectionObserver(
                ([entry]) => {
                    visibleRef.current = entry.isIntersecting;
                },
                {
                    threshold: 0.01,
                },
            );

            intersectionObserver.observe(section);
        } else {
            visibleRef.current = true;
        }

        const resizeObserver = new ResizeObserver(size);

        resizeObserver.observe(orbit);

        const tick = (now: number) => {
            frameRef.current = requestAnimationFrame(tick);

            if (document.hidden || !visibleRef.current) {
                lastRef.current = now;
                return;
            }

            if (now - lastRef.current < 1000 / 30) return;

            const dt = Math.min((now - lastRef.current) / 1000, 0.06);

            lastRef.current = now;

            const movement = movementRef.current;

            if (movement) {
                const t = Math.min((now - movement.start) / 950, 1);

                const ease =
                    t < 0.5
                        ? 4 * t * t * t
                        : 1 - Math.pow(-2 * t + 2, 3) / 2;

                phaseRef.current =
                    movement.from + (movement.to - movement.from) * ease;

                if (t === 1) {
                    movementRef.current = null;
                    announceSelection();
                }

                render();
            } else if (
                !userPausedRef.current &&
                !hoveredRef.current &&
                !focusedRef.current &&
                !reduced.matches
            ) {
                phaseRef.current =
                    (phaseRef.current + dt / 5.5) % cards.length;

                render();
            }
        };

        const previousButton = section.querySelector(
            "#client-previous",
        ) as HTMLButtonElement | null;

        const nextButton = section.querySelector(
            "#client-next",
        ) as HTMLButtonElement | null;

        const toggleButton = section.querySelector(
            "#client-motion",
        ) as HTMLButtonElement | null;

        previousButton?.addEventListener("click", handlePrevious);
        nextButton?.addEventListener("click", handleNext);
        toggleButton?.addEventListener("click", handleToggle);

        orbit.addEventListener("pointerenter", handlePointerEnter);
        orbit.addEventListener("pointerleave", handlePointerLeave);

        controls.addEventListener("focusin", handleFocusIn);
        controls.addEventListener("focusout", handleFocusOut);
        controls.addEventListener("keydown", handleKeyDown);

        reduced.addEventListener("change", handleReducedMotionChange);

        size();
        syncPause();

        frameRef.current = requestAnimationFrame(tick);

        return () => {
            section.classList.remove("is-enhanced");

            cancelAnimationFrame(frameRef.current);

            resizeObserver.disconnect();
            intersectionObserver?.disconnect();

            previousButton?.removeEventListener("click", handlePrevious);
            nextButton?.removeEventListener("click", handleNext);
            toggleButton?.removeEventListener("click", handleToggle);

            orbit.removeEventListener("pointerenter", handlePointerEnter);
            orbit.removeEventListener("pointerleave", handlePointerLeave);

            controls.removeEventListener("focusin", handleFocusIn);
            controls.removeEventListener("focusout", handleFocusOut);
            controls.removeEventListener("keydown", handleKeyDown);

            reduced.removeEventListener("change", handleReducedMotionChange);
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            id="our-clients"
            className="clients"
            aria-labelledby="clients-title"
        >
            <SectionEdgeFade />
            <header className="clients-heading">
                <p className="clients-eyebrow">
                    BRANDS WE&apos;VE BUILT WITH
                </p>

                <h2 id="clients-title">
                    Different Businesses
                    <br />
                    <span>A Shared Drive Forward</span>
                </h2>

                <p className="clients-description">
                    From growing platforms to enterprise teams, we build for the way each
                    business works.
                </p>
            </header>

            <div className="client-stage">
                <div className="client-recess" aria-hidden="true" />

                <ul
                    ref={orbitRef}
                    className="client-orbit"
                    aria-label="Selected clients"
                >
                    {clients.map((client, index) => (
                        <li
                            key={client.name}
                            ref={(element) => {
                                cardRefs.current[index] = element;
                            }}
                            className="client-logo"
                            data-brand={client.name}
                        >
                            <div className="client-face">
                                <img
                                    className={client.className}
                                    src={client.logo}
                                    alt={client.name}
                                    width={client.width}
                                    height={client.height}
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div
                ref={controlsRef}
                className="client-controls"
            >
                <button
                    className="client-control"
                    id="client-previous"
                    type="button"
                    aria-label="Show previous client"
                >
                    <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        aria-hidden="true"
                    >
                        <path
                            d="m12 5-5 5 5 5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />
                    </svg>
                </button>

                <button
                    className="client-control client-motion"
                    id="client-motion"
                    type="button"
                    aria-label={
                        isPaused
                            ? "Play logo animation"
                            : "Pause logo animation"
                    }
                    aria-pressed={isPaused}
                >
                    <svg
                        className="client-pause-icon"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <rect
                            x="6"
                            y="5"
                            width="2"
                            height="10"
                            rx=".5"
                        />

                        <rect
                            x="12"
                            y="5"
                            width="2"
                            height="10"
                            rx=".5"
                        />
                    </svg>

                    <svg
                        className="client-play-icon"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path d="m7 4 9 6-9 6z" />
                    </svg>
                </button>

                <button
                    className="client-control"
                    id="client-next"
                    type="button"
                    aria-label="Show next client"
                >
                    <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        aria-hidden="true"
                    >
                        <path
                            d="m8 5 5 5-5 5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />
                    </svg>
                </button>

                <span
                    className="client-announcement"
                    role="status"
                    aria-live="polite"
                >
                    {announcement}
                </span>
            </div>
        </section>
    );
};

export default ClientShowcaseSection;
