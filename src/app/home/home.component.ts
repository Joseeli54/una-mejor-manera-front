import { Component, OnInit, ElementRef, AfterViewInit, Renderer2} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlertOptions } from 'sweetalert2';
import Swal from 'sweetalert2';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import $ from 'jquery';
import { SwPush } from '@angular/service-worker';
import { UsersService } from '../users/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	public readonly VAPID_PUBLIC_KEY = 'BNiSC8uZYtVccTg-pYMUk2WNFZ5UfPAmfYzEK7OpbJCkkT0-R5h-H0YPRKXKCI0_CwtB5y48T0LKaoiXIjVraow';  
	public httpOption : any;
	public username : any;
	public bLogger = false;
	public role : any;

	constructor(private router: Router,
				private swPush: SwPush,
				private service: UsersService) {
					this.subscribeToNotifications();
				}

	ngOnInit() {
	    console.log("Probandeishon 2.0")
	    var rol = localStorage.getItem('role');
	    var email = localStorage.getItem('email');

	    this.role = rol;
	    
	    if (!isNullOrUndefined(rol) && !isNullOrUndefined(email)) {
	      	this.bLogger = true;
	      	this.username = localStorage.getItem('username');
	    }else{
	    	this.router.navigate(['/'], { replaceUrl: true });
	    }

	}

	subscribeToNotifications(): any {
		if(this.getCookie('endpoint') == '' || 
			this.getCookie('p256dh') == '' || 
			this.getCookie('auth') == ''){

			this.swPush.requestSubscription({
				serverPublicKey: this.VAPID_PUBLIC_KEY
			}).then( sub => {
				const token = JSON.parse(JSON.stringify(sub));
				
				let data = {
					"token" : token
				}
				
				this.service.postUrl('tokens', data).then(response => {
					this.setCookie('endpoint', token.endpoint, 365);
					this.setCookie('p256dh', token.keys.p256dh, 365);
					this.setCookie('auth', token.keys.auth, 365);
					console.log(response);
				}).catch(err => {
					console.log(err)
				});

			}).catch(err => console.error('UPS :(', err));

		}
	}
	
	public setCookie(cname, cvalue, exdays) {
		const d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		let expires = "expires="+ d.toUTCString();

		//Elimino la cookie anterior
		let lastexpires = "expires=Thu, 01 Jan 1970 00:00:00 UTC";
		document.cookie = cname + "=" + cvalue + ";" + lastexpires + ";path=/";

		//Inserto la nueva cookie
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}

	public getCookie(cname) {
		let name = cname + "=";
		let decodedCookie = decodeURIComponent(document.cookie);
		let ca = decodedCookie.split(';');
		for(let i = 0; i <ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}

	public logout(){
		localStorage.removeItem('token');
		localStorage.removeItem('email');
		localStorage.removeItem('role');
		localStorage.removeItem('username');
		localStorage.removeItem('avatar');
		localStorage.setItem('isLoggedIn', "false");  

		this.router.navigate(['/'], { replaceUrl: true });
	}

	public Gotoprofile(){

		var URL = '/home/myprofile/'+localStorage.getItem('username');

		$('#navbarNav').removeClass('show');
		this.router.navigate([URL]);
	}

	public Gotopost(){
		$('#navbarNav').removeClass('show');
		this.router.navigate(['/home/post'], { replaceUrl: true });
	}

	public Gotoactivities(){
		$('#navbarNav').removeClass('show');
		this.router.navigate(['/home/activities']);
	}

	public Gototasks(){
		$('#navbarNav').removeClass('show');
		this.router.navigate(['/home/task']);
	}

	public Gotostatistics(){
		$('#navbarNav').removeClass('show');
		this.router.navigate(['/home/graphics']);
	}

}