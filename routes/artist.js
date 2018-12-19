'use strict'

const express = require('express');
const ArtistController = require('../controllers/artist');
const api = express.Router();
const multipart = require('connect-multiparty'); 
const md_upload = multipart({ uploadDir: './upload/artist' });
const md_auth = require('../middlewares/authenticated');

api.get('/artist/:id',md_auth.ensureAuth,ArtistController.getArtist);
api.get('/showArtist/:page?',md_auth.ensureAuth,ArtistController.getAllArtist);
api.post('/artist',md_auth.ensureAuth,ArtistController.saveArtist);
api.put('/artist/:id',md_auth.ensureAuth,ArtistController.updateArtist);
api.delete('/artist/:id',md_auth.ensureAuth,ArtistController.deleteArtist);
api.post('/uploadImageArtist/:id',[md_auth.ensureAuth, md_upload],ArtistController.uploadImage);
api.get('/getArtistImage/:imageFile',ArtistController.getImageFile);

module.exports = api;