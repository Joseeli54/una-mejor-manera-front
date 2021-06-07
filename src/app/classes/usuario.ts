export class Usuario {
    _id: string;
    nombre: string;
    apellido: string;
    username: string;
    email: string;
    telefono: string;
    password: string;
    role: string;
    avatar: string;
    puesto: string;
    fullname: string;

    constructor(_id: string, nombre: string, apellido: string, username: string, 
                email: string, telefono: string, password: string, role: string, avatar:string, puesto: string) {
      this._id = _id;
      this.nombre = nombre;
      this.apellido = apellido;
      this.username = username;
      this.email = email;
      this.telefono = telefono;
      this.password = password;
      this.role = role;
      this.avatar = avatar;
      this.puesto = puesto;
    }
} 