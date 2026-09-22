import { useEffect, useRef } from "react";

import "./BusinessScopesSection.css";

import aiStar from "@/assets/ways-in/ai-star.svg";
import SectionEdgeFade from "../SectionEdgeFade";

const BusinessScopesSection = () => {
    const gridRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const grid = gridRef.current;

        if (!grid) return;

        if (!("IntersectionObserver" in window)) {
            grid.classList.add("is-visible");
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                grid.classList.toggle("is-visible", entry.isIntersecting);
            },
            {
                threshold: 0.05,
            },
        );

        observer.observe(grid);

        return () => observer.disconnect();
    }, []);

    return (
        <section
            id="business-scopes"
            className="business-scopes"
            aria-labelledby="business-scopes-title"
        >
            <SectionEdgeFade />
            <div className="business-scopes-inner">
                <header className="business-scopes-heading">
                    <p className="business-scopes-eyebrow">
                        OUR SERVICE SCOPE
                    </p>

                    <h2 id="business-scopes-title">
                        We Offer 4 Scopes

                        <span>
                            Depending On Where You&apos;re Starting
                        </span>
                    </h2>

                    <p className="business-scopes-description">
                        From the first idea to enterprise-wide transformation,{" "}
                        <br />
                        {" "}we meet your business where it is and build what comes next.
                    </p>
                </header>

                <div
                    ref={gridRef}
                    className="business-scopes-grid"
                >
                    <div
                        className="business-scopes-art"
                        aria-hidden="true"
                    >
                        <div className="business-scopes-halo" />

                        <div className="business-scopes-top-star" />

                        <div className="business-scopes-main-star">
                            <img
                                src={aiStar}
                                alt=""
                            />
                        </div>

                        <div className="business-scopes-bottom-circle" />
                    </div>

                    <div
                        className="business-scopes-grid-lines"
                        aria-hidden="true"
                    >
                        <i />
                        <i />
                        <i />
                    </div>

                    <article
                        className="business-scope-card business-scope-idea"
                        aria-labelledby="scope-idea-title"
                    >
                        <h3 id="scope-idea-title">
                            You Just Have An Idea
                            <br />
                            That Needs Clear Direction
                        </h3>

                        <p>
                            We understand the problem, map the workflows, define the product
                            and shape the full build plan with you. Once approved, we turn it
                            into a working digital product.
                        </p>
                    </article>

                    <article
                        className="business-scope-card business-scope-build"
                        aria-labelledby="scope-build-title"
                    >
                        <h3 id="scope-build-title">
                            Your App Idea Is Clear
                            <br />
                            You Need It Built
                        </h3>

                        <p>
                            We will deploy a solid team to build across mobile, web, cloud
                            and AI, to work in dated phases with weekly shippable increments.
                            5 of our 7 platforms went live in just 30 days or less.
                        </p>
                    </article>

                    <article
                        className="business-scope-card business-scope-consult"
                        aria-labelledby="scope-consult-title"
                    >
                        <h3 id="scope-consult-title">
                            Your Enterprise
                            <br />
                            Needs Consultation
                        </h3>

                        <p>
                            We assess your systems, workflows, internal teams and delivery
                            processes to identify gaps, validate whether everything is on the
                            right track, and recommend the best-fitting next actions.
                        </p>
                    </article>

                    <article
                        className="business-scope-card business-scope-digitize"
                        aria-labelledby="scope-digitize-title"
                    >
                        <h3 id="scope-digitize-title">
                            Your Enterprise Needs
                            <br />
                            End-To-End Digitization
                        </h3>

                        <p>
                            We digitize fragmented, ageing legacy systems across your
                            enterprise into one digital flow, giving your teams/management
                            real-time visibility, actionable insights, and the ability to
                            manage operations through simple, natural-language conversations.
                        </p>
                    </article>

                    <div className="business-scopes-notification">
                        <div className="business-scopes-notification-meta">
                            <span
                                className="business-scopes-notification-mark"
                                aria-hidden="true"
                            >
                                ✦
                            </span>

                            <span>BONOTECH</span>

                            <span
                                className="business-scopes-notification-signal"
                                aria-hidden="true"
                            />
                        </div>

                        <p>
                            AI-accelerated technology
                            <br />
                            for any and every business
                            <br />
                            need
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BusinessScopesSection;
