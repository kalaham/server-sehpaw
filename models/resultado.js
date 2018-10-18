var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var resultadoSchema = new Schema({
    evaluacion:{type:Schema.Types.ObjectId, ref: 'Evaluaciones'},
    evaluador:{type:Schema.Types.ObjectId, ref: 'Usuarios'},
    valores:[ {type:Number, required:[true, 'Se necesita la puntuacion']} ]
}, {collection:'resultados'});

module.exports = mongoose.model('Resultados', resultadoSchema)