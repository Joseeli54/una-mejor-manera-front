export class Publicacion {
    _id: string;
    descripcion: string;
    idUser: string;
    avatar: string;
    imagen_public_id: string;

    constructor(_id: string, descripcion: string, idUser: string, avatar: string) {
      this._id = _id;
      this.descripcion = descripcion;
      this.idUser = idUser;
      this.avatar = avatar;
    }
} 