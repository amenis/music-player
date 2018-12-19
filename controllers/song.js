'use strict'

const fs = require('fs');
const path = require('path');
const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');
const mongoosePaginate = require('mongoose-pagination');


const getSong = (req, res) => {
    const songId = req.params.id;
    Song.findById(songId).populate({path: 'album'}).exec((err,song)=>{
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        } else {
            if(!song){
                res.status(404).send({message: 'La cancion no existe'});
            } else{
                res.status(200).send({song})
            }
        }
    });
}

const getAllSongs = (req, res) => {
    const albumId = req.params.id;
    if(!albumId) {
        var find = Song.find({}).sort('number');
    } else {
        var find = Song.find({album: albumId}).sort('number');
    }
    find.populate({
        path: 'album',
        populate:  {
            path: 'artist',
            model: 'Artist'
        }
    }).exec((err, songs) => {
        if(err) {
            res.status(500).send({message:'Error en la peticion'});
        } else {
            if(!songs) {
                res.status(404).send({message:'No se han encontrado canciones'});
            } else {
                res.status(200).send({songs});
            }
        }
    });
}

const saveSong = (req,res) => {
   const song = new Song();
   const params = req.body;
   song.number = params.number;
   song.name = params.name;
   song.duration = params.duration;
   song.file = null;
   song.album = params.album;

   song.save((err,saveSong)=>{
       if(err) {
            res.status(500).send({message: 'Error en el servidor'});
       } else {
        if(!saveSong) {
            res.status(404).send({message: 'No se ha encontrado la cancion'});
        } else {
            res.status(200).send({song: saveSong});
        }
       }
   });
}

const updateSong = (req, res) => {
    const SongId = req.params.id;
    const update = req.body;
    Song.findByIdAndUpdate(SongId, update, (err, updateSong) => {
        if(err) {
            res.status(500).send({message: 'Error en la peticion'});
        } else {
            if(!updateSong) {
                res.status(404).send({message: 'No se ha podido actualizar la cancion'});
            } else {
                res.status(200).send({song: updateSong});
            }
        }
    });
}

const deleteSong  = (req, res) =>{
    const songId = req.params.id;
    Song.findByIdAndRemove(songId, (err, songRemoved) => {
        if(err) {
            res.status(500).send({message: 'Error en la peticion'});
        } else {
            if(!songRemoved) {
                res.status(404).send({message: 'No se ha podido eliminar la cancion'});
            } else {
                res.status(200).send({song: songRemoved});
            }
        }
    } );
}

const uploadSong = (req, res) => {
    const songId = req.params.id;
    const file_name = 'No subido';

    if (req.files) {
        const file_path = req.files.file.path;
        const fileSplit = file_path.split('\\');
        const fileName = fileSplit[2];
        const ext = fileName.split('\.');
        const file_ext = ext[1];
        
        if( file_ext == 'mp3' || file_ext == 'ogg' ) {
            Song.findByIdAndUpdate(songId, {file: fileName}, (err,songUpdated)=> {
                if( !songUpdated ) {
                        res.status(404).send({message:'No se ha podido actualizar la cancion'});
                    } else {
                        res.status(200).send({album: songUpdated});
                }            
            });
        } else {
            res.status(200).send({message: 'El archivo no tiene un formato valido'});
        }


    } else {
        res.status(200).send({message: 'No se ha subido ninguna imagen'});
    }
}

const getSongFile = (req, res) => {
    const songFile = req.params.songFile;
    const filePath = `./upload/songs/${songFile}`;
    fs.exists(filePath, (exists) => {
        if(exists) {
            res.sendFile(path.resolve(filePath));
        } else {
            res.status(404).send({message:'No existe el fichero de audio'});
        }
    });
}
module.exports = {
    getSong,
    saveSong,
    getAllSongs,
    updateSong,
    deleteSong,
    uploadSong,
    getSongFile
}