var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mongooseValidator = require('mongoose-unique-validator')
// var heuristica = require('./heuristica')

var principiosvalidos ={
    values:['perceptible', 'comprencible', 'operable','robusto'],
    message: '{VALUE} no es un principio permitido'
};

var principioSchema = new Schema({
    principio: { type: String, enum: principiosvalidos, unique: true, required: [true, 'No hay principio y es necesario'] },
    heuristicas: [{type: Schema.Types.ObjectId, ref:'Heuristicas'}]

});
principioSchema.plugin(mongooseValidator, {message:'{PATH} debe ser unico'});
module.exports = mongoose.model('Principios', principioSchema)
