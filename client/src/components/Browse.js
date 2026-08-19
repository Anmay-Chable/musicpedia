import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AlbumDetailModal from "./AlbumDetailModal";
import { IconMusic } from "@tabler/icons-react";

const GENRES = ['All', 'Rock', 'Hip-Hop', 'Pop', 'Electronic'];

function Browse() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const initialSearch = searchParams.get('search') || '';

    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeGenre, setActiveGenre] = useState('All');
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [selectedAlbum, setSelectedAlbum] = useState(null);

    const fetchAlbums = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (activeGenre !== 'All') params.set('genre', activeGenre);
            if (searchTerm) params.set('search', searchTerm);

            const res = await fetch(`/api/albums?${params.toString()}`);
            if (!res.ok) throw new Error('Failed to load albums');
            const data = await res.json();
            setAlbums(data);
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    }, [activeGenre, searchTerm]);

    useEffect(() => {
        fetchAlbums();
    }, [fetchAlbums]);

    const handleDelete = async (e, albumId, albumTitle) => {
        e.stopPropagation();
        const confirmed = window.confirm(`Delete "${albumTitle}"? This can't be undone.`);
        if (!confirmed) return;
        try {
            const res = await fetch(`/api/albums/${albumId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete album');
            setAlbums((prev) => prev.filter((a) => a.id !== albumId));
        }
        catch (err) {
            alert(err.message);
        }
    };

    const handleEdit = (e, albumId) => {
        e.stopPropagation();
        navigate(`/edit/${albumId}`);
    };

    return (
        <main className="browse-container">
            {/* Category Filters */}
            <div className="browse-header">
                <div className="filters">
                    {GENRES.map((genre) => (
                        <button
                            key={genre}
                            className={`filter-pill ${activeGenre === genre ? 'active' : ''}`}
                            onClick={() => setActiveGenre(genre)}
                        >
                            {genre}
                        </button>
                    ))}
                </div>
                
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search within results..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading && <p className="browse-status">Loading albums...</p>}
            {error && <p className="browse-status browse-error">{error}</p>}
            {!loading && !error && albums.length === 0 && (
                <p className="browse-status">No albums found. Try a different filter or search.</p>
            )}

            {/* Dynamic Album Grid */}
            <div className="album-grid">
                {albums.map((album) => (
                    <article key={album.id} className="album-card" onClick={() => setSelectedAlbum(album)}>
                        <div className="image-wrapper">
                            {album.coverUrl ? (
                                <img src={album.coverUrl} alt={`${album.title} Cover`} />
                            ) : (
                                <div className="cover-placeholder">
                                    <IconMusic size={40} color="var(--accent-color)" stroke={1.5} />
                                </div>
                            )}
                        </div>
                        <div className="card-text">
                            <h3 className="album-title">{album.title}</h3>
                            <p className="album-meta">
                                {album.artist} • {album.genre || 'Unknown genre'} • {album.year || 'N/A'}
                            </p>
                            <div className="card-actions">
                                <button className="edit-btn" onClick={(e) => handleEdit(e, album.id)}>
                                    Edit
                                </button>
                                <button className="delete-btn" onClick={(e) => handleDelete(e, album.id, album.title)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            <AlbumDetailModal album={selectedAlbum} onClose={() => setSelectedAlbum(null)} />
        </main>
    );
}

export default Browse;