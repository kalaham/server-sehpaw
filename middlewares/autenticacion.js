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
    var indice = '';
    switch (req.params.principio) {
        case 'perceptible':
            indice = 'P'
            break;
        case 'operable':
            indice = 'O'
            break;
        case 'comprencible':
            indice = 'C'
            break;
        case 'robusto':
            indice = 'R'
            break;
    }
    Heuristica.findOne({ principio: req.params.principio }, (err, principioBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "No se pudo contar las heuristicas",
                errors: err
            });
        }
        if (!principioBD) {
            return res.status(400).json({
                ok: false,
                mensaje: "no se encontro el principio ",
                errors: err
            });
        }
        var total = principioBD.heuristicas.length
        var y = parseInt(total) + 1;
        indice = indice + y;
        req.indice = indice;
        next();
    });
}

exports.findInArray = function(req, res, next){
    var prin =  req.params.principio
    
    Heuristica.findOne({principio:prin},  (err, principio ) => { 
        if (err) {
            return res.status( 500 ).json({
                ok: false,
                mensaje:"Error al buscar principio " + prin,
                errors:err
            });
        }
        if (!principio) {
            return res.status( 400 ).json({
                ok: false,
                mensaje:"El principio "+prin+" no se encuentra en la BD",
                errors:{menssage: "No se encontro el principio en la BD "}
            });
        }
        const heuristicas = principio.heuristicas         
        for (let i = 0; i < heuristicas.length; i++) {
            let heuristica=heuristicas[i];
            let id= heuristica._id
            if (id==req.params.id) {
               req.heuristica = heuristica;
               break;             
            }
        }
        next();
     })

}