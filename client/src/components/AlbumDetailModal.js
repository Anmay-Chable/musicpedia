import React, { useEffect, useState } from "react";
import { IconMusic, IconPlayerPlay, IconPlayerPause } from "@tabler/icons-react";

function AlbumDetailModal({ album, onClose, onSelectAlbum, playingId, onPlayToggle }) {
    const [related, setRelated] = useState([]);

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

    if (!album) return null;

    const isPlaying = playingId === album.id;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            {/* stopPropagation so clicking inside the modal doesn't close it, but clicking the 'X' or outside modal does close it */}
            <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose} aria-label="Close">
                    &times;
                </button>

                <div className="modal-cover">
                    {album.coverUrl ? (
                        <img src={album.coverUrl} alt={`${album.title} Cover`} />
                    ) : (
                        <div className="cover-placeholder large">
                            <IconMusic size={56} color="var(--accent-color)" stroke={1.5} />
                        </div>
                    )}
                </div>

                <div className="modal-body">
                    <h2 className="modal-title-row">
                        <h2 className="modal-title">{album.title}</h2>
                        {album.previewUrl && (
                            <button
                                className="modal-play-btn"
                                onClick={(e) => onPlayToggle(e, album)}
                                aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
                            >
                                {isPlaying ? <IconPlayerPause size={18} stroke={2} /> : <IconPlayerPlay size={18} stroke={2} />}
                                {isPlaying ? 'Pause' : 'Play preview'}
                            </button>
                        )}
                    </h2>
                    <p className="modal-subtitle">
                        {album.artist} • {album.genre || 'Unknown genre'} • {album.year || 'N/A'}
                    </p>

                    <dl className="modal-details">
                        <dt>Record Label</dt>
                        <dd>{album.label || 'Unknown'}</dd>

                        <dt>Producer(s)</dt>
                        <dd>{album.producer || 'Unknown'}</dd>
                    </dl>

                    <h3 className="modal-section-title">Background & Historical Context</h3>
                    <p className="modal-background">
                        {album.backgroundInfo || 'No background info was documented for this entry.'}
                    </p>

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
            </div>
        </div>
    );
}

export default AlbumDetailModal;