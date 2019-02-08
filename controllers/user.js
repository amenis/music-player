'use strict'

const User = require('../models/user');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const fs = require('fs');
const path = require('path');

const pruebas = (req, res) => {
    res.status(200).send({
        message: ' testing action controller of api rest and mongodb'
    });
};

const saveUser  = (req,res) =>{
    const user = new User();
    let params = req.body;
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_ADMIN';
    user.image = 'null';
    
    console.log(params);

    if( params.password ) {
        // encript password and save data
        bcrypt.hash(params.password,null,null, (err,hash)=>{
            user.password = hash;
            if ( user.name != null && user.surname != null && user.email != null) {
                //save user
                user.save((err, userStore) => {
                    if(err) {
                        res.status(500).send({ message: "Error al guardar el usuario" });
                    } else {
                        if(!userStore) {
                            res.status(404).send({ message: 'No se ha podido registrar el usuario' });
                        } else {
                            res.status(200).send({ user: userStore });
                        }
                    }
                });
            } else {
                res.status(200).send({message: 'Faltan datos por rellenar'});
            }
        });
    } else {
        res.status(500).send({message: 'Introduce la contraseña'});
    }

}

const loginUser = (req, res) => {
    
    const params = req.body;
    const email = params.email;
    const password = params.password;

    User.findOne({ email: email.toLowerCase() }, (err, user)=> {
        if(err) {
            res.status(500).send({message: 'Error en la peticion' });
        } else {
            if(!user) {
                res.status(404).send({message: 'El usuario no existe' });
            } else {
                // check the password
                bcrypt.compare(password, user.password, (err, check) => {
                    if(check){
                        if(params.gethash) {
                            //return a token of jwt
                            res.status(200).send({ token: jwt.createToken(user) });
                        } else {
                            res.status(200).send({user})
                        }
                    } else {
                        res.status(404).send({ message: 'El usuario no ha podido loguearse' });
                    }
                } );
            }
        }
    } );

}

const updateUser = (req, res) => {
    const userId = req.params.id;
    const update = req.body;
    User.findByIdAndUpdate(userId, update, (err, userUpdate) => {
        if( err ) {
            res.status(504).send({message:'Error al actualizar los datos de usuario'});
        } else {
            if( !updateUser ) {
                res.status(404).send({message:'No se ha podido actualizar el usuario'});
            } else {
                res.status(200).send({user: userUpdate});
            }
        }
    });
}

const uploadImage = (req, res) => {
    const userId = req.params.id;
    const file_name = 'Sin imagen';

    if (req.files) {
        const file_path = req.files.image.path;
        const fileSplit = file_path.split('\\');
        const fileName = fileSplit[2];
        const ext = fileName.split('\.');
        const file_ext = ext[1];
        
        if( file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            User.findByIdAndUpdate(userId, {image: fileName}, (err,userUpdate)=> {
                if( !updateUser ) {
                        res.status(404).send({message:'No se ha podido actualizar el usuario'});
                    } else {
                        res.status(200).send({image: fileName, user: userUpdate});
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
    const filePath = `./upload/users/${imageFile}`;
    fs.exists(filePath, (exists) => {
        if(exists) {
            res.sendFile(path.resolve(filePath));
        } else {
            res.status(404).send({message:'No existe la imagen'});
        }
    });
}


module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
  
};