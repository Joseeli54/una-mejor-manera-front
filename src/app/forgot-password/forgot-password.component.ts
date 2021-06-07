import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users/users.service';
import { ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { isNullOrUndefined } from 'util';
import { SweetAlertOptions } from 'sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  idUser: string;
  password: string;

  constructor(private router: Router, 
              private route: ActivatedRoute,
              public userService: UsersService) { }

  ngOnInit() {
  }

  forgotPassword() {
    let data;

    data = {
      "email": this.idUser,
      "subject": "Recuperación de Contraseña",
    };

    this.userService
      .postUrl('mail/forgotPassword', data)
      .then(response => {
              this.emailSendSuccessfully();
            })
      .catch(data =>{
              this.errorOcurred(data.error.message);
      });
    
  }

  private emailSendSuccessfully() {
    let config: SweetAlertOptions = {
      title: 'Acabamos de enviar un mensaje con su nueva contraseña',
      type: 'success',
      showConfirmButton: false,
      timer: 2500
    };

    Swal.fire(config).then(result => {
      this.router.navigateByUrl('/login');
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
