var express = require('express')

var app = express();
var Heuristica = require('../models/heuristica')
var mdAutenticacion = require('../middlewares/autenticacion')

//=========================================
//Mostar todas las heuristicas que hay
//=========================================

app.get('/', (req, res, next) => {

    Heuristica.find({}, (err, heuristicas) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "error al cargar heuristicas",
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: "peticion realizada correctamente- HEURISTICAS",
            heuristicas: heuristicas
        });
    });
});
//=========================================
//ACTUALIZAR HEURISTICA
//=========================================

app.put('/:principio/:id', mdAutenticacion.findInArray, (req, res) => {
    var heuristica = req.heuristica
    var body = req.body
    var prin = req.params.principio;
    var id = req.params.id;

    heuristica.ejemplo = body.ejemplo
    heuristica.heuristica = body.heuristica
    heuristica.nivelConformidad = body.nivelConformidad
    heuristica.pregunta = body.pregunta
    heuristica.referencia = body.referencia

    Heuristica.findOneAndUpdate({ 'principio': prin, 'heuristicas._id': id },
        { $set: { 'heuristicas.ejemplo': body.ejemplo } },
        (err, prinBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error al buscar principio",
                    errors: err
                });
            }
            if (!prinBD) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error al buacar el principio " + prin + " en la BD",
                    errors: { message: "el principio " + prin + " no se encuentra en la BD" }
                });
            }
            if (prinBD.length == 0) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "el ID:" + id + " no se encuentra en este principio",
                    errors: { message: "En el principio: " + prin + " no hay ninguna heuristica con el ID: " + id }
                });
            }
            res.status(200).json({
                ok: true,
                mensaje: "peticion realizada correctamente",
                prinBD
            });
        })



});

//=========================================
//Crear heuristicas: Se adiciona al arreglo de cada principio
//=========================================

app.post('/:principio', mdAutenticacion.verificarToken, mdAutenticacion.asignarIndice, (req, res) => {

    var body = req.body;
    var principio = req.params.principio;
    var heuristica = {
        indice: req.indice,
        heuristica: body.heuristica,
        pregunta: body.pregunta,
        nivelConformidad: body.nivelConformidad,
        ejemplo: body.ejemplo,
        referencia: body.referencia,
        autor: req.usuario._id
    }

    Heuristica.findOneAndUpdate({ principio: principio }, { $push: { heuristicas: heuristica } }, (err, heuristicaguardada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al guardadr heuristica",
                errors: err
            });
        }
        if (!heuristicaguardada) {
            return res.status(400).json({
                ok: false,
                mensaje: "El principio no esta en la BD",
                errors: { message: "El principio " + principio + "no esta en la BD " }
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: "Heuristica guardada EXITOSAMENTE",
            hay: heuristicaguardada,
            guardada: heuristica
        });
    });
});


//=========================================
//Borrar Heuristcia
//=========================================

app.delete('/:id', (req, res) => {
    var id = req.params.id;

    Heuristica.findByIdAndRemove(id, (err, heuBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al borrar heuristica",
                errors: err
            });
        }
        if (!heuBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: "El ID no existe",
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: 'la heuristica se borro exitosamente',
            heuristica: heuBorrada
        });
    })
})

module.exports = app;