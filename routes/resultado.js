var express = require('express')

var app = express();
var Resultado = require('../models/resultado')
var mdAutenticacion = require('../middlewares/autenticacion')

//=========================================
//Mostrar todos los resultados existentes
//=========================================


app.get('/', mdAutenticacion.verificarToken, (req, res, next) => {

    Resultado.find({}, (err, resultado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "error al cargar Resultados",
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: "peticion realizada correctamente- ResultadoS",
            resultados: resultado
        });
    });
});

//=========================================
//Crear resultado
//=========================================
app.post('/:idEvaluacion', mdAutenticacion.buscarevaluacion, mdAutenticacion.verificarToken,(req, res) => {

    var body = req.body;
    // console.log(req.evaluacion);

    var resultado = new Resultado({
        evaluacion: req.evaluacion._id,
        evaluador: req.usuario._id,
        valores: body.valor
    });

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