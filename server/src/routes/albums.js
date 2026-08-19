const express = require('express');
const router = express.Router();
const {
    getAlbums,
    getAlbumById,
    createAlbum,
    updateAlbum,
    deleteAlbum,
} = require('../controllers/albumController');

router.get('/', getAlbums);
router.get('/:id', getAlbumById);
router.post('/', createAlbum);
router.put('/:id', updateAlbum);
router.delete('/:id', deleteAlbum);

module.exports = router;