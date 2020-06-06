var expres = require('express')
var bcrypt = require('bcryptjs');
var app = expres();
var jwt = require('jsonwebtoken')
var Hospital = require('../modelos/hospital')
var autenticacion = require('../middelware/autenticacion')


// ==============================
// obtener todos los hospital
// ==============================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);
    Hospital.find({}).populate('usuario', 'Nombre email').
    exec(
        (err, hospital) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuraio',
                    erros: err
                });
            }
            Hospital.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    hospital: hospital,
                    total: conteo
                });
            });
        });
});

// ==============================
// actualizar  los hospital
// ==============================
app.put('/:id', autenticacion.verificatoken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                erros: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'hospital con ' + id + ' no existe',
                erros: { message: 'no existe el hospital con ese id ' }
            });
        }
        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error actualizar hospital',
                    erros: err
                });
            }
            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });

        });

    });

});


// ==============================
// ingresar hospital nuevo 
// ==============================
app.post('/', autenticacion.verificatoken,
    (req, res) => {
        var body = req.body;

        var hospital = new Hospital({
            nombre: body.nombre,
            usuario: req.usuario._id

        });

        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error crear hospital',
                    erros: err
                });
            }
            res.status(201).json({
                ok: true,
                hospital: hospitalGuardado
            });

        });


    });
// ==============================
// actualizar  los hospitals
// ==============================

app.delete('/:id', autenticacion.verificatoken, (req, res) => {

    var id = req.params.id;


    hospital.findByIdAndRemove(id, (err, hospitalborrado) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borar hospital',
                erros: err
            });
        }
        if (!hospitalborrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'hospital con ' + id + ' no existe',
                erros: { message: 'no existe el hospital con ese id ' }
            });
        }
        res.status(200).json({
            ok: true,
            hospital: hospitalborrado
        });



    });

});

module.exports = app;