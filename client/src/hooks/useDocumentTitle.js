import { useEffect } from "react";

// Sets the browser tab title while a page is mounted, and restores
// whatever it was before when that page unmounts.
export default function useDocumentTitle(title) {
    useEffect(() => {
        const previousTitle = document.title;
        document.title = title ? `${title} | Musicpedia` : 'Musicpedia';

        return () => {
            document.title = previousTitle;
        };
    }, [title]);
}