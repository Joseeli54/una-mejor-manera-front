export class Tarea {
    _id: string;
    nombre: string;
    descripcion: string;
    idActividad: string;
    idUser: string;

    constructor(_id: string, nombre: string, descripcion: string, idActividad: string, idUser: string) {
      this._id = _id;
      this.nombre = nombre;
      this.descripcion = descripcion;
      this.idActividad = idActividad;
      this.idUser = idUser;
    }
} 