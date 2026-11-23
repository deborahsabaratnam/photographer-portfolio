
import { Link } from 'react-router';
import '../styles/FeaturedAlbums.css';
import { optimizeCloudinaryImage } from "../utils/cloudinary";

const albums = [

    {
        id: 'nalangu',
        number: '01',
        category: 'THE TRADITION',
        title: 'Nalangu',
        description: 'A celebration of love and tradition.',
        image: 'https://res.cloudinary.com/db8dcy5no/image/upload/v1795409093/IMG_2478_dvdh0s.jpg'
    },
    {
        id: 'portraits',
        number: '02',
        category: 'THE INDIVIDUAL',
        title: 'Portraits',
        description: 'The art of being yourself.',
        image: 'https://res.cloudinary.com/db8dcy5no/image/upload/v1795409126/IMG_4585_cgqu7c.jpg'
    },

    {
        id: 'school-walk',
        number: '03',
        category: 'THE CELEBRATION',
        title: 'Vivekaz Walk',
        description: 'The spirit of a generation.',
        image: 'https://res.cloudinary.com/db8dcy5no/image/upload/v1795409981/IMG_5697_ttd78q.jpg'
    }
];

function FeaturedAlbums() {
    return (
        <section className="featured-albums-section">

            <div className="featured-albums-container">

                <div className="featured-albums-heading">

                    <h2>
                        Stories Worth <em>Remembering.</em>
                    </h2>

                    <p>
                        A collection of moments, emotions,
                        and celebrations.
                    </p>
                </div>

                <div className="featured-albums-grid">
                    {albums.map((album) => (
                        <Link
                            key={album.id}
                            to={`/portfolio?album=${album.id}`}
                            className="featured-album-card"
                            aria-label={`View ${album.title} album`}
                        >
                            <div className="featured-album-image">
                                <img
                                    src={optimizeCloudinaryImage(album.image, 900)}
                                    alt={`${album.title} photography`}
                                    loading="lazy"
                                    decoding="async"
                                    sizes="(max-width: 768px) 90vw, 33vw"
                                    srcSet={[
                                        400,
                                        600,
                                        900
                                    ].map(width =>
                                        `${optimizeCloudinaryImage(album.image, width)} ${width}w`
                                    ).join(", ")}
                                />

                                <div className="featured-album-overlay">
                                    <span>VIEW ALBUM ↗</span>
                                </div>
                            </div>

                            <div className="featured-album-info">
                                <span className="featured-album-category">
                                    {album.number} / {album.category}
                                </span>

                                <h3>{album.title}</h3>

                                <p>{album.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>

        </section>
    );
}

export default FeaturedAlbums;
