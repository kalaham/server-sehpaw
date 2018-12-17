var Evaluacion = require('../models/evaluacion');
var Resultado = require('../models/resultado');

exports.buscarYValidarEvaluaciones = function (req, res, next) {
    var id = req.params.idEvaluacion;
    Evaluacion.findById(id, (err, evaluacion) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "error al cargar Resultados",
                errors: err
            });
        }
        if (!evaluacion) {
            return res.status(204).json({
                ok: false,
                mensaje: "No se encontro ninguna evaluacion con este ID" + id,
            });
        }
        
        req.evaluadores= evaluacion.evaluadores;
        next();
    });
}