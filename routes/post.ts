
import { Router, Response } from 'express';
import { verificaToken } from '../middlewares/authentication';
import { Post } from '../models/post.model';
import { FileUpload } from '../interfaces/file-upload';
import FileSystem from '../classes/file-system';

const postRoutes = Router();
const fileSystem = new FileSystem();

//obtener POST paginados
postRoutes.get('/', async  (req: any, res: Response) => {
	let pagina = Number(req.query.pagina) || 1;
	let skip = pagina -1;
	skip = skip * 10;
	const posts = await Post.find()
													.sort({ _id: -1})
													.skip(skip)
													.limit(10)
													.populate('usuario', '-password')
													.exec();
	res.json({
		ok: true,
		pagina,
		posts
	});
});

//crear post
postRoutes.post('/', [verificaToken],  (req: any, res: Response) => {
	const body = req.body;
	body.usuario = req.usuario._id;
	const imagenes = fileSystem.imagenesDeTempHaciaPost(req.usuario._id);
	body.imgs = imagenes;
	Post.create( body ).then( async postDB => {
		await postDB.populate('usuario', '-password').execPopulate(); //'-password' para que la contraseña no aparezca en el json del usuario
		res.json({
			ok: true,
			post: postDB
		});
	}).catch(err => {
		res.json({
			ok: false,
			err
		});
	});
});

//Servicio para subir archivos
postRoutes.post('/upload', [verificaToken], async (req: any, res: Response) => {
	if(!req.files){
		return res.status(400).json({
			ok: false,
			mensaje: 'No se subió ningún archivo'
		});
	}
	const file: FileUpload = req.files.image;
	if(!file){
		return res.status(400).json({
			ok: false,
			mensaje: 'No se subió ningún archivo tipo image'
		});
	}
	if(!file.mimetype.includes('image')){
		return res.status(400).json({
			ok: false,
			mensaje: 'Lo que subió no es una imágen'
		});
	}
	await fileSystem.guardarImagenTemporal(file, req.usuario._id);
	res.json({
		ok: true,
		file: file.mimetype
	});
});

//servicio para mostrar imágenes por url
postRoutes.get('/imagen/:userid/:img', (req: any, res: Response) => {
	const userId = req.params.userid;
	const img = req.params.img;
	const pathFoto = fileSystem.getFotoUrl(userId, img);
	res.sendFile(pathFoto);
});


export default postRoutes;
