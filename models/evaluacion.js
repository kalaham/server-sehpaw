var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var evaluacionSchema = new Schema({

    coordinador: {type: String, required:[true, 'No hay coordinador y es necesario']},
    fecha: {type:String, required:[true, 'No hay fecha y es necesaria']},
    nombreSitio: {type: String, required:[true,'No hay nombre del sitio y es necesario']},
    urlSitio:{type: String, required:[true, 'No hay URL del sitio y es necesario']},
    heuristicas:{type:[String], required:[true, 'No hay heuristicas y es necesario']},
    evaluadores:{type:[String], required:[true, 'No hay evaluadores y es necesario']},
    

},{collection: 'evaluaciones'})

module.exports = mongoose.model('Evaluaciones', evaluacionSchema)