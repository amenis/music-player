'use strict'

const fs = require('fs');
const path = require('path');
const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');
const mongoosePaginate = require('mongoose-pagination');

const getArtist = (req, res) => {
  const artistId = req.params.id;
    Artist.findById(artistId,(err,artist)=>{
        if(err) {
            res.status(500).send({message:'Error en la peticion'});
        } else {
            if(!artist){
                res.status(404).send({message:'El artista no existe'});
            } else {
                res.status(200).send({artist});
            }
        }
    });
}

const getAllArtist = (req, res) => {
    const page = req.params.page ?  req.params.page : 1;
    const itemsPerPage = 3;
    Artist.find().sort('name').paginate(page,itemsPerPage,(err, artist, total)=>{
        if(err) {
            res.status(500).send({message: 'Error en la peticion'});
        } else {
            if(!artist) {
                res.status(404).send({message: 'No hay artistas'});
            } else {
                return res.status(200).send({
                    total_items: total,
                    artist: artist
                });
            }
        }
    });
}

const saveArtist = (req, res) => {
    const artist = new Artist();
    const params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err,artistStored)=>{
        if(err) {
            res.status(500).send({message: 'Error al guardar el artista'});
        } else {
            if(!artistStored) {
                res.status(404).send({message: 'El artista no ha sido guardado'});
            } else {
                res.status(200).send({artistStored});
            }
        }
    });
}

const updateArtist = (req, res) => {
    const artistId = req.params.id;
    const update = req.body;
    Artist.findByIdAndUpdate(artistId, update ,(err, arstistUpdated)=> {
        if(err) {
            res.status(500).send({message: 'Error al guardar el artista'});
        } else {
            if(!arstistUpdated) {
                res.status(404).send({message: 'El artista no ha sido actualizado'});
            } else {
                res.status(200).send({artist: arstistUpdated});
            }
        }
    });
}

const deleteArtist = (req, res) => {
    const artistId = req.params.id;
    Artist.findByIdAndDelete(artistId,(err,artistRemoved) =>{
        if(err) {
            res.status(500).send({message: 'Error al eliminar al artista'});
        } else {
            if(!artistRemoved) {
                res.status(404).send({message: 'El artista no ha sido eliminado'});
            } else {                
                
                Album.find({artist: artistRemoved._id}).deleteMany((err, albumRemoved)=>{
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
                                        res.status(200).send({artist: artistRemoved});
                                    }
                                }
                            });
                        }
                    }
                });
            }
            
        }
    });
}

const uploadImage = (req, res) => {
    const artistId = req.params.id;
    const file_name = 'No subido';

    if (req.files) {
        const file_path = req.files.image.path;
        const fileSplit = file_path.split('\\');
        const fileName = fileSplit[2];
        const ext = fileName.split('\.');
        const file_ext = ext[1];
        
        if( file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            Artist.findByIdAndUpdate(artistId, {image: fileName}, (err,artistUpdate)=> {
                if( !artistUpdate ) {
                        res.status(404).send({message:'No se ha podido actualizar el usuario'});
                    } else {
                        res.status(200).send({artist: artistUpdate});
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
    const filePath = `./upload/artist/${imageFile}`;
    fs.exists(filePath, (exists) => {
        if(exists) {
            res.sendFile(path.resolve(filePath));
        } else {
            res.status(404).send({message:'No existe la imagen'});
        }
    });
}

module.exports = {
    getArtist,
    saveArtist,
    getAllArtist,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
};