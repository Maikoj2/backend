var mongoose = require('mongoose');
var uniquevallidator = require('mongoose-unique-validator');
var schema = mongoose.Schema;

var rolesValidos = {

    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

var usuarioSchema = new schema({

    Nombre: { type: String, required: [true, 'el nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'el correo es necesario'] },
    password: { type: String, required: [true, 'la contraseña es necesario'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos }
});

usuarioSchema.plugin(uniquevallidator, { message: '{PATH} debe ser unico' })

module.exports = mongoose.model('usuario', usuarioSchema);