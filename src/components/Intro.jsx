
import '../styles/Intro.css';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

function Intro() {
    const introRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const timeline = gsap.timeline();

            timeline
                // Brand name appears first
                .fromTo(
                    '.intro-title',
                    {
                        yPercent: 110
                    },
                    {
                        yPercent: 0,
                        duration: 0.9,
                        ease: 'power3.out'
                    },
                    0.2
                )

                // Burgundy gradient bar expands
                .fromTo(
                    '.intro-bar',
                    {
                        width: '0%'
                    },
                    {
                        width: '40%',
                        duration: 0.9,
                        ease: 'power2.out'
                    },
                    0.3
                )

                // Tagline appears almost simultaneously
                .fromTo(
                    '.intro-tagline',
                    {
                        yPercent: 110
                    },
                    {
                        yPercent: 0,
                        duration: 0.8,
                        ease: 'power3.out'
                    },
                    0.35
                );
        }, introRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className="intro-screen" ref={introRef}>
            <div className="intro-content">

                {/* BRAND NAME */}
                <div className="intro-title-wrapper">
                    <h1 className="intro-title">
                        Pradagraph
                    </h1>
                </div>

                {/* BURGUNDY GRADIENT BAR */}
                <div className="intro-bar"></div>

                {/* TAGLINE */}
                <div className="intro-tagline-wrapper">
                    <p className="intro-tagline">
                        A VISUAL STORYTELLING EXPERIENCE
                    </p>
                </div>

            </div>
        </div>
    );
}

export default Intro;
