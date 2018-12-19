'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secret =  'clave_secreta_curso';

exports.ensureAuth = (req, res, next) => {
    if(!req.headers.authorization) {
        return res.status(404).send({ message: 'La peticion no tiene la cabezera de autenticacion' });
    } 
    const token = req.headers.authorization.replace( /['"]+/g,'' );
    const payload = jwt.decode(token, secret);
    try {        
        if( payload.exp <= moment().unix() ) {
            return res.status(404).send({message: 'Token expirado'});
        }
    } catch (error) {
        console.log(error);
        return res.status(404).send({message: 'Token no valido'});
    }
    req.user = payload;
    next();
}