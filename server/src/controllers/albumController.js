const crypto = require('crypto');
const { readAlbums, writeAlbums } = require('../utils/dataStore');
const { fetchAlbumMedia } =  require('../utils/coverArt');

// GET /api/albums
// Supports ?genre=Rock (Browse page filter pills) and ?search=query (Home page search bar)
exports.getAlbums = async (req, res) => {
    try {
        const { genre, search } = req.query;
        let albums = await readAlbums();

        if (genre && genre.toLowerCase() !== 'all') {
            albums = albums.filter((a) =>  a.genre?.toLowerCase() === genre.toLowerCase());
        }
        if (search) {
            const q = search.toLowerCase();
            albums = albums.filter(
                (a) => a.title.toLowerCase().includes(q) || a.artist.toLowerCase().includes(q)
            );
        }

        albums.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json(albums);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch albums', error: err.message})
    }
};

// GET /api/albums/:id
// Powers the Entry Details page
exports.getAlbumById = async (req, res) => {
    try {
        const albums = await readAlbums();
        const album = albums.find((a) => a.id === req.params.id);

        if (!album) {
            return res.status(404).json({ message: 'Album not found' });
        }
        res.json(album);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch album', error: err.message });
    }
};

// POST /api/albums
// Handles the Publish Entry button on the Add New Album form
exports.createAlbum = async (req, res) => {
    try {
        const { title, artist, genre, year, label, producer, backgroundInfo } = req.body;

        if (!title || !artist) {
            return res.status(400).json({ message: 'Album title and primary artist are required' });
        }

        const albums = await readAlbums();
        const { coverUrl, previewUrl } = await fetchAlbumMedia(title, artist);

        const newAlbum = {
            id: crypto.randomUUID(),
            title,
            artist,
            genre: genre || '',
            year: year ? Number(year) : null,
            label: label || '',
            producer: producer || '',
            backgroundInfo: backgroundInfo || '',
            coverUrl: coverUrl || '',
            previewUrl: previewUrl || '',
            createdAt: new Date().toISOString(),
        };

        albums.push(newAlbum);
        await writeAlbums(albums);

        res.status(201).json(newAlbum);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to create album', error:err.message });
    }
};

// PUT /api/albums/:id
exports.updateAlbum = async (req, res) => {
    try {
        const albums = await readAlbums();
        const index = albums.findIndex((a) => a.id === req.params.id);

        if (index === -1) {
            return res.status(404).json({ message: 'Album not found' });
        }

        const original = albums[index];
        const updated = { ...original, ...req.body, id: original.id };

        const titleChanged = updated.title !== original.title;
        const artistChanged = updated.artist !== original.artist;

        // Refresh the cover/preview if either is missing, or if the title/artist
        // changed enough that the old media may no longer match
        if (!updated.coverUrl || !updated.previewUrl || titleChanged || artistChanged) {
            const { coverUrl, previewUrl } = await fetchAlbumMedia(updated.title, updated.artist);
            updated.coverUrl = coverUrl || updated.coverUrl || '';
            updated.previewUrl = previewUrl || updated.previewUrl || '';
        }

        albums[index] = updated;
        await writeAlbums(albums);

        res.json(albums[index]);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to update album', error: err.message });
    }
};

// DELETE /api/albums/:id
exports.deleteAlbum = async (req, res) => {
    try {
        const albums = await readAlbums();
        const index = albums.findIndex((a) => a.id === req.params.id);

        if (index === -1) {
            return res.status(404).json({ message: 'Album not found' });
        }

        const [deleted] = albums.splice(index, 1);
        await writeAlbums(albums);

        res.json({ message: 'Album deleted', album: deleted });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to delete album', error: err.message });
    }
};