
import { useEffect, useState } from "react";
import { optimizeCloudinaryImage } from "../utils/cloudinary";
import "../styles/AlbumGallery.css";

function AlbumGallery({ collection, onBack }) {
    const [activeIndex, setActiveIndex] = useState(null);

    const media = collection.media || [];
    const activeMedia =
        activeIndex !== null ? media[activeIndex] : null;

    const closeLightbox = () => {
        setActiveIndex(null);
    };

    const nextMedia = () => {
        setActiveIndex((current) =>
            (current + 1) % media.length
        );
    };

    const previousMedia = () => {
        setActiveIndex((current) =>
            (current - 1 + media.length) % media.length
        );
    };

    useEffect(() => {
        setActiveIndex(null);
    }, [collection.id]);

    useEffect(() => {
        if (activeIndex === null) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setActiveIndex(null);
            }

            if (event.key === "ArrowRight") {
                setActiveIndex((current) =>
                    (current + 1) % media.length
                );
            }

            if (event.key === "ArrowLeft") {
                setActiveIndex((current) =>
                    (current - 1 + media.length) % media.length
                );
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [activeIndex, media.length]);

    return (
        <main className="album-page">

            {/* ========================================
                ALBUM HEADER
            ======================================== */}

            <section className="album-header">

                <button
                    className="album-back"
                    type="button"
                    onClick={onBack}
                >
                    <span aria-hidden="true">←</span>
                    BACK TO COLLECTIONS
                </button>

                <div className="album-heading">
                    <span className="album-eyebrow">
                        PRADAGRAPH / {collection.category}
                    </span>

                    <h1>{collection.title}</h1>

                    <p>{collection.description}</p>

                    <span className="album-count">
                        {media.length} MEDIA ITEMS
                    </span>
                </div>

            </section>

            {/* ========================================
                MEDIA GRID
            ======================================== */}

            <section className="album-gallery-section">

                {media.length === 0 ? (
                    <div className="album-empty">
                        <p>
                            This collection is being curated.
                        </p>
                    </div>
                ) : (
                    <div className="album-media-grid">

                        {media.map((item, index) => (
                            <button
                                key={`${collection.id}-${index}`}
                                type="button"
                                className="album-media-item"
                                onClick={() => setActiveIndex(index)}
                                aria-label={`Open media ${index + 1}`}
                            >

                                {item.type === "video" ? (
                                    <>
                                        {item.poster ? (
                                            <img
                                                src={optimizeCloudinaryImage(
                                                    item.poster,
                                                    800
                                                )}
                                                alt={`${collection.title} video preview`}
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        ) : (
                                            <video
                                                src={item.url}
                                                muted
                                                playsInline
                                                preload="metadata"
                                            />
                                        )}

                                        <span className="album-play-icon">
                                            ▶
                                        </span>
                                    </>
                                ) : (
                                    <img
                                        src={optimizeCloudinaryImage(
                                            item.url,
                                            900
                                        )}
                                        alt={`${collection.title} photograph ${index + 1}`}
                                        loading="lazy"
                                        decoding="async"
                                    />
                                )}

                                <div className="album-media-overlay">
                                    <span>
                                        {item.type === "video"
                                            ? "PLAY VIDEO ↗"
                                            : "VIEW IMAGE ↗"}
                                    </span>
                                </div>

                            </button>
                        ))}

                    </div>
                )}

            </section>

            {/* ========================================
                FULLSCREEN LIGHTBOX
            ======================================== */}

            {activeMedia && (
                <div
                    className="album-lightbox"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${collection.title} media viewer`}
                    onClick={closeLightbox}
                >

                    <button
                        type="button"
                        className="album-lightbox-close"
                        onClick={closeLightbox}
                        aria-label="Close viewer"
                    >
                        ×
                    </button>

                    {media.length > 1 && (
                        <button
                            type="button"
                            className="album-lightbox-prev"
                            onClick={(event) => {
                                event.stopPropagation();
                                previousMedia();
                            }}
                            aria-label="Previous media"
                        >
                            ‹
                        </button>
                    )}

                    <div
                        className="album-lightbox-content"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        {activeMedia.type === "video" ? (
                            <video
                                key={activeMedia.url}
                                src={activeMedia.url}
                                poster={
                                    activeMedia.poster
                                        ? optimizeCloudinaryImage(
                                            activeMedia.poster,
                                            1200
                                        )
                                        : undefined
                                }
                                controls
                                autoPlay
                                playsInline
                                preload="metadata"
                            />
                        ) : (
                            <img
                                src={optimizeCloudinaryImage(
                                    activeMedia.url,
                                    1800
                                )}
                                alt={`${collection.title} photograph`}
                            />
                        )}
                    </div>

                    {media.length > 1 && (
                        <button
                            type="button"
                            className="album-lightbox-next"
                            onClick={(event) => {
                                event.stopPropagation();
                                nextMedia();
                            }}
                            aria-label="Next media"
                        >
                            ›
                        </button>
                    )}

                    <span className="album-lightbox-counter">
                        {activeIndex + 1} / {media.length}
                    </span>

                </div>
            )}

        </main>
    );
}

export default AlbumGallery;
