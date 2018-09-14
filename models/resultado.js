var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var resultadoSchema = new Schema({
    idEvaluacion:{type: [Schema.Types.ObjectId], ref: 'Evaluaciones'},
    calificaciones:[{
        //evaluador: {type: Schema.Types.ObjectId, ref: 'Usuarios'},
        valores:[{
            //heuristica:{type:Schema.Types.ObjectId, ref: 'Heuristicas'},
            valor:{type: String, required:[false,'No se ha asignado un valor (1 heuristica)']}
        }]
    }],
}, {collection:'resultados'});
module.exports = mongoose.model('Resultados', resultadoSchema)