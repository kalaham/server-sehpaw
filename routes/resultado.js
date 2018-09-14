var express = require('express')

var app = express();
var Resultado = require('../models/resultado')
var mdAutenticacion = require('../middlewares/autenticacion')

//=========================================
//Mostrar todos los resultados existentes
//=========================================


app.get('/', (req, res, next) => {

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
app.post('/:idEvaluacion',mdAutenticacion.buscarevaluacion, (req,res) => { 

    var body = req.body;

    var resultado = new Resultado({
        idEvaluacion: req.evaluacion._id,
        calificaciones:[{
            evaluador: body.idEvaluador,
            valores:[{
                heuristica:body.idheuristica,
                valor:body.valor
            }]
        }]
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
            resultado: resulGuardado
        });
    });
 });

module.exports = app;