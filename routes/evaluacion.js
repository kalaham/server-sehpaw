var express = require('express')

var app = express();
var Evaluacion = require('../models/evaluacion')
var mdAutenticacion = require('../middlewares/autenticacion');

//=========================================
//Mostrar Evaluaciones
//=========================================

app.get('/todas', mdAutenticacion.verificarToken, mdAutenticacion.validarAdmin, (req, res, next) => {

    Evaluacion.find({})
        .populate('coordinador', 'nombre email')
        .populate('heuristicas')
        .populate('evaluadores', 'nombre email')
        .exec((err, evaluaciones) => {
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
//Mostarr Evaluaciones para Evaluador  y Coordinador
//=========================================
app.get('/', mdAutenticacion.verificarToken, (req, res, next) => {

    rol = '';
    if (req.usuario.role == 'COORDINADOR_ROLE') {
        rol = 'coordinador';
    }
    if (req.usuario.role == 'EVALUADOR_ROLE') {
        rol = 'evaluadores';
    }
    const query = { [`${rol}`]: req.usuario._id };

    Evaluacion.find(query)
        .populate('coordinador', 'nombre email')
        .populate('heuristicas')
        .populate('evaluadores', 'nombre email')
        .exec((err, evaluaciones) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Server internal error, in find",
                    errors: err
                });
            }
            if (!evaluaciones) {
                return res.status(204).json({
                    ok: true,
                    mensaje: "No se encontraron evaluaciones para este ID" + req.usuario._id,
                });
            }
            res.status(200).json({
                ok: true,
                mensaje: "peticion realizada correctamente",
                evaluaciones
            });
        });
});

//=========================================
//Mostar una sola evaluacion
//=========================================
app.get('/:idEvaluacion', mdAutenticacion.verificarToken, (req, res, next) => {
    var id = req.params.idEvaluacion;
    Evaluacion.findById(id)
    .populate('coordinador', 'nombre email')
    .populate('heuristicas')
    .populate('evaluadores', 'nombre email')
    .exec( (err, evaluacion) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Server internal error, in find",
                errors: err
            });
        }
        if (!evaluacion) {
            return res.status(204).json({
                ok: true,
                mensaje: 'Este ID no coincide con ninguna evaluacion',
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: "peticion realizada correctamente",
            evaluacion
        });
    });
});
//=========================================
//crear evaluacion
//=========================================

app.post('/', mdAutenticacion.verificarToken, (req, res) => {

    body = req.body;

    var evaluacion = new Evaluacion({
        coordinador: req.usuario._id,
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

app.delete('/:id', mdAutenticacion.verificarToken, (req, res) => {

    var id = req.params.id;

    Evaluacion.findByIdAndRemove(id, (err, evaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al borrar Evaluacion",
                errors: err
            });
        }
        if (!evaBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: "El ID nocoincide con ninguna evaluacion",
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            evaluacion: evaBorrada
        });
    });
});

module.exports = app;