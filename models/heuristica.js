var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var heuristicaSchema = new Schema({

    principio: { type: String, required: [true, 'No hay principio y es bnecesario'] },
    heuristicas: [{
        indice: { type: String, unique:true, required: [true, 'No hay indice y es necesario'] },
        heuristica: { type: String, required: [true, 'No hay heuristica y es necesario'] },
        pregunta: { type: String, required: [true, 'No hay pregunta y es necesario'] },
        nivelConformidad: { type: String, required: [true, 'No hay nivel conformidad y es necesario'] },
        ejemplo: { type: String, required: false },
        referencia: { type: String, required: [true, 'No hay referencia y es necesario'] },
        autor: { type: Schema.Types.ObjectId, ref: 'Usuarios' }
    }]

}, { collection: 'heuristicas' });
module.exports = mongoose.model('Heuristicas', heuristicaSchema)