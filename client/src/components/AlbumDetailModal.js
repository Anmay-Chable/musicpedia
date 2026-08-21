import React, { useEffect, useState } from "react";
import { IconMusic, IconPlayerPlay, IconPlayerPause } from "@tabler/icons-react";

function AlbumDetailModal({ album, onClose, onSelectAlbum, playingId, onPlayToggle, progress }) {
    const [related, setRelated] = useState([]);
    const [tracklist, setTracklist] = useState([]);
    const [tracklistLoading, setTracklistLoading] = useState(false);

    // Close on Escape, and lock background scroll while open
    useEffect (() => {
        if (!album) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [album, onClose]);

    // Load other albums by the same artist whenever the shown album changes
    useEffect (() => {
        if (!album) {
            setRelated([]);
            return;
        }

        const loadRelated = async () => {
            try {
                const res = await fetch(`/api/albums?search=${encodeURIComponent(album.artist)}`);
                if (!res.ok) return;
                const data = await res.json();
                setRelated(data.filter((a) => a.id !== album.id));
            }
            catch {
                setRelated([]);
            }
        };

        loadRelated();
    }, [album]);

    useEffect(() => {
        if (!album || !album.collectionId) {
            setTracklist([]);
            return;
        }

        setTracklistLoading(true);
        const loadTracklist = async () => {
            try {
                const res = await fetch(`/api/albums/${album.id}/tracklist`);
                const data = res.ok ? await res.json() : [];
                setTracklist(data);
            }
            catch {
                setTracklist([]);
            }
            finally {
                setTracklistLoading(false);
            }
        };

        loadTracklist();
    }, [album]);

    if (!album) return null;

    const isPlaying = playingId === album.id;
    const hasTracklist = Boolean(album.collectionId);

    const hasRightCol = hasTracklist || related.length > 0;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            {/* stopPropagation so clicking inside the modal doesn't close it, but clicking the 'X' or outside modal does close it */}
            <div className={`modal-content glass-panel ${hasRightCol ? 'modal-content-wide' : 'modal-content-compact'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <button className="modal-close" onClick={onClose} aria-label="Close">
                    &times;
                </button>

                <div className="modal-main">
                    <div className="modal-left-col">
                        <div className="modal-top">
                            <div className="modal-cover">
                                {album.coverUrl ? (
                                    <img src={album.coverUrl} alt={`${album.title} Cover`} />
                                ) : (
                                    <div className="cover-placeholder large">
                                        <IconMusic size={56} color="var(--accent-color)" stroke={1.5} />
                                    </div>
                                )}
                            </div>

                            <div className="modal-basic-info">
                                <div className="modal-title-row">
                                    <h2 className="modal-title">{album.title}</h2>
                                    {album.previewUrl && (
                                        <button
                                            className="modal-play-btn"
                                            onClick={(e) => onPlayToggle(e, album)}
                                            aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
                                        >
                                            {isPlaying && (
                                                <span className="modal-play-progress" style={{ width: `${progress * 100}%` }} />
                                            )}
                                            <span className="modal-play-content">
                                                {isPlaying ? <IconPlayerPause size={18} stroke={2} /> : <IconPlayerPlay size={18} stroke={2} />}
                                                {isPlaying ? 'Pause' : 'Play preview'}
                                            </span>
                                        </button>
                                    )}
                                </div>
                                <p className="modal-subtitle">
                                    {album.artist} • {album.genre || 'Unknown genre'} • {album.year || 'N/A'}
                                </p>

                                <dl className="modal-details">
                                    <dt>Record Label</dt>
                                    <dd>{album.label || 'Unknown'}</dd>

                                    <dt>Producer(s)</dt>
                                    <dd>{album.producer || 'Unknown'}</dd>
                                </dl>
                            </div>
                        </div>

                        <div className="modal-background-section">
                            <h3 className="modal-section-title">Background & Historical Context</h3>
                            <p className="modal-background">
                                {album.backgroundInfo || 'No background info was documented for this entry.'}
                            </p>
                        </div>
                    </div>

                    {hasRightCol && (
                        <div className={"modal-right-col"}>
                            {album.collectionId && (
                                <div className="modal-tracklist-section">
                                    <h3 className="modal-section-title">Tracklist</h3>
                                    {tracklistLoading && (
                                        <p className="modal-tracklist-loading">Loading tracklist...</p>
                                    )}
                                    {!tracklistLoading && tracklist.length > 0 && (
                                        <ul className="modal-tracklist">
                                            {tracklist.map((track) => {
                                                const linkedEntry = related.find(
                                                    (r) => r.title.trim().toLowerCase() === track.trackName.trim().toLowerCase()
                                                );
                                                return (
                                                    <li key={track.trackNumber} className="tracklist-item">
                                                        <span className="tracklist-number">{track.trackNumber}.</span>
                                                        {linkedEntry ? (
                                                            <button
                                                                className="tracklist-link"
                                                                onClick={() => onSelectAlbum(linkedEntry)}
                                                            >
                                                                {track.trackName}
                                                                <span className="tracklist-badge">In wiki</span>
                                                            </button>
                                                        ) : (
                                                            <span className="tracklist-plain">{track.trackName}</span>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                            )}

                            {related.length > 0 && (
                                <div className="modal-related">
                                    <h3 className="modal-section-title">More by {album.artist}</h3>
                                    <div className="modal-related-list">
                                        {related.map((r) => (
                                            <button
                                                key={r.id}
                                                className="modal-related-item"
                                                onClick={() => onSelectAlbum(r)}
                                            >
                                                {r.coverUrl ? (
                                                    <img src={r.coverUrl} alt={`${r.title} Cover`} />
                                                ) : (
                                                    <div className="cover-placeholder">
                                                        <IconMusic size={20} color="var(--accent-color" stroke={1.5} />
                                                    </div>
                                                )}
                                                <span>{r.title}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AlbumDetailModal;