var express = require('express')
var Principio = require('../models/principio')
var mdAutenticacion = require('../middlewares/autenticacion')

var app = express();

//=========================================
//Extraer todos los principios 
//=========================================
app.get('/', mdAutenticacion.verificarToken, (req, res, next) => {

    Principio.find({})
    .populate('heuristicas')
    .exec((err, principios) => {
        if (err) {
            return res.status(500).json({
                ok: faslse,
                mensaje: "Error al buscar servicios",
                errors: err
            });
        }
        if (!principios) {
            return res.status(400).json({
                ok: false,
                mensaje: "No hay principios",
                errors: { message: 'No se encontro principios' }
            });
        }
        res.status(200).json({
            ok: true,
            principios
        });
    });
});


//=========================================
//crear principios
//=========================================
app.post('/', (req, res, next) => {

    body = req.body;
    var principio = new Principio({
        principio: body.principio,
        heuristicas: []
    });

    principio.save((err, prinSaved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: "Error al crear principio",
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: "principio creado",
            prinSaved
        });
    })
});

module.exports = app;