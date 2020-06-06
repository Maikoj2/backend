var expres = require('express')
var bcrypt = require('bcryptjs');
var app = expres();
var jwt = require('jsonwebtoken')
var Medico = require('../modelos/medicos')
var autenticacion = require('../middelware/autenticacion')


// ==============================
// obtener todos los medico
// ==============================

app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'Nombre email')
        .populate('hospital')
        .exec(
            (err, medico) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medico',
                        erros: err
                    });
                }
                Medico.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        medico: medico,
                        total: conteo

                    });
                });
            });
});

// ==============================
// actualizar  los medico
// ==============================
app.put('/:id', autenticacion.verificatoken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                erros: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'medico con ' + id + ' no existe',
                erros: { message: 'no existe el medico con ese id ' }
            });
        }

        medico.nombre = body.nombre;
        medico.hospital = body.hospital;
        medico.usuario = req.usuario._id;

        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error actualizar medico',
                    erros: err
                });
            }
            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });

        });

    });

});


// ==============================
// ingresar medico nuevo 
// ==============================
app.post('/', autenticacion.verificatoken,
    (req, res) => {
        var body = req.body;

        var medico = new Medico({
            nombre: body.nombre,
            usuario: req.usuario._id,
            hospital: body.hospital


        });

        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error crear medico',
                    erros: err
                });
            }
            res.status(201).json({
                ok: true,
                medico: medicoGuardado
            });

        });


    });
// ==============================
// actualizar  los medicos
// ==============================

app.delete('/:id', autenticacion.verificatoken, (req, res) => {

    var id = req.params.id;


    medico.findByIdAndRemove(id, (err, medicoborrado) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borar medico',
                erros: err
            });
        }
        if (!medicoborrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'medico con ' + id + ' no existe',
                erros: { message: 'no existe el medico con ese id ' }
            });
        }
        res.status(200).json({
            ok: true,
            medico: medicoborrado
        });



    });

});

module.exports = app;