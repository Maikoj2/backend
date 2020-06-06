var expres = require('express')
var app = expres();
Hospital = require('../modelos/hospital');
Medico = require('../modelos/medicos');
Usuarios = require('../modelos/usuario');





// =======================================
// busqueda por coleccion 
// =======================================


app.get('/coleccion/:tabla/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var coleccion = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');
    var promesa;
    switch (coleccion) {
        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);

            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);

            break;
        case 'usuarios':
            promesa = buscarUsuario(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'los tipos de busques solo son usuarios, medicos, hospitales',
                error: { message: 'tipo de tabla/coleccion no valido' }

            });
    }


    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [coleccion]: data


        });




    });

});

// =======================================
// busqueda general
// =======================================

app.get('/todo/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');


    Promise.all([
        buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda, regex),
        buscarUsuario(busqueda, regex)
    ]).then(respuestas => {
        res.status(200).json({
            ok: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            Usuarios: respuestas[2]
        });

    })




});


function buscarHospitales(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex })
            .populate('usuario', 'Nombre email')
            .exec((err, hospitales) => {

                if (err) {
                    reject('error al cargar hospitales')
                } else {
                    resolve(hospitales)
                }

            });

    });


}

function buscarMedicos(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex })
            .populate('usuario', 'Nombre email')
            .populate('hospital')
            .exec((err, medicos) => {

                if (err) {
                    reject('error al cargar hospitales')
                } else {
                    resolve(medicos)
                }

            });

    });


}

function buscarUsuario(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Usuarios.find({}, 'Nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('error al buscar usuario', err)
                } else {
                    resolve(usuarios)
                }

            })

    });


}

module.exports = app;