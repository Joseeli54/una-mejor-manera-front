import { Component, OnInit, ElementRef, AfterViewInit, Renderer2} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlertOptions } from 'sweetalert2';
import Swal from 'sweetalert2';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	public httpOption : any;
	public username : any;
	public bLogger = false;
	public role : any;

	constructor(private router: Router) {}

	ngOnInit() {
	    
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
		this.router.navigate([URL], { replaceUrl: true });
	}

	public Gotopost(){
		$('#navbarNav').removeClass('show');
		this.router.navigate(['/home/post'], { replaceUrl: true });
	}

	public Gotoactivities(){
		$('#navbarNav').removeClass('show');
		this.router.navigate(['/home/activities'], { replaceUrl: true });
	}

	public Gototasks(){
		$('#navbarNav').removeClass('show');
		this.router.navigate(['/home/task'], { replaceUrl: true });
	}

	public Gotostatistics(){
		$('#navbarNav').removeClass('show');
		this.router.navigate(['/home/graphics'], { replaceUrl: true });
	}

}