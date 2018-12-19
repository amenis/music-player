'use strict'

const express = require('express');
const md_auth = require('../middlewares/authenticated');
const UserController = require('../controllers/user');
const app = express.Router();
const multipart = require('connect-multiparty'); 
const md_upload = multipart({ uploadDir: './upload/users' });

app.get('/probando', md_auth.ensureAuth ,UserController.pruebas);
app.post('/register',UserController.saveUser);
app.post('/login',UserController.loginUser);
app.put('/updateUser/:id',md_auth.ensureAuth,UserController.updateUser);
app.post('/uploadImage/:id',[md_auth.ensureAuth, md_upload],UserController.uploadImage);
app.get('/getUserImage/:imageFile',UserController.getImageFile);

module.exports = app;