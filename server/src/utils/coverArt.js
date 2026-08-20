// Looks up album cover art via Apple's free iTunes Search API.
async function fetchAlbumMedia(title, artist) {
    const empty = { coverUrl: '', previewUrl: '' };

    try {
        const term = encodeURIComponent(`${artist} ${title}`);

        // Find the album/collection
        const albumMatch = await lookupTracks(term, 'album');
        if (albumMatch) {
            const coverUrl = albumMatch.artworkUrl100 ? albumMatch.artworkUrl100.replace('100x100bb', '600x600bb') : '';

            // Pull tracklist for that collection in order
            const tracks = await lookupTracks(albumMatch.collectionId);
            const firstTrack = tracks
                .filter((t) => t.wrapperType === 'track' && t.previewUrl)
                .sort((a, b) => (a.trackNumber || 0) - (b.trackNumber || 0))[0];

            if (firstTrack) {
                return { coverUrl, previewUrl: firstTrack?.previewUrl || '' };
            }

            if (coverUrl) return { coverUrl, previewUrl: '' };
        }

        const songMatch = await searchITunes(term, 'song');
        if (songMatch) {
            const coverUrl = songMatch.artworkUrl100 ? songMatch.artworkUrl100.replace('100x100bb', '600x600bb') : '';
            return { coverUrl, previewUrl: songMatch.previewUrl || '' };
        }

        return empty;
    }
    catch (err) {
        console.error('Album media lookup failed:', err.message);
        return empty;
    }
}

async function searchITunes(term, entity) {
    const res = await fetch(`https://itunes.apple.com/search?term=${term}&entity=${entity}&limit=1`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.results?.[0] || null;
}

async function lookupTracks(collectionId) {
    if (!collectionId) return [];
    const res = await fetch(`https://itunes.apple.com/lookup?id=${collectionId}&entity=song`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
}

module.exports = { fetchAlbumMedia };