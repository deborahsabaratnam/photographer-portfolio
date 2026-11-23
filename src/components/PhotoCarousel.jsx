
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';

import '../styles/PhotoCarousel.css';

// ========================================
// CAROUSEL PHOTOGRAPHS
// ========================================

const photographs = [
    'https://res.cloudinary.com/db8dcy5no/image/upload/v1795262894/IMG_3372_izheil.jpg',
    'https://res.cloudinary.com/db8dcy5no/image/upload/v1795262916/IMG_7770_z7sguo.jpg',
    'https://res.cloudinary.com/db8dcy5no/image/upload/v1795263082/DSC00256_uyhg8l.webp',
    'https://res.cloudinary.com/db8dcy5no/image/upload/v1795263314/IMG_3350_kphtg6.jpg',
    'https://res.cloudinary.com/db8dcy5no/image/upload/v1795263349/IMG_3368_kpqp92.jpg',
    'https://res.cloudinary.com/db8dcy5no/image/upload/v1795263364/DSC08926_nxdubr.webp',
    'https://res.cloudinary.com/db8dcy5no/image/upload/v1795263384/DSC00271_oag8bt.webp',
    'https://res.cloudinary.com/db8dcy5no/image/upload/v1795263677/IMG_3347_rev5td.webp',
    'https://res.cloudinary.com/db8dcy5no/image/upload/v1795263893/hero_image_1_tkdwln.webp',
    'https://res.cloudinary.com/db8dcy5no/image/upload/v1795263660/DSC00280_psw5sn.webp'
];

// PERFORMANCE: Automatically compresses and resizes Cloudinary images
// to a maximum width of 800px, reducing download size and loading time.
const optimizeCloudinaryImage = (url) => {
    return url.replace(
        '/upload/',
        '/upload/f_auto,q_auto,c_limit,w_800/'
    );
};

