'use strict'

const express = require('express');
const SongController = require('../controllers/song');
const api = express.Router();
const multipart = require('connect-multiparty'); 
const md_upload = multipart({ uploadDir: './upload/songs' });
const md_auth = require('../middlewares/authenticated');


api.get('/song/:id',md_auth.ensureAuth, SongController.getSong);
api.post('/saveSong',md_auth.ensureAuth,SongController.saveSong);
api.get('/getAllSong/:album?',md_auth.ensureAuth, SongController.getAllSongs);
api.put('/song/:id',md_auth.ensureAuth,SongController.updateSong);
api.delete('/song/:id',md_auth.ensureAuth,SongController.deleteSong);
api.post('/uploadFileSong/:id',[md_auth.ensureAuth, md_upload],SongController.uploadSong);
api.get('/getSongFile/:songFile',md_auth.ensureAuth, SongController.getSongFile);

module.exports = api;