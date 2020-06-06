var expres = require('express')
var app = expres();
var fs = require('fs');
var fileUpload = require('express-fileupload');
var Usuario = require('../modelos/usuario');
var Medico = require('../modelos/medicos');
var Hospital = require('../modelos/hospital');

app.use(fileUpload());


//  rutas
app.put('/:tipo/:id', (req, res, next) => {
    var tipo = req.params.tipo;
    var id = req.params.id;
    // tipos validos 
    var tiposvalidos = ['hospitales', 'medicos', 'usuarios'];
    if (tiposvalidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            mensaje: 'tipo de coleccion no valida',
            erros: { mesagge: 'tipo de coleccion no valida' }
        });
    }

    if (!req.files) {

        return res.status(400).json({
            ok: false,
            mensaje: 'sin archivo selecciondo ',
            erros: { mesagge: 'debe seleccionar una imagen ' }
        });
    } else {

    }
    // obtener nombre de la imagen 

    var archivo = req.files.imagen;
    var nombrecortado = archivo.name.split('.');
    var extensionArchivo = nombrecortado[nombrecortado.length - 1]
        // solo esta extensiones aceptamos

    var extensionValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'extencion no valida',
            erros: { mesagge: 'las extensiones validas son:  ' + extensionValidas.join(', ') }
        });
    }

    //nombre de archico personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    // mover el archivo a un path
    var path = `./uploads/${tipo}/${nombreArchivo}`
    archivo.mv(path, err => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                erros: err
            });

        }
        subirportpo(tipo, id, nombreArchivo, res);
        // res.status(200).json({
        //     ok: true,
        //     mensaje: 'imagen movida',
        //     nombrecortado: extensionArchivo
        // });

    })

});

function subirportpo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {

            var pathviejo = './uploads/usuarios/' + usuario.img;

            //si existe una imagen la elimin
            if (fs.existsSync(pathviejo)) {

                fs.unlinkSync(pathviejo);
            }
            usuario.img = nombreArchivo;

            usuario.save(err, usuarioactualizado => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error actualizar usuraio',
                        erros: err
                    });
                }
                return res.status(200).json({
                    ok: true,
                    mensaje: 'actualizada imagen',
                    usuarioactualizado: usuario

                });
            })
        })


    }
    if (tipo === 'medicos') {
        Medico.findById(id, (err, medico) => {

            var pathviejo = './uploads/medicos/' + medico.img;


            //si existe una imagen la elimin
            if (fs.existsSync(pathviejo)) {

                fs.unlinkSync(pathviejo);
            }
            medico.img = nombreArchivo;

            medico.save(err, medicoactualizados => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error actualizar usuraio',
                        erros: err
                    });
                }
                return res.status(200).json({
                    ok: true,
                    mensaje: 'actualizada imagen',
                    medicoctualizado: medico

                });
            })
        })
    }
    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {

            var pathviejo = './uploads/hospitales/' + hospital.img;

            //si existe una imagen la elimin
            if (fs.existsSync(pathviejo)) {

                fs.unlinkSync(pathviejo);
            }
            hospital.img = nombreArchivo;

            hospital.save(err, hospitalactualizado => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error actualizar usuraio',
                        erros: err
                    });
                }
                return res.status(200).json({
                    ok: true,
                    mensaje: 'actualizada imagen',
                    hospitalactualizado: hospital

                });
            })
        })
    }




}
module.exports = app;