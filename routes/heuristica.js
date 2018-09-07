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

app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Heuristica.findById(id, (err, heuristica) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al actualizar la HEURISTICA",
                errors: err
            });
        }
        if (!heuristica) {
            return res.status(400).json({
                ok: false,
                mensaje: "No existe una heuristica con este ID: " + id,
                errors: { message: 'No se encontro el ID' }
            });
        }

        heuristica.heuristica = body.heuristica;
        heuristica.pregunta = body.pregunta;
        heuristica.nivelConformidad = body.nivelConformidad;
        heuristica.ejemplo = body.ejemplo;
        heuristica.referencia = body.referencia;

        heuristica.save((err, heuActualizada) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error al guardar actualizacion",
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                mensaje: "Actulizado correctamente",
                heuristica: heuActualizada
            });
        });
    });
});

//=========================================
//Crear heuristicas
//=========================================

app.post('/',mdAutenticacion.verificarToken, (req, res) => {

    var body = req.body;    

    var heuristica = new Heuristica({
        indice: body.indice,
        heuristica: body.heuristica,
        pregunta: body.pregunta,
        nivelConformidad: body.nivelConformidad,
        ejemplo: body.ejemplo,
        referencia: body.referencia,
        autor:req.usuario._id
    });
    
    heuristica.save((err, heuGuardada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: "Error al crear heuristica",
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: "Heuristica creada exitisamente",
            heuristica: heuGuardada
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