"use strict";
exports.__esModule = true;
var jsonwebtoken_1 = require("jsonwebtoken");
var Token = /** @class */ (function () {
    function Token() {
    }
    Token.getJwtToken = function (payload) {
        return jsonwebtoken_1["default"].sign({
            usuario: payload
        }, this.seed, { expiresIn: this.caducidad });
    };
    Token.comprobarToken = function (userToken) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            jsonwebtoken_1["default"].verify(userToken, _this.seed, function (err, decoded) {
                if (err) {
                    // no confiar en el token
                    reject();
                }
                else {
                    // token válido
                    resolve(decoded);
                }
            });
        });
    };
    Token.seed = 'este-es-el-seed-de-mi-app-secreto'; //clave secreta única para firmar tokens
    Token.caducidad = '30d';
    return Token;
}());
exports["default"] = Token;
