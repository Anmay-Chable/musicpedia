import React from "react";

function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', danger = false, onConfirm, onCancel }) {
    if (!open) return null;

    return (
        <div className="modal-backdrop" onClick={onCancel}>
            <div className="confirm-dialog glass-panel" onClick={(e) => e.stopPropagation()}>
                <h3 className="confirm-title">{title}</h3>
                <p className="confirm-message">{message}</p>
                <div className="confirm-actions">
                    <button className="confirm-cancel" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className={danger ? 'confirm-confirm danger' : 'confirm-confirm'} onClick={onConfirm}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;