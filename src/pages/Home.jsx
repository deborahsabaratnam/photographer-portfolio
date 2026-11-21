import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import CameraScene from '../components/CameraScene';
import '../styles/Home.css';

gsap.registerPlugin(ScrollTrigger);

function Home({ showIntro }) {

  const heroRef = useRef(null);

  const animation = useRef({
    zoom: 0,
    rotation: 0
  });

  const invalidateRef = useRef(null);

  useLayoutEffect(() => {

    if (showIntro) return;

    const ctx = gsap.context(() => {

      gsap.fromTo(
        heroRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.5,
          ease: 'power2.out'
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

    }, heroRef);

    return () => ctx.revert();

  }, [showIntro]);

  return (
    <main className="home">

      <section
        ref={heroRef}
        className="hero-section"
      >

        <CameraScene
          animation={animation}
          invalidateRef={invalidateRef}
        />

      </section>

    </main>
  );
}

export default Home;