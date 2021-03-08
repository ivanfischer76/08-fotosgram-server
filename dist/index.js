"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const server = new server_1.default();
//configurar CORS
server.app.use(cors_1.default({ origin: true, credentials: true }));
//Body parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
//rutas de mi aplicación
server.app.use('/user', usuario_1.default);
//conectar DB
//mongodb://user:pawword@host:port/db     generalmente host=localhost, port=27017, test db by default, user: usuario con permisos de lectura y escritura
//con usuario administrador
//mongoose.connect('mongodb://mongoadmin:mongoadmin@localhost:27017/test',
//con usuario con acceso de lectura y escritura a esa única base de datos (es mejor así)
mongoose_1.default.connect('mongodb://test:test@localhost:27017/test', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => {
    console.log("ok"),
        (err) => {
            console.log(err);
        };
});
//levantar express
server.start(() => {
    console.log(`Servidor corriendo en puerto ${server.port}`);
});