function PhotoCarousel() {

    const sectionRef = useRef(null);
    const trackRef = useRef(null);
    const cardsRef = useRef([]);

    const positionRef = useRef(0);
    const targetRef = useRef(0);

    const pausedRef = useRef(false);
    const draggingRef = useRef(false);
    const visibleRef = useRef(false);
    const reducedMotionRef = useRef(false);
    const pointerRef = useRef(0);

    const [isDragging, setIsDragging] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // PERFORMANCE: Prevents carousel images from loading until
    // the visitor approaches the carousel section.
    const [shouldLoadImages, setShouldLoadImages] = useState(false);

    // ========================================
    // INVERTED PERSPECTIVE ANIMATION
    // ========================================

    useEffect(() => {

        let frameId;
        let previousTime = 0;

        const mediaQuery = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        );

        const updateMotionPreference = () => {
            reducedMotionRef.current = mediaQuery.matches;
        };

        updateMotionPreference();

        mediaQuery.addEventListener(
            'change',
            updateMotionPreference
        );

        // PERFORMANCE: Detects when the carousel is within 400px
        // of the viewport and loads optimized images in advance.
        const observer = new IntersectionObserver(
            ([entry]) => {

                visibleRef.current = entry.isIntersecting;

                if (entry.isIntersecting) {
                    setShouldLoadImages(true);
                }

            },
            {
                rootMargin: '400px 0px',
                threshold: 0
            }
        );

        observer.observe(sectionRef.current);

        const render = (time) => {

            const delta = previousTime
                ? Math.min((time - previousTime) / 1000, 0.05)
                : 0;

            previousTime = time;

            const track = trackRef.current;

            if (!track || !visibleRef.current) {
                frameId = requestAnimationFrame(render);
                return;
            }

            const width = track.clientWidth;

            const spacing = Math.max(115, width / 7.2);

            const totalWidth = photographs.length * spacing;

            // Slow automatic movement
            if (
                !pausedRef.current &&
                !draggingRef.current &&
                !reducedMotionRef.current
            ) {
                targetRef.current += delta * 0.22;
            }

            // Smooth movement
            const smoothing = 1 - Math.exp(-delta * 9);

            positionRef.current +=
                (targetRef.current - positionRef.current)
                * smoothing;

            cardsRef.current.forEach((card, index) => {

                if (!card) return;

                // Seamless infinite loop
                let x = (index - positionRef.current) * spacing;

                x =
                    ((x + totalWidth / 2) % totalWidth
                        + totalWidth) % totalWidth
                    - totalWidth / 2;

                // Distance from the center
                const distance = Math.min(
                    Math.abs(x) / (width / 2),
                    1
                );

                // Smaller in center, larger at sides
                const scale =
                    0.62 + Math.pow(distance, 1.4) * 0.58;

                // Center moves further into perspective
                const depth = -160 + distance * 160;

                // Subtle inward rotation
                const rotation =
                    -Math.sign(x) * distance * 24;

                card.style.transform = `
                    translate3d(${x}px, 0, ${depth}px)
                    rotateY(${rotation}deg)
                    scale(${scale})
                `;

                card.style.zIndex =
                    Math.round(distance * 100);

            });

            frameId = requestAnimationFrame(render);

        };

        frameId = requestAnimationFrame(render);

        return () => {

            cancelAnimationFrame(frameId);
            observer.disconnect();

            mediaQuery.removeEventListener(
                'change',
                updateMotionPreference
            );

        };

    }, []);

    // ========================================
    // ARROW NAVIGATION
    // ========================================

    const movePrevious = () => {
        targetRef.current -= 1;
    };

    const moveNext = () => {
        targetRef.current += 1;
    };

    // ========================================
    // DRAG AND SWIPE
    // ========================================

    const handlePointerDown = (event) => {

        if (event.pointerType === 'mouse' && event.button !== 0) {
            return;
        }

        draggingRef.current = true;
        pointerRef.current = event.clientX;

        event.currentTarget.setPointerCapture(
            event.pointerId
        );

        setIsDragging(true);

    };

    const handlePointerMove = (event) => {

        if (!draggingRef.current) return;

        const movement =
            event.clientX - pointerRef.current;

        const spacing = Math.max(
            115,
            trackRef.current.clientWidth / 7.2
        );

        targetRef.current -= movement / spacing;

        pointerRef.current = event.clientX;

    };

    const handlePointerUp = () => {

        draggingRef.current = false;
        setIsDragging(false);

    };

    // ========================================
    // PLAY / PAUSE AUTOPLAY
    // ========================================

    const toggleAutoplay = () => {

        pausedRef.current = !pausedRef.current;

        setIsPaused(pausedRef.current);

    };

    return (

        <section
            className="photo-carousel-section"
            ref={sectionRef}
            aria-label="Selected Pradagraph photography"
        >

            <div className="photo-carousel">

                {/* PREVIOUS BUTTON */}

                <button
                    className="carousel-arrow carousel-previous"
                    onClick={movePrevious}
                    aria-label="Previous photograph"
                    type="button"
                >
                    ←
                </button>

                {/* PHOTOGRAPH TRACK */}

                <div
                    className={`carousel-track ${isDragging ? 'dragging' : ''}`}
                    ref={trackRef}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    onLostPointerCapture={handlePointerUp}
                >

                    {photographs.map((image, index) => (

                        <div
                            className="carousel-photo"
                            key={index}
                            ref={(element) => {
                                cardsRef.current[index] = element;
                            }}
                        >

                            {/* PERFORMANCE: Display placeholders until
                                the carousel approaches the viewport. */}

                            {!shouldLoadImages || image.startsWith('YOUR_') ? (

                                <div className="carousel-placeholder">
                                    {String(index + 1).padStart(2, '0')}
                                </div>

                            ) : (

                                <img
                                    src={optimizeCloudinaryImage(image)}
                                    alt={`Pradagraph portfolio photograph ${index + 1}`}
                                    loading="lazy"
                                    decoding="async"
                                    draggable={false}
                                />

                            )}

                        </div>

                    ))}

                </div>

                {/* NEXT BUTTON */}

                <button
                    className="carousel-arrow carousel-next"
                    onClick={moveNext}
                    aria-label="Next photograph"
                    type="button"
                >
                    →
                </button>

            </div>

            {/* ========================================
                CAROUSEL CONTROLS
                Circular playback button on the left
                Portfolio CTA on the right
            ======================================== */}

            <div className="carousel-bottom">

                <button
                    type="button"
                    className={`carousel-playback ${isPaused ? 'is-paused' : ''}`}
                    onClick={toggleAutoplay}
                    aria-label={isPaused ? 'Resume carousel' : 'Pause carousel'}
                    aria-pressed={isPaused}
                >

                    {/* Only one outer circle: the button border.
                        SVG contains just the play or pause symbol. */}

                    {isPaused ? (

                        // Two pause bars, shown when paused
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                        >
                            <rect
                                x="6"
                                y="4"
                                width="4"
                                height="16"
                                rx="1"
                                fill="currentColor"
                            />
                            <rect
                                x="14"
                                y="4"
                                width="4"
                                height="16"
                                rx="1"
                                fill="currentColor"
                            />
                        </svg>

                    ) : (

                        // Play triangle, shown while autoplay is active
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="M8 5L19 12L8 19V5Z"
                                fill="currentColor"
                            />
                        </svg>

                    )}

                </button>

                <Link
                    to="/portfolio"
                    className="carousel-cta"
                >
                    EXPLORE PORTFOLIO
                    <span>→</span>
                </Link>

            </div>

        </section>

    );
}

export default PhotoCarousel;
