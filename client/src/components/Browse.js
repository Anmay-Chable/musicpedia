import React, { useState } from 'react';

function Browse() {
    // Temporary state to hold placeholder data
    const [albums, setAlbums] = useState([
        {
            id: 1,
            title: "Neon Nights",
            artist: "Synthwave Collective",
            genre: "Electronic",
            year: "2024",
            coverUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500"
        },
        {
            id: 2,
            title: "The DJ Sessions",
            artist: "DJ Apollo",
            genre: "Live Set",
            year: "2023",
            coverUrl: "https://images.unsplash.com/photo-1493225457124-a1a2a5956093?w=500"
        },
        {
            id: 3,
            title: "Midnight Acoustics",
            artist: "The String Quartet",
            genre: "Alternative",
            year: "2022",
            coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500"
        }
    ]);

    return (
        <main className="browse-container">
            {/* Category Filters */}
            <div className="browse-header">
                <div className="filters">
                    <button className="filter-pill active">All</button>
                    <button className="filter-pill">Rock</button>
                    <button className="filter-pill">Hip-Hop</button>
                    <button className="filter-pill">Pop</button>
                    <button className="filter-pill">Electronic</button>
                </div>
            </div>

            {/* Dynamic Album Grid */}
            <div className="album-grid">
                {albums.map((album) => (
                    <article key={album.id} className="album-card">
                        <div className="image-wrapper">
                            <img src={album.coverUrl} alt={`${album.title} Cover`} />
                            <button className="play-btn">&#9654;</button> 
                        </div>
                        <div className="card-text">
                            <h3 className="album-title">{album.title}</h3>
                            <p className="album-meta">{album.artist} • {album.genre} • {album.year}</p>
                        </div>
                    </article>
                ))}
            </div>
        </main>
    );
}

export default Browse;