
import Server from './classes/server';
import userRoutes from './routes/usuario';
import postRoutes from './routes/post';

import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';

const server = new Server();


//configurar CORS
server.app.use(cors({origin: true, credentials: true}));

//Body parser
server.app.use( bodyParser.urlencoded({extended: true}) );
server.app.use( bodyParser.json() );

// FileUpload
server.app.use(fileUpload({ useTempFiles: true }));

//rutas de mi aplicación
server.app.use('/user', userRoutes);
server.app.use('/posts', postRoutes);

//conectar DB
//mongodb://user:pawword@host:port/db     generalmente host=localhost, port=27017, test db by default, user: usuario con permisos de lectura y escritura
//con usuario administrador
//mongoose.connect('mongodb://mongoadmin:mongoadmin@localhost:27017/test',
//con usuario con acceso de lectura y escritura a esa única base de datos (es mejor así)
mongoose.connect('mongodb://test:test@localhost:27017/test',
								{
									useNewUrlParser: true,
									useCreateIndex: true,
									useFindAndModify: false,
									useUnifiedTopology: true
								},).then( () => {
									console.log("ok"),
									(err: any) => {
									console.log(err) }
								});

//levantar express
server.start(() => {
    console.log(`Servidor corriendo en puerto ${server.port}`);
});
