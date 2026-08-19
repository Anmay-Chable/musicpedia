import React, { useEffect } from "react";
import { IconMusic } from "@tabler/icons-react";

function AlbumDetailModal({ album, onClose }) {
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

    if (!album) return null;

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
                        <div className="cover-placeholder larger">
                            <IconMusic size={56} color="var(--accent-color)" stroke={1.5} />
                        </div>
                    )}
                </div>

                <div className="modal-body">
                    <h2 className="modal-title">{album.title}</h2>
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
                </div>
            </div>
        </div>
    )
}

export default AlbumDetailModal;