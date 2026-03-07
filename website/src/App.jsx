import React, { useState, useEffect } from 'react';
import { ChevronDown, X, ChevronLeft, ChevronRight, Heart } from 'lucide-react';

export default function App() {
    const [photos, setPhotos] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Import all JPG files from the parent directory
        const loadPhotos = async () => {
            try {
                const modules = import.meta.glob('../*.{JPG,jpg}', { eager: true, query: '?url', import: 'default' });
                const photoPaths = Object.values(modules);
                setPhotos(photoPaths);
            } catch (error) {
                console.error("Error loading photos:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadPhotos();
    }, []);

    const openLightbox = (index) => {
        setSelectedIndex(index);
        setSelectedPhoto(photos[index]);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setSelectedPhoto(null);
        setSelectedIndex(-1);
        document.body.style.overflow = 'auto';
    };

    const nextPhoto = (e) => {
        e.stopPropagation();
        const newIndex = (selectedIndex + 1) % photos.length;
        setSelectedIndex(newIndex);
        setSelectedPhoto(photos[newIndex]);
    };

    const prevPhoto = (e) => {
        e.stopPropagation();
        const newIndex = (selectedIndex - 1 + photos.length) % photos.length;
        setSelectedIndex(newIndex);
        setSelectedPhoto(photos[newIndex]);
    };

    // Allow keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!selectedPhoto) return;
            if (e.key === 'ArrowRight') nextPhoto(e);
            if (e.key === 'ArrowLeft') prevPhoto(e);
            if (e.key === 'Escape') closeLightbox();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedPhoto, selectedIndex]);

    const scrollToGallery = () => {
        document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="app-container">
            {/* Hero Section */}
            <section className="hero" style={{
                backgroundImage: photos.length > 0 ? `url(${photos[0]})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}>
                <div className="hero-content">
                    <h1 className="hero-title">Our Wedding Story</h1>
                    <p className="hero-subtitle">A Beautiful Memory Made Together</p>
                </div>
                <div className="scroll-indicator" onClick={scrollToGallery}>
                    <ChevronDown size={32} />
                </div>
            </section>

            {/* Romance Section */}
            <section className="romance-section">
                <div className="romance-container">
                    <Heart className="romance-icon" size={48} />
                    <h2 className="romance-title">Two Souls, One Heart</h2>
                    <p className="romance-quote">
                        "I love you not only for what you are, but for what I am when I am with you."
                    </p>
                    <p className="romance-text">
                        Every moment captured here reflects a lifetime of promises. From our very first glance to the day we said "I do," our journey has been filled with countless blessings. These memories aren't just photographs; they are the beautiful chapters of our never-ending love story. Take a walk through our most cherished moments.
                    </p>
                    <div className="romance-divider"></div>
                </div>
            </section>

            {/* Gallery Section */}
            <section id="gallery" className="gallery-section">
                <div className="section-header">
                    <h2 className="section-title">The Gallery</h2>
                    <div className="section-divider"></div>
                </div>

                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#a3958c' }}>
                        <p>Gathering memories...</p>
                    </div>
                ) : (
                    <div className="masonry-grid">
                        {photos.map((photoUrl, index) => {
                            // Creating a staggered/masonry look by setting different heights statically based on index
                            const rowSpan = index % 5 === 0 ? 2 : index % 7 === 0 ? 3 : 1;
                            const gridRowEnd = `span ${rowSpan}`;

                            return (
                                <div
                                    key={index}
                                    className="masonry-item"
                                    style={{ gridRowEnd, minHeight: rowSpan * 200 + 'px' }}
                                    onClick={() => openLightbox(index)}
                                >
                                    <img src={photoUrl} alt={`Wedding moment ${index + 1}`} className="masonry-img" loading="lazy" />
                                    <div className="masonry-overlay">
                                        <Heart color="white" fill="white" size={32} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Footer */}
            <footer>
                <p>&copy; {new Date().getFullYear()} Our Beautiful Union &bull; Captured Forever</p>
            </footer>

            {/* Lightbox */}
            {selectedPhoto && (
                <div className="lightbox" onClick={closeLightbox}>
                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <button className="lightbox-close" onClick={closeLightbox}>
                            <X size={32} />
                        </button>
                        <button className="lightbox-nav nav-prev" onClick={prevPhoto}>
                            <ChevronLeft size={32} />
                        </button>
                        <img src={selectedPhoto} alt="Enlarged wedding moment" className="lightbox-img" />
                        <button className="lightbox-nav nav-next" onClick={nextPhoto}>
                            <ChevronRight size={32} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
