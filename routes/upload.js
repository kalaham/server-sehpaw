//requerimientos
var express = require('express');
const fileUpload = require('express-fileupload');
var fs = require('fs')
var mdAutenticacion = require('../middlewares/autenticacion')

var app = express();


var Usuario = require('../models/usuario');

// default options
app.use(fileUpload());

app.put('/', mdAutenticacion.verificarToken, (req, res, next) => {

    var id = req.usuario._id;
    var role = req.role;
    var rolesPermitidos = ['ADMIN_ROLE', 'COORDINADOR_ROLE', 'EVALUADOR_ROLE'];


    if (rolesPermitidos.indexOf(role) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tu rol no esta autorizado para subir imagenes',
            errors: { menssage: 'TU ROL ES => *' + role + '* los roles validas son: ' + rolesPermitidos.join(', ') }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No has seleccionado ningun archivo',
            errors: { menssage: 'Debes selecionar un archivo' }
        });
    }

    //Obtener el nombre del archivo.
    var archivo = req.files.imagen;

    var nombreCortado = archivo.name.split('.');
    var extencionArchivo = nombreCortado[nombreCortado.length - 1];

    //solo se aceptan estas extenciones
    var extecionesValidas = ['png', 'jpg', 'gif', 'jpeg']
    if (extecionesValidas.indexOf(extencionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'la extecion no esta permitida',
            errors: { menssage: 'las estenciones validas son: ' + extecionesValidas.join(', ') }
        });
    }

    //Nombre personalizado para guardar el archivo

    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extencionArchivo}`;

    //moverarchivo del temporal a una path (directorio fijo)

    var path = `./uploads/${role}/${nombreArchivo}`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover el archivo',
                errors: err
            });
        }

        subirPorRol(id, role, nombreArchivo, res);

        // res.status(200).json({
        //     ok: true,
        //     mensaje: 'peticion realizada correctamente'
        // });
    });
});

function subirPorRol(id, role, nombreArchivo, res) {

    Usuario.findById(id, (err, usuario) => {
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error con el id no esta en BD (usuarios)',
                errors: err
            });
        }
        switch (role) {
            case 'ADMIN_ROLE':
                var pathViejo = './uploads/ADMIN_ROLE/' + usuario.img;
                break;
            case 'COORDINADOR_ROLE':
                var pathViejo = './uploads/COORDINADOR_ROLE/' + usuario.img;
                break;
            case 'EVALUADOR_ROLE':
                var pathViejo = './uploads/EVALUADOR_ROLE/' + usuario.img;
                break;
            default:
                break;
        }
        //si el usuario ya tiene una imagen la remplza (la pone encima)

        if (usuario.img.length > 1) {
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }
        }

        usuario.img = nombreArchivo;

        usuario.save((err, usuarioActualizado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar la imagen de usuario en BD',
                    errors: err
                });
            }
            usuario.password = ':p';

            return res.status(200).json({
                ok: true,
                mensaje: 'imagen de usuario actualizada',
                usuario: usuarioActualizado,
                path: pathViejo
            });
        });
    });
}


module.exports = app;