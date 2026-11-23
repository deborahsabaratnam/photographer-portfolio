
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/About.css';

gsap.registerPlugin(ScrollTrigger);

const aboutImages = {
  story: 'https://res.cloudinary.com/db8dcy5no/image/upload/v1795348592/Pic_for_portfolio_gou88q.jpg',
  style: 'https://res.cloudinary.com/db8dcy5no/image/upload/v1795348789/Photography_nxl8og.jpg',
};

function About() {
  const pageRef = useRef(null);

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(
        '.about-reveal',
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power2.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: '.about-canvas',
            start: 'top 80%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.about-reveal-second',
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power2.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: '.about-section-second',
            start: 'top 80%',
            once: true,
          },
        }
      );
    }, pageRef);

    return () => context.revert();
  }, []);

  return (
    <main className="about-page" ref={pageRef}>
      <div className="about-canvas">

        {/* BACKGROUND GEOMETRY */}
        <div
          className="about-geometry"
          aria-hidden="true"
        />

        <div className="about-content">

          {/* SECTION 01 — HIS STORY */}
          <section className="about-section about-section-first">

            <div className="about-image-wrap about-reveal">
              <img
                src={aboutImages.story}
                alt="Pradaban Jayakumar with his camera"
                className="about-image"
                decoding="async"
              />
              <span className="about-image-caption">
                PRADABAN JAYAKUMAR / PRADAGRAPH
              </span>
            </div>

            <div className="about-text about-reveal">
              <span className="about-eyebrow">
                01 / THE STORY
              </span>

              <h1>
                Behind
                <br />
                <em>the Lens.</em>
              </h1>

              <p>
                I'm Pradaban Jayakumar, the creative
                mind behind PRADAGRAPH. My journey
                into photography began with a simple
                passion for capturing moments and
                turning them into lasting memories.
              </p>

              <p>
                What started as a personal interest
                gradually evolved into a creative
                pursuit of storytelling through
                photography and videography. From
                energetic DJ nights and grand
                celebrations to intimate portraits,
                couple sessions and everyday moments,
                I'm drawn to the emotions, details
                and stories that make each
                experience unique.
              </p>

              <p>
                My approach brings together
                creativity, attention to detail
                and a cinematic perspective, while
                keeping every image natural,
                authentic and meaningful.
              </p>

              <p className="about-emphasis">
                Every frame tells a story, and
                every story deserves to be remembered.
              </p>
            </div>
          </section>

          {/* EDITORIAL DIVIDER */}
          <div className="about-editorial-divider">
            <span>PRADAGRAPH</span>
            <span>PHOTOGRAPHY & VIDEOGRAPHY</span>
          </div>

          {/* SECTION 02 — EXPERIENCE & STYLE */}
          <section className="about-section about-section-second">

            <div className="about-text about-reveal-second">
              <span className="about-eyebrow">
                02 / THE APPROACH
              </span>

              <h2>
                Experience
                <br />
                <em>& Style.</em>
              </h2>

              <p>
                My experience spans event photography,
                DJ and artist shoots, portraits,
                couple sessions, lifestyle photography
                and creative projects. Across every
                setting, my focus remains the same:
                capturing genuine emotions, meaningful
                details and moments worth remembering.
              </p>

              <p>
                My photographic style combines a
                modern cinematic perspective with
                natural colours, thoughtful
                compositions and careful attention
                to lighting. I enjoy experimenting
                with different angles and visual
                techniques to give each photograph
                its own character.
              </p>

              <p>
                Whether it's the energy of a live
                performance or the quiet beauty of
                a personal moment, I aim to create
                images that feel authentic,
                visually striking and timeless.
              </p>

              <p className="about-emphasis">
                Creative vision. Natural emotions.
                Stories worth remembering.
              </p>
            </div>

            <div className="about-image-wrap about-reveal-second">
              <img
                src={aboutImages.style}
                alt="Pradaban Jayakumar working with his camera"
                className="about-image"
                loading="lazy"
                decoding="async"
              />
              <span className="about-image-caption">
                THE ART OF SEEING DIFFERENTLY
              </span>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}

export default About;
