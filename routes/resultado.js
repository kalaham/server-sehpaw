var express = require('express');
var app = express();
var Resultado = require('../models/resultado');
var mdAutenticacion = require('../middlewares/autenticacion');
var mdResultado = require('../middlewares/mdResultado');
var Usuario = require('../models/usuario');

//=========================================
//Mostrar todos los resultados existentes
//=========================================
app.get('/todos', mdAutenticacion.verificarToken, mdAutenticacion.validarAdmin, (req, res, next) => {
    Resultado.find({})
        .populate('evaluador', 'nombre email')
        .populate('evaluacion')
        .exec((err, resultados) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "error al cargar Resultados",
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                mensaje: "peticion realizada correctamente- Resultados- Admin",
                resultados
            });
        });
});

//=========================================
//Mostarr resultado por roles, busca el id del usuario con determinado rol y muestra los 'resultados' encontrados
//=========================================
app.get('/', mdAutenticacion.verificarToken, (req, res, next) => {

    if (req.usuario.role == 'COORDINADOR_ROLE') {
        rol = 'coordinador';
    }
    if (req.usuario.role == 'EVALUADOR_ROLE') {
        rol = 'evaluador';
    }
    const query = { [`${rol}`]: req.usuario._id };
    Resultado.find(query)
        .populate('evaluador', 'nombre email')
        .populate('evaluacion')
        .exec((err, resultados) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "error al cargar Resultados",
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                mensaje: "peticion realizada correctamente" + rol,
                resultados,
                evaluador: req.usuario
            });
        });
});

//=========================================
//Mostrar los resultados de una evaluacion
//=========================================

app.get('/:idEvaluacion', mdAutenticacion.verificarToken, mdResultado.buscarYValidarEvaluaciones, (req, res, next) => {
    var id = req.params.idEvaluacion;
    Resultado.find({ $and: [{ evaluacion: id }, { evaluador: { $in: req.evaluadores } }] })
    .populate('evaluador', 'nombre email')
    // .populate('evaluacion')
    .exec((err, resultados) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Internal server error",
                errors: err
            });
        }
        if (!resultados || resultados == '') {
            return res.status(404).json({
                ok: false,
                mensaje: "No se encontraron reasultados para esta evaluacion " + id,
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: "Resultados encontrados",
            resultados
        });

    });
});

//=========================================
//Crear resultado
//=========================================
app.post('/', mdAutenticacion.verificarToken, (req, res) => {

    var body = req.body;

    var resultado = new Resultado({
        evaluacion: body.evaluacion,
        evaluador: req.usuario._id,
        valores: body.valores
    });
    console.log(body);

    resultado.save((err, resulGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: "Error al guardar Resultado",
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            mensaje: "resultado guardado exitisamente",
            resulGuardado
        });
    });
});

module.exports = app;