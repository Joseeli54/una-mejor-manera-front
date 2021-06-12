import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users/users.service';
import { HttpClient , HttpHeaders} from  '@angular/common/http';
import { SweetAlertOptions } from 'sweetalert2';
import { ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import Swal from 'sweetalert2';
import $ from 'jquery';

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
  avatar: string;
  estado: string;
  urlPreview: any = '';
  public estados : any = [{'nombre' : 'Caracas'}, {'nombre' : 'Monagas'}, {'nombre' : 'Tachira'}]
  public archivo : any = [];
  
  passwordError: boolean;
  bSend = false;

  constructor(public userService: UsersService, private router: Router, private  httpClient:  HttpClient) {}

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

  public clickInsertarImagen(){
    $('#avatar').click();
  }

  public register() {

    const formularioImagen = new FormData();
    formularioImagen.append('file', this.archivo);
    formularioImagen.append('upload_preset', 'avatars');

    $('#register_button').html("<li class='fa fa-spinner fa-spin fa-1x'> </li>");

    console.log(this.estado)

    if(this.urlPreview !== ''){

        this.httpClient.post(`https://api.cloudinary.com/v1_1/ucab/image/upload`, formularioImagen).subscribe( 
        (response: any) => {

            console.log(response)

            this.avatar = response.secure_url;

            let data = {
                "nombre" :  this.nombre,
                "apellido" :  this.apellido,
                "username" :  this.username,
                "email" :  this.email,
                "telefono" :  this.telefono,
                "password" :  this.password,
                "role" :  this.role,
                "avatar" :  this.avatar,
                "puesto" :  this.puesto,
                "estado" : this.estado
            };

            $('#register_button').html("Registrarse");

            this.userService
              .postUrl('register', data)
              .then(response => {

                   console.log(response);

                   this.bSend = true;
                   this.messageSuccessfully();
                   this.router.navigate(['/login']);
              })
              .catch(data =>{
                   this.errorOcurred(data.error.err.message)
              });

        });
      }else{

            let data = {
                "nombre" :  this.nombre,
                "apellido" :  this.apellido,
                "username" :  this.username,
                "email" :  this.email,
                "telefono" :  this.telefono,
                "password" :  this.password,
                "role" :  this.role,
                "avatar" :  'https://res.cloudinary.com/ucab/image/upload/v1623484253/foto-perfil-defecto_pfsou3.jpg',
                "puesto" :  this.puesto,
                "estado" : this.estado
            };

            $('#register_button').html("Registrarse");

            this.userService
              .postUrl('register', data)
              .then(response => {

                   console.log(response);

                   this.bSend = true;
                   this.messageSuccessfully();
                   this.router.navigate(['/login']);
              })
              .catch(data =>{
                   this.errorOcurred(data.error.err.message)
              });

      }
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
