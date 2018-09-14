var jwt = require('jsonwebtoken')

var SECRET = require('../config/config').SECRET;
// var Usuario = require('../models/usuario');
var Evaluacion = require('../models/evaluacion')
var Heuristica = require('../models/heuristica')



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
        req.usuario = decoded.usuario;
        req.role = decoded.usuario.role;
        next();
    });
}

exports.buscarevaluacion = function (req, res, next) {

    var id = req.params.idEvaluacion;

    Evaluacion.findById(id, (err, evaluacion) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar la evaluacion",
                errors: err
            });
        }
        if (!evaluacion) {
            return res.status(500).json({
                ok: false,
                mensaje: "El id de la evaluacion es incorrecto comuniquese con el ADMIN",
                errors: { message: 'El ID que esta en la URL no existe en la BD' }
            });
        }
        req.evaluacion = evaluacion
        next();
    });

}

exports.asignarIndice = function (req, res, next) {
    var indice = 'H';
    Heuristica.count({}, (err, total) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: "No se pudo contar las heuristicas",
                errors: err
            });
        }
        var y = parseInt(total) + 1;
        indice = indice + y;
        req.indice = indice;
        // console.log(indice); 
        next();
    });
}

