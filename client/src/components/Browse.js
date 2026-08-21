import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { IconMusic, IconPlayerPlay, IconPlayerPause } from "@tabler/icons-react";
import { GENRES } from "../Constants";
import AlbumDetailModal from "./AlbumDetailModal";
import ConfirmDialog from "./ConfirmDialog";
import Toast from "./Toast";

const FILTER_GENRES = ['All', ...GENRES];
const RING_RADIUS = 21;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function sortAlbums(list, sortBy) {
    const sorted = [...list];
    switch (sortBy) {
        case 'az':
            sorted.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'year':
            sorted.sort((a, b) => (b.year || 0) - (a.year || 0));
            break;
        case 'newest':
        default:
            sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return sorted;
}

function Browse() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    const initialSearch = searchParams.get('search') || '';
    const initialSort = searchParams.get('sort') || 'newest';

    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeGenre, setActiveGenre] = useState('All');
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [sortBy, setSortBy] = useState(initialSort);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [toast, setToast] = useState(null);
    const [playingId, setPlayingId] = useState(null);
    const [progress, setProgress] = useState(0);

    const audioRef = useRef(null);

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

    // Show a toast if we were sent here from a successful create/edit
    useEffect(() => {
        if (location.state?.toastMessage) {
            setToast({ message: location.state.toastMessage, type: 'success' });
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    // Stop any playing preview when the component unmounts
    useEffect(() => {
        return () => {
            if (audioRef.current) audioRef.current.pause();
        };
    }, []);

    const displayedAlbums = useMemo(() => sortAlbums(albums, sortBy), [albums, sortBy]);

    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortBy(value);
        const next = new URLSearchParams(searchParams);
        if (value !== 'newest') next.set('sort', value);
        else next.delete('sort');
        setSearchParams(next);
    };

    const handleDeleteClick = async (e, album) => {
        e.stopPropagation();
        setConfirmDelete(album);
    };

    const confirmDeleteAlbum = async () => {
        if (!confirmDelete) return;
        try {
            const res = await fetch(`/api/albums/${confirmDelete.id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete album');
            setAlbums((prev) => prev.filter((a) => a.id !== confirmDelete.id));
            setToast({ message: `"${confirmDelete.title}" deleted`, type: 'success' });
        }
        catch (err) {
            setToast({ message: err.message, type: 'error' });
        }
        finally {
            setConfirmDelete(null);
        }
    };

    const handleEdit = (e, albumId) => {
        e.stopPropagation();
        navigate(`/edit/${albumId}`);
    };

    const handlePlayToggle = (e, album) => {
        e.stopPropagation();
        if (!album.previewUrl) return;

        if (playingId === album.id) {
            audioRef.current?.pause();
            setPlayingId(null);
            setProgress(0);
            return;
        }

        if (audioRef.current) {
            audioRef.current.pause();
        }

        const audio = new Audio(album.previewUrl);
        audio.addEventListener('timeupdate', () => {
            if (audio.duration) setProgress(audio.currentTime / audio.duration)
        });
        audio.addEventListener('ended', () => {
            setPlayingId(null);
            setProgress(0);
        })
        audio.addEventListener('error', () => {
            setPlayingId(null);
            setToast({ message: 'Preview unavailable for this track', type: 'error' });
        });
        audioRef.current = audio;
        setProgress(0)

        audio.play()
            .then(() => setPlayingId(album.id))
            .catch(() => {
            setPlayingId(null);
            setToast({ message: 'Preview unavailable for this track', type: 'error' });
        });
    }

    return (
        <main className="browse-container">
            {/* Category Filters */}
            <div className="browse-header">
                <div className="filters">
                    {FILTER_GENRES.map((genre) => (
                        <button
                            key={genre}
                            className={`filter-pill ${activeGenre === genre ? 'active' : ''}`}
                            onClick={() => setActiveGenre(genre)}
                        >
                            {genre}
                        </button>
                    ))}
                </div>

                <div className="browse-controls">
                    <select className="sort-select" value={sortBy} onChange={handleSortChange}>
                        <option value="newest">Newest</option>
                        <option value="az">A-Z</option>
                        <option value="year">Release Year</option>
                    </select>

                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search within results..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading && <p className="browse-status">Loading albums...</p>}
            {error && <p className="browse-status browse-error">{error}</p>}
            {!loading && !error && displayedAlbums.length === 0 && (
                <p className="browse-status">No albums found. Try a different filter or search.</p>
            )}

            {/* Dynamic Album Grid */}
            <div className="album-grid">
                {displayedAlbums.map((album) => (
                    <article key={album.id} className="album-card" onClick={() => setSelectedAlbum(album)}>
                        <div className="image-wrapper">
                            {album.coverUrl ? (
                                <img src={album.coverUrl} alt={`${album.title} Cover`} />
                            ) : (
                                <div className="cover-placeholder">
                                    <IconMusic size={40} color="var(--accent-color)" stroke={1.5} />
                                </div>
                            )}
                            {album.previewUrl && (
                                <div className="play-btn-wrapper">
                                    <svg className="play-progress-ring" viewBox="0 0 48 48">
                                        <circle className="play-progress-track" cx="24" cy="24" r={RING_RADIUS} />
                                        {playingId === album.id && (
                                            <circle
                                                className="play-progress-fill"
                                                cx="24" cy="24" r={RING_RADIUS}
                                                style={{
                                                    strokeDasharray: RING_CIRCUMFERENCE,
                                                    strokeDashoffset: RING_CIRCUMFERENCE * (1 - progress),
                                                }}
                                            />
                                        )}
                                    </svg>
                                    <button
                                        className="play-btn"
                                        onClick={(e) => handlePlayToggle(e, album)}
                                        aria-label={playingId === album.id ? 'Pause preview' : 'Play preview'}
                                    >
                                        {playingId === album.id ? (
                                            <IconPlayerPause size={20} stroke={2} />
                                        ) : (
                                            <IconPlayerPlay size={20} stroke={2} />
                                        )}
                                    </button>
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
                                <button className="delete-btn" onClick={(e) => handleDeleteClick(e, album)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            <AlbumDetailModal
                album={selectedAlbum}
                onClose={() => setSelectedAlbum(null)}
                onSelectAlbum={(album) => setSelectedAlbum(album)}
                playingId={playingId}
                onPlayToggle={handlePlayToggle}
                progress={progress}
            />

            <ConfirmDialog
                open={Boolean(confirmDelete)}
                title="Delete album?"
                message={confirmDelete ? `"${confirmDelete.title}" will be permanently removed. This can't be undone.` : ''}
                confirmLabel="Delete"
                danger
                onConfirm={confirmDeleteAlbum}
                onCancel={() => setConfirmDelete(null)}
            />

            <Toast message={toast?.message} type={toast?.type} onDone={() => setToast(null)} />
        </main>
    );
}

export default Browse;