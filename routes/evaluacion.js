var express = require('express')

var app = express();
var Evaluacion = require('../models/evaluacion')
var mdAutenticacion = require('../middlewares/autenticacion');

//=========================================
//Mostrar Evaluaciones
//=========================================

app.get('/', (req, res, next) => {

    Evaluacion.find({}, (err, evaluaciones) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: " error al cargar evaluacion BD",
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: "las Evaluaciones en BD",
            evaluaciones: evaluaciones
        });
    });
});

//=========================================
//crear evaluacion
//=========================================

app.post('/',   (req, res) => {

    body = req.body;

    var evaluacion = new Evaluacion({
        coordinador: body.coordinador,
        fecha: body.fecha,
        nombreSitio: body.nombreSitio,
        urlSitio: body.urlSitio,
        heuristicas: body.heuristicas,
        evaluadores: body.evaluadores,
    });

    evaluacion.save((err, evaluGuardada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: "Error al crear evaluacion",
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: "La evaluacion se guardo exitosamente",
            evaluacion: evaluGuardada
        });
    });
});

//=========================================
//Eliminar evaluacion
//=========================================

app.delete('/:id',  (req, res ) => {

    var id= req.params.id;

    Evaluacion.findByIdAndRemove(id,  (err, evaBorrada ) => { 
        if (err) {
            return res.status( 500 ).json({
                ok: false,
                mensaje:"Error al borrar Evaluacion",
                errors:err
            });
        }
        if (!evaBorrada) {
            return res.status( 400 ).json({
                ok: false,
                mensaje:"El ID nocoincide con ninguna evaluacion",
                errors:err
            });
        }
        res.status( 200 ).json({
            ok: true,
            evaluacion: evaBorrada            
        });
     });



  });

module.exports = app;