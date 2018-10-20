//Requerimientos
var express = require("express")
var mongoose = require('mongoose')
var bodyParser = require('body-parser')

//importamos las rutas
var appRoutes = require('./routes/app')
var usuarioRoutes = require('./routes/usuario')
var loginRoutes = require('./routes/login')
var evaluacionRoutes = require('./routes/evaluacion')
var heuriticaRoutes = require('./routes/heuristica')
var resultadoRoutes = require('./routes/resultado')
var principioRoutes = require('./routes/principio')
var uploadRoutes = require('./routes/upload')

//Inicializar variables
var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// comneccion a la base de datos
mongoose.connect('mongodb://localhost:27017/sehpawdb',  (err, res ) => { 
    if ( err ) throw err;

    console.log("BD corriendo port: \x1b[36m'27017'\x1b[0m => \x1b[32m Online \x1b[0m");
    
 });

// Rutas
app.use('/usuario', usuarioRoutes)
app.use('/evaluacion', evaluacionRoutes)
app.use('/upload', uploadRoutes)
app.use('/heuristica', heuriticaRoutes)
app.use('/principio', principioRoutes)
app.use('/resultado', resultadoRoutes)
app.use('/login', loginRoutes)
app.use('/', appRoutes);

//Escuchar peticiones
app.listen(3000, () => {
    console.log("Express server corriendo port: \x1b[36m'3000'\x1b[0m => \x1b[32m Online \x1b[0m");

})