import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users/users.service';
import { SweetAlertOptions } from 'sweetalert2';
import { ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  nombre: string;
  apellido: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  telefono: string;
  role: string;
  puesto: string;
  urlPreview: any = '';;
  public archivo : any = [];
	
  passwordError: boolean;
  bSend = false;

  constructor(public userService: UsersService, private router: Router) {}

  ngOnInit() {
    this.role = "USER";
  }

  public capturarImagen(event){
    const archivoEncontrado = event.target.files[0];
    this.archivo = archivoEncontrado;

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event: ProgressEvent) => {
        this.urlPreview = (<FileReader>event.target).result;
      }

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  public clickEliminarImagen(){

    var inputAvatar = <HTMLInputElement> document.getElementById('avatar');

    if(inputAvatar !== null){
       inputAvatar.value = '';
    }

    this.archivo = [];
    this.urlPreview = '';
  }

  public register() {

    const Formulario = new FormData();

    Formulario.append('nombre', this.nombre);
    Formulario.append('apellido', this.apellido);
    Formulario.append('username', this.username);
    Formulario.append('email', this.email);
    Formulario.append('telefono', this.telefono);
    Formulario.append('password', this.password);
    Formulario.append('role', this.role);
    Formulario.append('avatar', this.archivo);
    Formulario.append('puesto', this.puesto);

    this.userService
	    .postUrlFiles('register', Formulario)
	    .then(response => {
				   this.bSend = true;
           this.messageSuccessfully();
           this.router.navigate(['/login']);
	    })
	    .catch(data =>{
           this.errorOcurred(data.error.err.message)
	    });
    }

  private messageSuccessfully() {
    let config: SweetAlertOptions = {
      title: 'Usuario registrado satisfactoriamente',
      type: 'success',
      showConfirmButton: false,
      timer: 2500
    };

    Swal.fire(config).then(result => {
    });
  }
  
  private errorOcurred(message) {
    let config: SweetAlertOptions = {
      title: message,
      type: 'error',
      showConfirmButton: true
    };

    Swal.fire(config).then(result => {
    });
  }
}
