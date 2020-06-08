var expres = require('express')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcryptjs');
var SEED = require('../config/config').SEED;
var CLIENT_ID = require('../config/config').CLIENT_ID;
var app = expres();
var Usuario = require('../modelos/usuario')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);



async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];

    return {

        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}
verify().catch(console.error);


app.post('/google/', async(req, res) => {

    var token = req.body.token;
    var googleuser = await verify(token)
        .catch(e => {

            return res.status(403).json({
                ok: false,
                mensaje: 'token no valido',
                erros: e
            });
        })

    Usuario.findOne({ email: googleuser.email }, (err, usuariodb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error buscar usuacrios',
                erros: err
            });
        }
        if (usuariodb) {

            if (usuariodb.google === false) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'debe utilizr su autenticacion normal',
                    erros: err
                });
            } else {

                var token = jwt.sign({ usuario: usuariodb }, SEED, { expiresIn: 14400 }) //4 horas

                res.status(201).json({
                    ok: true,
                    usuario: usuariodb,
                    token: token,
                    id: usuariodb._id

                });
            }


        } else {
            //el usuaro no existe hay que crarlo 
            var usuario = new Usuario();
            usuario.Nombre = googleuser.nombre;
            usuario.email = googleuser.email;
            usuario.img = googleuser.img;
            usuario.google = true;
            usuario.password = ':)';
            usuario.save((err, usuariodb) => {

                var token = jwt.sign({ usuario: usuariodb }, SEED, { expiresIn: 14400 }) //4 horas

                res.status(201).json({
                    ok: true,
                    usuario: usuariodb,
                    token: token,
                    id: usuariodb._id

                });
            })


        }

    })

    // res.status(201).json({
    //     ok: true,
    //     usuario: 'entro!',
    //     googleuser: googleuser

    // });


});


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