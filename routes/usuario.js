"use strict";
exports.__esModule = true;
var express_1 = require("express");
var usuario_model_1 = require("../models/usuario.model");
var bcrypt_1 = require("bcrypt");
var token_1 = require("../classes/token");
var authentication_1 = require("../middlewares/authentication");
var userRoutes = express_1.Router();
//prueba de conexión
userRoutes.get('/prueba', function (req, res) {
    res.json({
        ok: true,
        mensaje: 'Todo funciona bien!'
    });
});
//login
userRoutes.post('/login', function (req, res) {
    var body = req.body;
    usuario_model_1.Usuario.findOne({ email: body.email }, function (err, userDB) {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'El usuario o la contraseña no son correctos'
            });
        }
        if (userDB.compararPassword(body.password)) {
            var tokenUser = token_1["default"].getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar
            });
            res.json({
                ok: true,
                token: tokenUser
            });
        }
        else {
            return res.json({
                ok: false,
                mensaje: 'El usuario o la contraseña no son correctos'
            });
        }
    });
});
//crear un usuario en la base de datos
userRoutes.post('/create', function (req, res) {
    var user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt_1["default"].hashSync(req.body.password, 10),
        avatar: req.body.avatar
    };
    usuario_model_1.Usuario.create(user).then(function (userDB) {
        var tokenUser = token_1["default"].getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });
        res.json({
            ok: true,
            token: tokenUser
        });
    })["catch"](function (err) {
        res.json({
            ok: false,
            err: err
        });
    });
});
//actuallizar usuario
userRoutes.post('/update', authentication_1.verificaToken, function (req, res) {
    var user = {
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email,
        avatar: req.body.avatar || req.usuario.avatar
    };
    usuario_model_1.Usuario.findByIdAndUpdate(req.usuario._id, user, { "new": true }, function (err, userDB) {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe usuario con ese ID'
            });
        }
        var tokenUser = token_1["default"].getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });
        res.json({
            ok: true,
            token: tokenUser
        });
    });
});
exports["default"] = userRoutes;
