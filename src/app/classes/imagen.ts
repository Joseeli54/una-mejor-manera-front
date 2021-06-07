export class Imagen {
    _id: string;
    titulo: string;
    descripcion: string;
    imagenPath: string;

    constructor(_id: string, titulo: string, descripcion: string, imagenPath: string) {
      this._id = _id;
      this.titulo = titulo;
      this.descripcion = descripcion;
      this.imagenPath = imagenPath;
    }
} 