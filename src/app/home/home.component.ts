import { Component, OnInit, ElementRef, AfterViewInit, Renderer2} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
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

	constructor(private router: Router) {}

	ngOnInit() {
	    
	    var rol = localStorage.getItem('role');
	    var email = localStorage.getItem('email');
	    
	    if (!isNullOrUndefined(rol) && !isNullOrUndefined(email)) {
	      	this.bLogger = true;
	      	this.username = localStorage.getItem('username');
	      	this.router.navigateByUrl('home/post');
	    }else{
	    	this.router.navigateByUrl('login');
	    }

	}

	public logout(){
		localStorage.removeItem('token');
  	localStorage.removeItem('email');
  	localStorage.removeItem('role');
  	localStorage.removeItem('username');
  	localStorage.removeItem('avatar');
  	localStorage.setItem('isLoggedIn', "false");  

    this.router.navigateByUrl('/login');
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