'use strict'

const express = require('express');
const AlbumController = require('../controllers/album');
const api = express.Router();
const multipart = require('connect-multiparty'); 
const md_upload = multipart({ uploadDir: './upload/album' });
const md_auth = require('../middlewares/authenticated');

api.get('/getAlbum/:id',md_auth.ensureAuth,AlbumController.getAlbum);
api.post('/saveAlbum',md_auth.ensureAuth,AlbumController.saveAlbum);
api.get('/getAlbums/:artist?',md_auth.ensureAuth,AlbumController.getAllAlbums);
api.put('/album/:id',md_auth.ensureAuth,AlbumController.updateAlbum);
api.delete('/album/:id',md_auth.ensureAuth,AlbumController.deleteAlbum);
api.post('/uploadImagenAlbum/:id',[md_auth.ensureAuth,md_upload],AlbumController.uploadImage);

module.exports = api;