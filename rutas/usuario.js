var expres = require('express')
var bcrypt = require('bcryptjs');
var app = expres();
var jwt = require('jsonwebtoken')
var Usuario = require('../modelos/usuario')
var autenticacion = require('../middelware/autenticacion')

// ==============================
// obtener todos los Usuarios
// ==============================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'Nombre email img role')
        .skip(desde)
        .limit(5)
        .exec(
            (err, usuario) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuraio',
                        erros: err
                    });
                }
                Usuario.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        usuarios: usuario,
                        total: conteo
                    });

                })

            });
});

// ==============================
// actualizar  los Usuarios
// ==============================

app.put('/:id', autenticacion.verificatoken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                erros: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'usuario con ' + id + ' no existe',
                erros: { message: 'no existe el usuario con ese id ' }
            });
        }
        usuario.Nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error actualizar usuraio',
                    erros: err
                });
            }
            res.status(200).json({
                ok: true,
                body: usuarioGuardado
            });

        });

    });

});


// ==============================
// ingresar usuario nuevo los Usuarios
// ==============================
app.post('/', autenticacion.verificatoken,
    (req, res) => {
        var body = req.body;

        usuario = new Usuario({
            Nombre: body.nombre,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10),
            img: body.img,
            role: body.role
        });

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error crear usuraio',
                    erros: err
                });
            }
            res.status(201).json({
                ok: true,
                body: usuarioGuardado,
                usuariotokenn: req.usuario
            });

        });


    });



// ==============================
// actualizar  los Usuarios
// ==============================

app.delete('/:id', autenticacion.verificatoken, (req, res) => {

    var id = req.params.id;


    Usuario.findByIdAndRemove(id, (err, usuarioborrado) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borar usuario',
                erros: err
            });
        }
        if (!usuarioborrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'usuario con ' + id + ' no existe',
                erros: { message: 'no existe el usuario con ese id ' }
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioborrado
        });



    });

});

module.exports = app;