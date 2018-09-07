var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var mongooseValidator = require('mongoose-unique-validator')

var rolesValidos ={
    values:['ADMIN_ROLE', 'COORDINADOR_ROLE', 'EVALUADOR_ROLE'],
    message: '{VALUE} no es un rol permitido'
};

var usuarioSchema = new Schema({

    nombre:{type:String, required:[true, 'El nombre es necesario']},
    email:{type:String, unique:true, required:[true, 'El correo es necesario']},
    password:{type:String, required:[true, 'El contraseña es necesario']},
    img:{type:String, required:false },
    role:{type:String, required:true, enum: rolesValidos }
});

usuarioSchema.plugin(mongooseValidator, {message: '{PATH} debe ser unico'})
module.exports = mongoose.model('Usuarios', usuarioSchema)