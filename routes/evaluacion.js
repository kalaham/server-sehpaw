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
        .populate('evaluadores.evaluador', 'nombre email')
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
//Guardar valores en la evaluacion. Actualizar los valores
//=========================================
app.put('/:id', mdAutenticacion.verificarToken, (req, res, next) => {
    var id = req.params.id;
    var body = req.body;

    Evaluacion.findOneAndUpdate(
        { $and: [{ '_id': id }, { 'evaluadores.evaluador': req.usuario._id }] },
        { $set: {"evaluadores.$.valores": body}},
        (err, evaUpdate) => {
            console.log(body.valores); 
            console.log('este es el body'+body);
                  
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Server internal error -- Guardando valores en evaluacion",
                    errors: err
                });
            }
            if (!evaUpdate) {
                return res.status(204).json({
                    ok: true,
                    mensaje: 'Este ID no coincide con ninguna evaluacion',
                });
            }
            // evaUpdate
            res.status(200).json({
                ok: true,
                mensaje: "peticion realizada correctamente",
                evaUpdate
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
        rol = 'evaluadores.evaluador';
    }
    const query = { [`${rol}`]: req.usuario._id };

    Evaluacion.find(query)
        .populate('coordinador', 'nombre email')
        .populate('heuristicas')
        .populate('evaluadores.evaluador', 'nombre email')
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
        .populate('evaluadores.evaluador', 'nombre email')
        .exec((err, evaluacion) => {
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
    // console.log(body.evaluadores.length);

    switch (body.evaluadores.length) {
        case 1:
            console.log('entro en 1');
            x = { evaluador: body.evaluadores }
            break;
        case 2:
            x = [{ evaluador: body.evaluadores[0] }, { evaluador: body.evaluadores[1] }]
            console.log('entro en 2' + JSON.stringify(x));
            break;
        case 3:
            console.log('entro en 3');
            x = [{ evaluador: body.evaluadores[0] }, { evaluador: body.evaluadores[1] }, { evaluador: body.evaluadores[2] }]
            break;
        case 4:
            console.log('entro en 4');
            x = [{ evaluador: body.evaluadores[0] }, { evaluador: body.evaluadores[1] }, { evaluador: body.evaluadores[2] }, { evaluador: body.evaluadores[3] }]
            break;
        case 5:
            console.log('entro en 5');
            x = [{ evaluador: body.evaluadores[0] }, { evaluador: body.evaluadores[1] }, { evaluador: body.evaluadores[2] }, { evaluador: body.evaluadores[3] }, { evaluador: body.evaluadores[4] }]
            break;
        default:
            console.log('Solo se pueden selecionar 5 evaluadores');
            break;
    }

    var evaluacion = new Evaluacion({
        coordinador: req.usuario._id,
        fecha: body.fecha,
        nombreSitio: body.nombreSitio,
        urlSitio: body.urlSitio,
        heuristicas: body.heuristicas,
        evaluadores: x
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