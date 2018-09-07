var jwt = require('jsonwebtoken')

var SECRET = require('../config/config').SECRET;
var Usuario = require('../models/usuario');


//=========================================
//Midelawre: verificar Token
//=========================================

exports.verificarToken = function (req, res, next) {
    var token = req.query.token;
    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: " Token incorrecto",
                errors: err
            });
        }

        req.usuario = decoded.usuario._id;
        req.role = decoded.usuario.role;
        next();
    });
}

