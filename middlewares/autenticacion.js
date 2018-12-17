var jwt = require('jsonwebtoken')

var SECRET = require('../config/config').SECRET;


//=========================================
//Midelawre: verificar Token
//=========================================

exports.verificarToken = function (req, res, next) {
    var token = req.query.token;
    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: " Token incorrecto",
                errors: err
            });
        }
        req.usuario = decoded.usuario;
        // req.role = decoded.usuario.role;
        next();
    });
}

exports.validarAdmin = function (req, res, next) {
    
    if (req.usuario.role==='ADMIN_ROLE') {        
        next();
        return;
    }
    // res.status(403).send('No eres admin! hijo!');
    res.status( 403 ).json({
        ok: false,
        mensaje:"No eres admin! hijo!"        
    });    
}
