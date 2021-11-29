import { Component, OnInit, ElementRef, AfterViewInit, Renderer2} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlertOptions } from 'sweetalert2';
import Swal from 'sweetalert2';
import { PlatformLocation } from '@angular/common';
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

	constructor(private router: Router, public locationWindow: PlatformLocation) {

		  		// locationWindow.onPopState(() => {
						// 		location.replace('home/post');
			   //  });
	}

	ngOnInit() {
	    
	    var rol = localStorage.getItem('role');
	    var email = localStorage.getItem('email');

	    this.role = rol;
	    
	    if (!isNullOrUndefined(rol) && !isNullOrUndefined(email)) {
	      	this.bLogger = true;
	      	this.username = localStorage.getItem('username');
	      	//this.router.navigateByUrl('home/post');
	    }else{
	    	this.router.navigateByUrl('/');
	    }

	}

	public logout(){
		localStorage.removeItem('token');
  	localStorage.removeItem('email');
  	localStorage.removeItem('role');
  	localStorage.removeItem('username');
  	localStorage.removeItem('avatar');
  	localStorage.setItem('isLoggedIn', "false");  

    this.router.navigateByUrl('/');
	}

	public Gotoprofile(){

		var URL = '/home/myprofile/'+localStorage.getItem('username');

		$('#navbarNav').removeClass('show');
		this.router.navigateByUrl(URL);
	}

	public collapseHide(){
			$('#navbarNav').removeClass('show');
	}

}