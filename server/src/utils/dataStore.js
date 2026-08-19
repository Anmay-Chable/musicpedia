const fs = require('fs/promises');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'albums.json');

async function readAlbums() {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
}

async function writeAlbums(albums) {
    await fs.writeFile(DATA_FILE, JSON.stringify(albums, null, 2), 'utf-8');
}

module.exports = { readAlbums, writeAlbums };