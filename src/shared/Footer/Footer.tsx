import bonotechLogo from "@/assets/bonotech-logo-mono2.png";
import "./footer.css";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <footer id="footer" className="site-footer" aria-label="Bonotech footer">
            <div className="footer-atmosphere" aria-hidden="true" />

            <div className="footer-panel">
                <div className="footer-main">
                    <div className="footer-brand">
                        <a
                            className="footer-brand-link"
                            href="#home"
                            aria-label="Bonotech — back to home"
                        >
                            <img src={bonotechLogo} alt="Bonotech" />
                        </a>
                        <p>
                            Building innovative digital products that help businesses
                            transition into the age of AI.
                        </p>
                    </div>

                    <nav
                        className="footer-explore"
                        aria-labelledby="footer-explore-title"
                    >
                        <h2 id="footer-explore-title" className="footer-label">
                            Explore
                        </h2>
                        <ul>
                            <li>
                                <a href="#about-bonotech">About Bonotech</a>
                            </li>
                            <li>
                                <a href="#ways-in">Our Service Scope</a>
                            </li>
                            <li>
                                <a href="#delivery-times">Average Delivery Times</a>
                            </li>
                            <li>
                                <a href="#our-technology">Our Technology</a>
                            </li>
                            <li>
                                <a href="#client-testimonials">Client Testimonials</a>
                            </li>
                            <li>
                                <a
                                    href="/Bonotech-Portfolio.pdf"
                                    download="Bonotech-Portfolio-V3.pdf"
                                >
                                    Download Portfolio
                                </a>
                            </li>
                            <li>
                                <a
                                    className="footer-discovery-link"
                                    href="#discovery-call"
                                >
                                    Book a Discovery Call{" "}
                                    <span aria-hidden="true">↗</span>
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <div className="footer-contact">
                        <h2 className="footer-label">Get in Touch</h2>
                        <a className="footer-email" href="mailto:contact@bonotech.io">
                            contact@bonotech.io
                        </a>
                        <a className="footer-phone" href="tel:+447551829217">
                            +44 7551 829217
                        </a>
                        <address>
                            <strong>BONOTECH HOLDINGS PTE. LTD.</strong>
                            <span>111 SOMERSET ROAD #08-10A</span>
                            <span>Singapore 238164</span>
                        </address>
                    </div>

                    <div
                        className="footer-newsletter"
                        aria-labelledby="footer-newsletter-title"
                    >
                        <h2 id="footer-newsletter-title" className="footer-label">
                            Stay in the Loop
                        </h2>
                        <p className="footer-newsletter-title">
                            Fresh Thinking.
                            <br />
                            Practical Tech.
                        </p>
                        <p className="footer-newsletter-description">
                            Product insights, smarter systems, and AI that works for
                            business.
                        </p>
                        <label htmlFor="footer-newsletter-email">Email address</label>
                        <div className="footer-newsletter-field">
                            <input
                                id="footer-newsletter-email"
                                type="email"
                                name="newsletterEmail"
                                autoComplete="email"
                                placeholder="Your email address"
                                aria-describedby="footer-newsletter-note"
                                maxLength={254}
                            />
                            <button
                                type="button"
                                aria-label="Subscribe to the newsletter — coming soon"
                                disabled
                            >
                                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path
                                        d="M5 12h14m-6-6 6 6-6 6"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </div>
                        <p id="footer-newsletter-note" className="footer-newsletter-note">
                            Newsletter signup coming soon.
                        </p>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>
                        © {currentYear} Bonotech Holdings Pte. Ltd.
                        <span>All rights reserved.</span>
                    </p>

                    <button
                        type="button"
                        className="footer-top-link"
                        onClick={scrollToTop}
                        aria-label="Back to top"
                    >
                        <span>Back to Top</span>
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path
                                d="M12 19V5m-6 6 6-6 6 6"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>

                    <nav className="footer-socials" aria-label="Follow Bonotech">
                        <a
                            href="https://x.com/bonotechpteltd"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Bonotech on X (opens in a new tab)"
                        >
                            <span>X</span>
                        </a>
                        <a
                            href="https://www.instagram.com/bonotechpteltd"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Bonotech on Instagram (opens in a new tab)"
                        >
                            <span>IG</span>
                        </a>
                        <a
                            href="https://www.facebook.com/bonotechpteltd"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Bonotech on Facebook (opens in a new tab)"
                        >
                            <span>FB</span>
                        </a>
                        <a
                            href="https://www.linkedin.com/company/bonotechpteltd"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Bonotech on LinkedIn (opens in a new tab)"
                        >
                            <span>LI</span>
                        </a>
                    </nav>
                </div>
            </div>

            <div className="footer-video-space" aria-hidden="true" />
        </footer>
    );
};

export default Footer;
