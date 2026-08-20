import React, { useEffect } from "react";

function Toast({ message, type = 'success', onDone }) {
    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(onDone, 2500);
        return () => clearTimeout(timer);
    }, [message, onDone]);

    if (!message) return null;

    return <div className={`toast toast-${type}`}>{message}</div>;
}

export default Toast;