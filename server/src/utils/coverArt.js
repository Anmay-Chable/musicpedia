// Looks up album cover art via Apple's free iTunes Search API.
async function fetchCoverArt(title, artist) {
    try {
        const term = encodeURIComponent(`${artist} ${title}`);
        const url = `https://itunes.apple.com/search?term=${term}&entity=album&limit=1`;

        const res = await fetch(url);
        if (!res.ok) return null;

        const data = await res.json();
        const artwork = data.results?.[0]?.artworkUrl100;
        if (!artwork) return null;

        // iTunes returns a small 100x100 thumbnail by default..
        // Swapping the size in the URL gets a much larger version for free.
        return artwork.replace('100x100bb', '600x600bb');
    }
    catch (err) {
        console.error('Cover art lookup failed: ', err.message);
        return null;
    }
}

module.exports = { fetchCoverArt };