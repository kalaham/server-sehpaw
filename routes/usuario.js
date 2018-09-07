var express = require('express')
var bcrypt = require('bcryptjs')
var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();
var Usuario = require('../models/usuario');

//=========================================
//Extraer todos los usuarois
//=========================================

app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: "Error cargando usuario BD",
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    usuarios: usuarios
                });
            });

});

//=========================================
//aCTUALIZAR USUARIO
//=========================================

app.put('/:id', mdAutenticacion.verificarToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: " Error al buscar usuario",
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: " El usuario con el id " + id + " no existe",
                errors: { message: "no esxiste un usuario con este ID" }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;


        usuario.save((err, usuaGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: " Error al guardar cambios",
                    errors: err
                });
            }

            usuaGuardado.password = ":P"

            res.status(200).json({
                ok: true,
                usuario: usuaGuardado,
            });
        });
    });
});

//=========================================
//Crear un usuario
//=========================================

app.post('/', mdAutenticacion.verificarToken, (req, res) => {

    body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuguardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: " Error al crear usuario",
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuguardado,
            usuarioToken: req.usuario
        });
    });
});

//=========================================
//Boorar un usuario
//=========================================

app.delete('/:id', mdAutenticacion.verificarToken, (req, res) => {
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: " Error al borrar usuario",
                errors: err
            });
        }
        if (!usuBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: " El ID no existe",
            });
        }
        usuBorrado.password = ":P";
        res.status(200).json({
            ok: true,
            usuario: usuBorrado
        });
    })
})

module.exports = app;