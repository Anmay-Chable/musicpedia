// Looks up album cover art via Apple's free iTunes Search API.
async function fetchAlbumMedia(title, artist, entryType = 'auto') {
    const empty = { coverUrl: '', previewUrl: '', collectionId: null };

    try {
        const term = encodeURIComponent(`${artist} ${title}`);
        const match = await searchITunes(term, 'song');
        if (!match) return empty;

        const coverUrl = match.artworkUrl100 ? match.artworkUrl100.replace('100x100bb', '600x600bb') : '';

        if (entryType === 'song') {
            return { coverUrl, previewUrl: match.previewUrl || '', collectionId: null };
        }

        if (!match.collectionId) {
            return { coverUrl, previewUrl: match.previewUrl || '', collectionId: null };
        }

        if (entryType === 'album') {
            return { coverUrl, previewUrl: '', collectionId: match.collectionId };
        }

        const collection = await lookupCollection(match.collectionId);

        if (collection && collection.trackCount > 1) {
            const requestedTitle = title.toLowerCase();
            const collectionName = collection.collectionName.toLowerCase();

            if (collectionName.includes(requestedTitle) || requestedTitle.includes(collectionName)) {
                return { coverUrl, previewUrl: '', collectionId: match.collectionId };
            }
        }

        return { coverUrl, previewUrl: match.previewUrl || '', collectionId: null };
    }
    catch (err) {
        console.error('Album media lookup failed:', err.message);
        return empty;
    }
}

async function fetchTracklist(collectionId) {
    try {
        const res = await fetch(`https://itunes.apple.com/lookup?id=${collectionId}&entity=song`);
        if (!res.ok) return [];

        const data = await res.json();
        return (data.results || [])
            .filter((r) => r.wrapperType === 'track')
            .sort((a, b) => (a.trackNumber || 0) - (b.trackNumber || 0))
            .map((t) => ({ trackNumber: t.trackNumber, trackName: t.trackName }));
    }
    catch (err) {
        console.error('Tracklist lookup failed:', err.message);
        return [];
    }
}

async function searchITunes(term, entity) {
    const res = await fetch(`https://itunes.apple.com/search?term=${term}&entity=${entity}&limit=1`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.results?.[0] || null;
}

async function lookupCollection(collectionId) {
    const res = await fetch(`https://itunes.apple.com/lookup?id=${collectionId}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.results?.find((r) => r.wrapperType === 'collection') || null;
}

module.exports = { fetchAlbumMedia, fetchTracklist };