
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import BrandIntro from '../components/BrandIntro';
import PhotoCarousel from '../components/PhotoCarousel';
import Testimonials from '../components/Testimonials';
import CameraScene from '../components/CameraScene';

import '../styles/Home.css';

gsap.registerPlugin(ScrollTrigger);

function Home({ showIntro }) {
  const heroRef = useRef(null);
  const heroTextRef = useRef(null);
  const lensRef = useRef(null);

  const animation = useRef({
    zoom: 0,
    rotation: 0
  });

  const invalidateRef = useRef(null);

  useLayoutEffect(() => {
    if (showIntro) return;

    const ctx = gsap.context(() => {

      // Keep both typography layers hidden initially
      gsap.set(
        [heroTextRef.current, lensRef.current],
        {
          opacity: 0,
          y: 35
        }
      );

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: true,
          anticipatePin: 1
        }
      });

      // ========================================
      // PHASE 1: CAMERA ZOOM-OUT
      // ========================================

      timeline.fromTo(
        animation.current,
        { zoom: 0 },
        {
          zoom: 1,
          duration: 4,
          ease: 'none',
          onUpdate: () => {
            invalidateRef.current?.();
          }
        }
      );

      // ========================================
      // PHASE 2: CAMERA ROTATION
      // ========================================

      timeline.fromTo(
        animation.current,
        { rotation: 0 },
        {
          rotation: Math.PI * 120 / 180,
          duration: 2.5,
          ease: 'power1.inOut',
          onUpdate: () => {
            invalidateRef.current?.();
          }
        }
      );

      // ========================================
      // TYPOGRAPHY REVEAL
      // ========================================

      // All three words fade in together
      // while the camera is zooming out.

      timeline.to(
        [heroTextRef.current, lensRef.current],
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: 'power2.out'
        },
        1.5
      );

    }, heroRef);

    return () => ctx.revert();

  }, [showIntro]);

  return (
    <main className="home">

      <section
        ref={heroRef}
        className="hero-section"
      >

        {/* ========================================
            BACK LAYER: BEYOND / THE
        ======================================== */}

        <div
          ref={heroTextRef}
          className="hero-editorial"
        >
          <h1 className="hero-editorial-title">
            <span>BEYOND</span>
            <span>THE</span>
          </h1>
        </div>

        {/* ========================================
            MIDDLE LAYER: SONY 3D CAMERA
        ======================================== */}

        <div className="hero-camera-layer">
          <CameraScene
            animation={animation}
            invalidateRef={invalidateRef}
          />
        </div>

        {/* ========================================
            FRONT LAYER: LENS
        ======================================== */}

        <div
          ref={lensRef}
          className="hero-front-layer"
        >
          <span className="hero-lens-text">
            LENS
          </span>
        </div>

      </section>

      <BrandIntro />

      <div className="home-showcase">
        <PhotoCarousel />
        <Testimonials />
      </div>

    </main>
  );
}

export default Home;
