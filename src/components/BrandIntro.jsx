import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import '../styles/BrandIntro.css';

gsap.registerPlugin(ScrollTrigger);

const brandImageURL = 'https://res.cloudinary.com/db8dcy5no/image/upload/v1795261882/IMG_7619_o5bv6k.jpg';

function BrandIntro() {

    const sectionRef = useRef(null);

    useLayoutEffect(() => {

        const ctx = gsap.context(() => {

            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 65%',
                    toggleActions: 'play none none reverse'
                }
            });

            timeline
                .from('.brand-canvas', {
                    y: 60,
                    opacity: 0,
                    duration: 1,
                    ease: 'power3.out'
                })
                .from('.brand-photo', {
                    clipPath: 'inset(100% 0 0 0)',
                    duration: 1.2,
                    ease: 'power3.inOut'
                }, '-=0.5')
                .from('.brand-name', {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out'
                }, '-=0.6')
                .from('.brand-copy > *', {
                    y: 25,
                    opacity: 0,
                    stagger: 0.15,
                    duration: 0.7,
                    ease: 'power2.out'
                }, '-=0.6');

        }, sectionRef);

        return () => ctx.revert();

    }, []);

    return (

        <section
            className="brand-section"
            ref={sectionRef}
        >

            <div className="brand-canvas">

                {/* LEFT SIDE - PHOTOGRAPH */}

                <div className="brand-visual">

                    <div className="brand-photo">

                        <img
                            src={brandImageURL}
                            alt="Event photography by Pradagraph"
                            loading="lazy"
                        />

                    </div>


                </div>

                {/* RIGHT SIDE - BRAND MESSAGE */}

                <div className="brand-copy">

                    <h2 className="brand-headline">
                        Moments fade,
                        <span>feelings don't.</span>
                    </h2>

                    <p className="brand-description">
                        Capturing the energy, emotion and
                        extraordinary details that make every
                        event unforgettable.
                    </p>

                    <Link
                        to="/about"
                        className="brand-cta"
                    >
                        BEHIND THE LENS
                        <span>→</span>
                    </Link>

                </div>

            </div>

        </section>

    );
}

export default BrandIntro;