var expres = require('express')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcryptjs');
var SEED = require('../config/config').SEED;
var app = expres();
var Usuario = require('../modelos/usuario')

app.post('/', (req, res) => {
    var body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuariodb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error buscar usuacrios',
                erros: err
            });
        }
        if (!usuariodb) {

            return res.status(500).json({
                ok: false,
                mensaje: 'credenciales incorrectas - email',
                erros: err
            });
        }
        if (!bcrypt.compareSync(body.password, usuariodb.password)) {
            return res.status(500).json({
                ok: false,
                mensaje: 'credenciales incorrectas - password',
                erros: err
            });
        }
        usuariodb.password = ':)'
            // crear token
        var token = jwt.sign({ usuario: usuariodb }, SEED, { expiresIn: 14400 }) //4 horas

        res.status(201).json({
            ok: true,
            usuario: usuariodb,
            token: token,
            id: usuariodb._id

        });

    })

});







module.exports = app;