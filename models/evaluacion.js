var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var evaluacionSchema = new Schema({
    coordinador: {type: Schema.Types.ObjectId, ref: 'Usuarios', required:[true, 'No hay coordinador y es necesario']},
    fecha: {type:Date, required:[true, 'No hay fecha y es necesaria']},
    nombreSitio: {type: String, required:[true,'No hay nombre del sitio y es necesario']},
    urlSitio:{type: String, required:[true, 'No hay URL del sitio y es necesario']},
    heuristicas: [ {type: Schema.Types.ObjectId, ref:'Heuristicas'}],
    evaluadores:[{type: Schema.Types.ObjectId, ref:'Usuarios'}],
    estado: {type: Boolean, default: false}
},{collection: 'evaluaciones'});

module.exports = mongoose.model('Evaluaciones', evaluacionSchema)