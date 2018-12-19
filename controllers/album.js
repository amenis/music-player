'use strict'

const fs = require('fs');
const path = require('path');
const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');
const mongoosePaginate = require('mongoose-pagination');

const getAlbum = (req, res) => {
    const albumId = req.params.id;
    Album.findById(albumId).populate ( {
        path: 'artist'
    } ).exec( (err, album)=>{
        if(err) {
            res.status(500).send({message: 'Error en la peticion'});
        } else {
            if(!album) {
                res.status(404).send({message: 'No existe el album'});
            } else {
                res.status(200).send({album});
            }
        }
    } );
}

const getAllAlbums = (req, res) => {
    
    const artistId = req.params.artist;
    const page = req.params.page ?  req.params.page : 1;
    const itemsPerPage = 3;

    if(!artistId) {
        var find = Album.find({}).sort('title');
    } else {
        var find = Album.find({artist:artistId}).sort('year');
    }
    find.populate({ 
        path: 'artist'
    }).exec( (err, albums)=> {
        if(err) {
            res.status(500).send({message: 'error en la peticion'});
        } else {
            if(!albums) {
                res.status(404).send({message: 'Album no encontrado' });
            } else {
                res.status(200).send({albums});
            }
        }
    });
}

const saveAlbum = (req, res) => {
    const album = new Album();
    const params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save((err,albumStored)=>{
        if(err) {
            res.status(500).send({message: 'Error al guardar el artista'});
        } else {
            if(!albumStored) {
                res.status(404).send({message: 'El album no ha sido guardado'});
            } else {
                res.status(200).send({album:albumStored});
            }
        }
    });
}

const updateAlbum = (req, res) => {
    const albumId = req.params.id;
    const update = req.body;
    Album.findByIdAndUpdate(albumId, update ,(err, albumUpdate)=> {
        if(err) {
            res.status(500).send({message: 'Error en el servidor'});
        } else {
            if(!albumUpdate) {
                res.status(404).send({message: 'El album no ha sido actualizado'});
            } else {
                res.status(200).send({album: albumUpdate});
            }
        }
    });
}

const deleteAlbum = (req, res) => {
    const albumId = req.params.id;
    Album.findByIdAndDelete(albumId, (err, albumRemoved)=>{
        if(err) {
            res.status(500).send({message: 'Error al eliminar el album del artista'});
        } else {
            if(!albumRemoved) {
                res.status(404).send({message: 'No se ha podido encontrar el album'});
            } else {
                Song.find({album: albumRemoved._id}).deleteMany((err, songRemoved)=>{
                    if(err) {
                        res.status(500).send({message: 'Error al eliminar las canciones del artista'});
                    } else {
                        if(!songRemoved) {
                            res.status(404).send({message: 'No se ha podido encontrar canciones asociadas'});
                        } else {
                            res.status(200).send({album: albumRemoved});
                        }
                    }
                });
            }
        }
    });
            
}

const uploadImage = (req, res) => {
    const albumId = req.params.id;
    const file_name = 'No subido';

    if (req.files) {
        const file_path = req.files.image.path;
        const fileSplit = file_path.split('\\');
        const fileName = fileSplit[2];
        const ext = fileName.split('\.');
        const file_ext = ext[1];
        
        if( file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            Album.findByIdAndUpdate(albumId, {image: fileName}, (err,albumUpdated)=> {
                if( !albumUpdated ) {
                        res.status(404).send({message:'No se ha podido actualizar la imagen'});
                    } else {
                        res.status(200).send({album: albumUpdated});
                }            
            });
        } else {
            res.status(200).send({message: 'El archivo no tiene un formato valido'});
        }


    } else {
        res.status(200).send({message: 'No se ha subido ninguna imagen'});
    }
}

const getImageFile = (req, res) => {
    const imageFile = req.params.imageFile;
    const filePath = `./upload/album/${imageFile}`;
    fs.exists(filePath, (exists) => {
        if(exists) {
            res.sendFile(path.resolve(filePath));
        } else {
            res.status(404).send({message:'No existe la imagen'});
        }
    });
}

module.exports = {
    getAlbum,
    saveAlbum,
    getAllAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
};