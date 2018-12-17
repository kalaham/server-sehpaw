var express = require('express')
var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')

var SECRET = require('../config/config').SECRET;
var app = express();
var Usuario = require('../models/usuario');

//=========================================
//Logearse
//=========================================

app.post("/", (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioEnBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar usuario",
                errors: err
            });
        }
        if (!usuarioEnBD) {
            return res.status(400).json({
                ok: false,
                mensaje: "Credenciales incorrectas -email"
                //errors: err
            });
        }
        if (body.password===undefined) {
            return res.status( 200 ).json({
                ok: false,
                mensaje:"Nose esta enviando el argumento password",
                // errors:err
            });
        }
        if (!bcrypt.compareSync(body.password, usuarioEnBD.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: " Credenciales incorrectas -password",
                //errors: err
            });
        }

        // Crear Token
        usuarioEnBD.password = ':)';
        var token = jwt.sign({usuario:usuarioEnBD}, SECRET /**, {expiresIn: false} */);


        res.status(200).json({
            ok: true,
            usuario: usuarioEnBD,
            id: usuarioEnBD._id,
            token:token
        });
    });
});




module.exports = app;