
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import '../styles/Testimonials.css';

// Replace these placeholders with genuine client reviews later.
const testimonials = [
    {
        id: 1,
        quote: 'Placeholder review — the client’s first testimonial will appear here.',
        name: 'CLIENT NAME 01',
        role: 'Client'
    },
    {
        id: 2,
        quote: 'Placeholder review — the client’s second testimonial will appear here.',
        name: 'CLIENT NAME 02',
        role: 'Client'
    },
    {
        id: 3,
        quote: 'Placeholder review — the client’s third testimonial will appear here.',
        name: 'CLIENT NAME 03',
        role: 'Client'
    }
];

function Testimonials() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const paperRef = useRef(null);
    const animationRef = useRef(false);
    const activeIndexRef = useRef(0);
    const timerRef = useRef(null);
    const sectionRef = useRef(null);

    const changeTestimonial = (direction = 1) => {
        if (animationRef.current || !paperRef.current) return;

        animationRef.current = true;
        setIsAnimating(true);

        const nextIndex =
            (activeIndexRef.current + direction + testimonials.length)
            % testimonials.length;

        const paper = paperRef.current;

        // Animate the top paper away, pivoting near the pushpin.
        gsap.to(paper, {
            rotation: direction > 0 ? 18 : -18,
            x: direction > 0 ? 110 : -110,
            y: 55,
            scale: 0.88,
            opacity: 0,
            duration: 0.65,
            ease: 'power2.in',
            onComplete: () => {
                activeIndexRef.current = nextIndex;
                setActiveIndex(nextIndex);

                // Prepare the new sheet to unfold into position.
                gsap.set(paper, {
                    rotation: direction > 0 ? -12 : 12,
                    x: direction > 0 ? -45 : 45,
                    y: 25,
                    scale: 0.94,
                    opacity: 0
                });

                gsap.to(paper, {
                    rotation: -3,
                    x: 0,
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    duration: 0.7,
                    ease: 'power3.out',
                    onComplete: () => {
                        animationRef.current = false;
                        setIsAnimating(false);
                    }
                });
            }
        });
    };

    // Automatically advance every six seconds.
    useEffect(() => {
        const section = sectionRef.current;
        const observer = new IntersectionObserver(
            ([entry]) => {
                clearInterval(timerRef.current);

                if (entry.isIntersecting) {
                    timerRef.current = setInterval(() => {
                        if (!document.hidden) {
                            changeTestimonial(1);
                        }
                    }, 6000);
                }
            },
            { threshold: 0.2 }
        );

        if (section) observer.observe(section);

        return () => {
            clearInterval(timerRef.current);
            observer.disconnect();
            gsap.killTweensOf(paperRef.current);
        };
    }, []);

    const current = testimonials[activeIndex];

    return (
        <section
            className="testimonials-section"
            ref={sectionRef}
            aria-label="Client testimonials"
        >
            <div className="testimonials-layout">

                {/* LEFT: STACKED PAPER TESTIMONIALS */}
                <div className="testimonials-visual">

                    <div className="paper-stack">
                        <div className="paper-sheet paper-back-one" />
                        <div className="paper-sheet paper-back-two" />

                        <div
                            className="paper-sheet paper-front"
                            ref={paperRef}
                        >
                            <span className="quote-mark quote-open">
                                “
                            </span>

                            <div className="paper-content">
                                <span className="paper-eyebrow">
                                    KIND WORDS
                                </span>

                                <blockquote className="paper-quote">
                                    {current.quote}
                                </blockquote>

                                <div className="paper-author">
                                    <strong>{current.name}</strong>
                                    <span>{current.role}</span>
                                </div>
                            </div>

                            <span className="quote-mark quote-close">
                                ”
                            </span>
                        </div>

                        {/* Decorative pushpin stays fixed */}
                        <div className="paper-pin">
                            <img
                                src="/images/obsidian-pin.png"
                                alt=""
                                aria-hidden="true"
                                draggable="false"
                            />
                        </div>
                    </div>

                    <div className="testimonials-controls">
                        <button
                            type="button"
                            onClick={() => changeTestimonial(-1)}
                            disabled={isAnimating}
                            aria-label="Previous testimonial"
                        >
                            ←
                        </button>

                        <span className="testimonial-count">
                            {String(activeIndex + 1).padStart(2, '0')}
                            {' / '}
                            {String(testimonials.length).padStart(2, '0')}
                        </span>

                        <button
                            type="button"
                            onClick={() => changeTestimonial(1)}
                            disabled={isAnimating}
                            aria-label="Next testimonial"
                        >
                            →
                        </button>
                    </div>
                </div>

                {/* RIGHT: PHOTOGRAPHY-FOCUSED MESSAGE */}
                <div className="testimonials-copy">
                    <span className="testimonials-eyebrow">
                        BEYOND THE FRAME
                    </span>

                    <h2>
                        The moments matter.
                        <em> So do the people behind them.</em>
                    </h2>

                    <p>
                        Every event is personal. From the first
                        conversation to the final photograph, we
                        believe the experience should be just as
                        memorable as the moments we capture.
                    </p>
                </div>

            </div>
        </section>
    );
}

export default Testimonials;
