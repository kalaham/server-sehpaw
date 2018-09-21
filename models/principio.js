var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mongooseValidator = require('mongoose-unique-validator')

var principiosvalidos ={
    values:['perceptible', 'comprencible', 'operable','robusto'],
    message: '{VALUE} no es un principio permitido'
};

var principioSchema = new Schema({
    principio: { type: String, enum: principiosvalidos, required: [true, 'No hay principio y es necesario'] },
    heuristicas: [{
        heuristica: { type: Schema.Types.ObjectId, ref: 'Heuristicas' }
    }]

});
principioSchema.plugin(mongooseValidator, {message:'{PATH} debe ser unico'});
module.exports = mongoose.model('Principios', principioSchema)