import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users/users.service';
import { ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Session } from '../core/model/session.model';
import { Usuario } from '../core/model/usuario.model';
import { isNullOrUndefined } from 'util';
import { SweetAlertOptions } from 'sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  idUser: string;
  password: string;
  private localStorageService;
  private currentSession : Session = null;

  constructor(private router: Router, 
              private route: ActivatedRoute,
              private _formBuilder: FormBuilder,
              public userService: UsersService) {
    this.localStorageService = localStorage;
    this.currentSession = this.loadSessionData();
  }

  ngOnInit() {

      var rol = localStorage.getItem('role');
      var email = localStorage.getItem('email');
      if (!isNullOrUndefined(rol) && !isNullOrUndefined(email)) {
        this.router.navigate(['/home']);
      }
  }

  login() {
    let data;

    if(this.idUser.indexOf('@') !== -1){
      data = {
        "email": this.idUser,
        "password": this.password,
      };
    }else{
      data = {
        "username": this.idUser,
        "password": this.password,
      };
    }

    this.userService
      .postUrl('login', data)
      .then(response => {
              console.log("Login successful");  
              
              localStorage.setItem('isLoggedIn', "true"); 
              localStorage.setItem('token', response.token);
              localStorage.setItem('email', response.usuario.email);
              localStorage.setItem('username', response.usuario.username);
              localStorage.setItem('role', response.usuario.role);
              localStorage.setItem('avatar', response.usuario.avatar);

              this.messageSuccessfully();

            })
      .catch(data =>{
              this.errorOcurred(data.error.err.message)
      });
    
  }

  private messageSuccessfully() {
    let config: SweetAlertOptions = {
      title: 'Su sesión se esta iniciando...',
      type: 'success',
      showConfirmButton: false,
      timer: 2500
    };

    Swal.fire(config).then(result => {
      this.router.navigateByUrl('/home');
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

  setCurrentSession(session: Session): void {
    this.currentSession = session;
    this.localStorageService.setItem('currentUser', JSON.stringify(session));
  }

  loadSessionData(): Session{
    var sessionStr = this.localStorageService.getItem('currentUser');
    return (sessionStr) ? <Session> JSON.parse(sessionStr) : null;
  }

  getCurrentSession(): Session {
    return this.currentSession;
  }

  removeCurrentSession(): void {
    this.localStorageService.removeItem('currentUser');
    this.currentSession = null;
  }

  getCurrentUser(): Usuario {
    var session: Session = this.getCurrentSession();
    return (session && session.user) ? session.user : null;
  };

  isAuthenticated(): boolean {
    return (this.getCurrentToken() != null) ? true : false;
  };

  getCurrentToken(): string {
    var session = this.getCurrentSession();
    return (session && session.token) ? session.token : null;
  };

  logout(): void{
    this.removeCurrentSession();
    this.router.navigate(['/login']);
  }

}
