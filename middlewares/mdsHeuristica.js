var Heuristica = require('../models/heuristica')
var Principio = require('../models/principio')

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
    Principio.findOne({ principio: req.params.principio }, (err, principioBD) => {
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


exports.guardarHeuristicas= function(req, res, next){

    var body = req.body;
    var heuristica = new Heuristica({
        indice: req.indice,
        heuristica: body.heuristica,
        pregunta: body.pregunta,
        nivelConformidad: body.nivelConformidad,
        ejemplo: body.ejemplo,
        referencia: body.referencia,
        autor: req.usuario._id
    });
    // var x = Principio.heuristicas;
    heuristica.save((err, heuSaved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: "Error al guardar",
                errors: err
            });
        }
        req.h = heuSaved;
        next();
    });

}
//=========================================
//no funciona eliminar 
//=========================================

exports.borrarHeurisPrin= function(req, res, next){
    var id = req.params.id;
    var prin = req.params.principio;
    Principio.update({principio:prin},{ $pull: {heuristicas:{id} } },(err, prinupdate) => {
        if (err) {
            return res.status( 500 ).json({
                ok: false,
                mensaje:"Error al buscar principio ** ",
                errors:err
            });
        }
        if (!prinupdate) {
            return res.status( 400 ).json({
                ok: false,
                mensaje:"El principio  no se encuentra en la BD",
                errors:{menssage: "No se encontro el principio en la BD "}
            });
        }
        next();
    });
}