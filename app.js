//Requerimientos
var express = require("express")
var mongoose = require('mongoose')

//Inicializar variables
var app = express();

// comneccion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/sehpawdb',  (err, res ) => { 
    if ( err ) throw err;

    console.log("BD corriendo port: \x1b[36m'27017'\x1b[0m => \x1b[32m Online \x1b[0m");
    
 });

// Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: "peticion realizada correctamente"
    })
})


//Escuchar peticiones
app.listen(3000, () => {
    console.log("Express server corriendo port: \x1b[36m'3000'\x1b[0m => \x1b[32m Online \x1b[0m");

})