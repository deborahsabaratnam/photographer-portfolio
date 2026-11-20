import '../styles/Intro.css';
import { useEffect } from 'react';
import gsap from 'gsap';

function Intro() {
    useEffect(() => {
        const timeline = gsap.timeline();

        timeline
            .fromTo('.intro-bar',
                { width: '0%' },
                { width: '40%', duration: 0.9, ease: 'power2.out' }
            )
            .fromTo('.intro-title',
                { yPercent: 110 },
                { yPercent: 0, duration: 1, ease: 'power3.out' }
            )
            .fromTo('.intro-tagline',
                { yPercent: -110 },
                { yPercent: 0, duration: 0.8, ease: 'power3.out' },
                '-=0.5'
            );

        return () => timeline.kill();
    }, []);
    return (
        /* These classes are to do different functions*/
        <div className="intro-screen">
            <div className="intro-content">

                <div className="intro-title-wrapper">
                    <h1 className="intro-title">Pradagraph</h1>
                </div>

                <div className="intro-bar"></div>

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