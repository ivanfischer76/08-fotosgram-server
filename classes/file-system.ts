import { FileUpload } from '../interfaces/file-upload';
import path from 'path'; //manejo de rutas de node
import fs from 'fs';  //manejo de archivos de node
import uniqid from 'uniqid';  //crea nombres únicos

export default class FileSystem {

	constructor(){ }

	guardarImagenTemporal(file: FileUpload, userId: string) {
		//creamos una nueva promesa para poder trabajarla con async
		return new Promise((resolve, reject) => {
			//crear carpetas
			const path = this.crearCarpetaUsuario(userId);
			//crear nombre de archivo
			const nombreArchivo = this.generarNombreUnico(file.name);
			//mover el archivo del temp a la carpeta
			file.mv(`${path}/${nombreArchivo}`, (err: any) => {
				if(err){
					//si no se pudo mover
					reject(err);
					console.log('reject ', err);
				}else{
					//si se pudo mover
					resolve();
				}
			});
		});
	}

	private crearCarpetaUsuario(userId: string) {
		const pathUser = path.resolve( __dirname, '../uploads', userId);
		const pathUserTemp = pathUser + '/temp';
		const existe = fs.existsSync(pathUser);
		if(!existe){
			fs.mkdirSync(pathUser);
			fs.mkdirSync(pathUserTemp);
		}
		return pathUserTemp;
	}

	private generarNombreUnico(nombreOriginal: string){
		const nombreArr = nombreOriginal.split('.');
		const extension = nombreArr[nombreArr.length -1];
		const idUnico = uniqid();
		return `${idUnico}.${extension}`;
	}

	imagenesDeTempHaciaPost(userId: string){
		const pathTemp = path.resolve( __dirname, '../uploads', userId, 'temp');
		const pathPost = path.resolve( __dirname, '../uploads', userId, 'posts');
		console.log('pathPost ',pathPost);
		if(!fs.existsSync(pathTemp)){
			console.log('no existe pathTemp');
			return [];
		}
		if(!fs.existsSync(pathPost)){
			console.log('no existe pathPost');
			fs.mkdirSync(pathPost);
		}
		const imagenesTemp = this.obtenerImagenesEnTemp(userId);
		imagenesTemp.forEach(imagen => {
			fs.renameSync(`${pathTemp}/${imagen}`,`${pathPost}/${imagen}`);
			console.log('imagenesTemp', imagenesTemp);
		});
		return imagenesTemp;
	}

	private obtenerImagenesEnTemp(userId: string){
		const pathTemp = path.resolve( __dirname, '../uploads', userId, 'temp');
		return fs.readdirSync(pathTemp) || [];
	}

	getFotoUrl(userId: string, img: string){
		//crear path POSTs
		const pathFoto = path.resolve( __dirname, '../uploads', userId, 'posts', img);
		console.log('pathFoto', pathFoto);
		//verificar si la imagen existe
		const existe = fs.existsSync(pathFoto);
		if(!existe){
			return path.resolve( __dirname, '../assets/400x250.jpg');
		}
		return pathFoto;
	}

}
