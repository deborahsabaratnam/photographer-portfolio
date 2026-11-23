
import { useSearchParams } from "react-router";
import { collections, getCollectionById } from "../data/collections";
import AlbumGallery from "../components/AlbumGallery";
import "../styles/Portfolio.css";
import { optimizeCloudinaryImage } from "../utils/cloudinary";

function Portfolio() {
  const [searchParams, setSearchParams] = useSearchParams();

  const albumId = searchParams.get("album");
  const selectedCollection = getCollectionById(albumId);

  const openCollection = (id) => {
    setSearchParams({ album: id });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeCollection = () => {
    setSearchParams({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (selectedCollection) {
    return (
      <AlbumGallery
        collection={selectedCollection}
        onBack={closeCollection}
      />
    );
  }

  return (
    <main className="portfolio-page">

      {/* ========================================
                PORTFOLIO HERO
            ======================================== */}

      <section className="portfolio-hero">
        <div className="portfolio-hero-content">
          <span className="portfolio-eyebrow">
            PRADAGRAPH / THE PORTFOLIO
          </span>

          <h1>
            Every Frame,
            <em>A Story.</em>
          </h1>

          <p>
            A curated collection of moments,
            emotions, and stories told through
            the lens.
          </p>
        </div>
      </section>

      {/* ========================================
                COLLECTIONS
            ======================================== */}

      <section className="portfolio-collections">
        <div className="portfolio-collections-heading">
          <span>EXPLORE THE ARCHIVE</span>
          <h2>Selected Collections</h2>
        </div>

        <div className="portfolio-collections-grid">
          {collections.map((collection) => (
            <button
              key={collection.id}
              type="button"
              className="portfolio-collection-card"
              onClick={() =>
                openCollection(collection.id)
              }
              aria-label={`Explore ${collection.title}`}
            >
              <div className="portfolio-collection-image">
                {collection.cover ? (
                  <img
                    src={collection.cover}
                    srcSet={[400, 600, 900].map(width =>
                      `${optimizeCloudinaryImage(collection.cover, width)} ${width}w`
                    ).join(", ")}
                    sizes="(max-width: 768px) 90vw, 400px"
                    alt={collection.title}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="portfolio-image-placeholder">
                    <span>PRADAGRAPH</span>
                  </div>
                )}

                <div className="portfolio-collection-overlay">
                  <span>EXPLORE COLLECTION ↗</span>
                </div>
              </div>

              <div className="portfolio-collection-info">
                <span className="portfolio-collection-category">
                  {collection.number} / {collection.category}
                </span>

                <h3>{collection.title}</h3>
                <p>{collection.description}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

    </main>
  );
}

export default Portfolio;
