var express = require('express')

var app = express();
var Heuristica = require('../models/heuristica')
var Principio = require('../models/principio')
var mdAutenticacion = require('../middlewares/autenticacion')
var mdsHeuristica = require('../middlewares/mdsHeuristica')

//=========================================
//Mostar todas las heuristicas que hay
//=========================================

app.get('/', mdAutenticacion.verificarToken, (req, res, next) => {

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
//Buscar heuristica por ID
//=========================================

app.get('/:id', mdAutenticacion.verificarToken,  (req, res, next ) => { 
    var id = req.params.id;
    Heuristica.findById(id,  (err, heuristica ) => { 
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "error en el servidor - heuristica/id",
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: "peticion realizada correctamente - heuristica/id",
            heuristica
        });
     });
 });

//=========================================
//ACTUALIZAR HEURISTICA
//=========================================

app.put('/:id',mdAutenticacion.verificarToken, mdAutenticacion.validarAdmin, (req, res) => {
    var body = req.body
    var prin = req.params.principio;
    var id = req.params.id;

    console.log('entro.....................');


    Heuristica.findById(id, (err, heuristica) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: " Error al buscar Heuristica",
                errors: err
            });
        }

        if (!heuristica) {
            return res.status(400).json({
                ok: false,
                mensaje: "La heuristica con el id " + id + " no existe",
                errors: { message: "no esxiste una heuristica con este ID" }
            });
        }
        console.log('Lo busco y lo encontro.....');
        
        heuristica.ejemplo = body.ejemplo
        heuristica.heuristica = body.heuristica
        heuristica.nivelConformidad = body.nivelConformidad
        heuristica.pregunta = body.pregunta
        heuristica.referencia = body.referencia

        console.log('Lo actualizo................');
        

        heuristica.save((err, heuGuardada) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar heuristica",
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                mensaje: "Heuristica actualizada",
                heuGuardada
            });
        });
    });
});

//=========================================
//Crear heuristicas: Se adiciona al arreglo de cada principio
//=========================================

app.post('/:principio', 
        mdAutenticacion.verificarToken,
        mdAutenticacion.validarAdmin, 
        mdsHeuristica.asignarIndice, 
        mdsHeuristica.guardarHeuristicas, (req, res) => {

    var principio = req.params.principio;
    var idHeuristica = req.h;

    /** despues de que el middelware crear la heuristica, 
     * se actualiza la tabla Principio con el id 
     * que se devuelve desde guardarHeuristica  */

    Principio.update({ principio: principio }, { $push: { heuristicas: [idHeuristica] } }, (err, prin) => {
        if (err) {
            return res.status(500).json({
                ok: true,
                mensaje: "Error al guardar heuristica--PRINCIPIO",
                errors: err
            });
        }
        if (!prin) {
            return res.status(400).json({
                ok: false,
                mensaje: "El principio no esta en la BD",
                errors: { message: "El principio " + principio + "no esta en la BD " }
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: "peticion ok **se añadio la heuristica al principio**",
            prin
        });
    });
});


//=========================================
//Borrar Heuristcia no funciona el middleware para eliminar enla Collection Principio del arreglo d ehueristicas
//=========================================

app.delete('/:id', mdsHeuristica.borrarHeurisPrin, mdAutenticacion.validarAdmin, (req, res) => {
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