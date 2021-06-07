import { Component, OnInit, ElementRef, AfterViewInit, Renderer2} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';
import { UsersService } from '../../users/users.service';
import { Tarea } from "../../classes/tarea";
import { Actividad } from "../../classes/actividad";
import { Usuario } from "../../classes/usuario";
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import { NgSelectModule, NgOption, NgSelectConfig} from '@ng-select/ng-select';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  	public propertyForm: FormGroup;
	public closeResult: string;
	public modalReference: any;
	public modalReference2: any;
	public username : any;
	public role : any;

	public tarea : any;
	public actividad : any;
	public usuario : any;

	public tareas : Tarea[] = []
	public actividades : Actividad[] = []
	public usuarios : Usuario[] = []

	public nombrePut : any;
	public descripcionPut : any;
	public idUserPut : any;
	public nombreUsuario : any;
	public nombreActividad : any;
	public idActividadPut : any;
	public idPut : any;

	constructor(private modalService: NgbModal, private modalService2: NgbModal, private _formBuilder: FormBuilder, 
				  private service: UsersService, private service2: UsersService, private router: Router) {}

	ngOnInit() {
		this.username = localStorage.getItem('username');
		this.role = localStorage.getItem('role');
		this.createForm();
		this.getTarea();
	}

	open(content, id : any, description : any) {
		this.idPut = id;
		this.descripcionPut = description;

		this.modalReference = this.modalService.open(content, { size: 'lg', centered: true});

		this.modalReference.result.then((result) => {
		  this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
		  this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});
	}

	editTarea(content, id : any, nombre : any, descripcion : any, 
				idActividad : any, idUser : any){

		this.modalReference2.close();

		this.getActividadById(idActividad);
		this.getUsuarioById(idUser);

		this.idPut = id;
		this.nombrePut = nombre;
		this.descripcionPut = descripcion;
		this.idUserPut = idUser;
		this.idActividadPut = idActividad;

		this.modalReference = this.modalService.open(content, { size: 'lg', centered: true});

		this.modalReference.result.then((result) => {
		  this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
		  this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});

	}

	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
		  return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
		  return 'by clicking on a backdrop';
		} else {
		  return  `with: ${reason}`;
		}
	}

	getTarea(){
		this.service.getUrl('tareas')
		.then(data => { 
			this.tareas = data;
		})
		.catch(data =>{});
	}

	getActividad(){
		this.service.getUrl('actividades')
		.then(data => { 
			this.actividades = data;			
		})
		.catch(data =>{});
	}

	getUsuario(){
		this.service2.getUrl('users')
		.then(data => { 
			this.usuarios = data;

			for(var i = 0; i < this.usuarios.length; i++){
					this.usuarios[i].fullname = this.usuarios[i].nombre + ' ' + this.usuarios[i].apellido;
			}
		})
		.catch(data =>{});
	}

	getActividadById(id){
		this.service.getUrl('actividades/{id}', [id])
		.then(data => { 
			console.log(data)
			this.nombreActividad = data.nombre;
		})
		.catch(data =>{});
	}

	getUsuarioById(username){
		this.service2.getUrl('users/username/{username}', [username])
		.then(data => { 
			this.nombreUsuario = data.nombre + " " + data.apellido;
		})
		.catch(data =>{});
	}

	private getDateToday(): string{

		var hoy = new Date();
		var fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear();

		if(hoy.getMinutes() < 10){
			var hora = hoy.getHours() + ':0' + hoy.getMinutes() + ':' + hoy.getSeconds();
		}else{
			var hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
		}

		var now = fecha + ' ' + hora;

		console.log(now);

		return now;
	}

	setTarea(){

		let time = this.getDateToday();

		let data = {
			"nombre": this.propertyForm.get('Nombre').value,
			"descripcion": this.propertyForm.get('Descripcion').value,
			"idUser": this.propertyForm.get('idUser').value,
			"idActividad": this.propertyForm.get('idActividad').value,
			"createBy" : this.username,
			"time" : time
		};

		this.service.postUrl('tareas', data)
		.then(response => {
			console.log(response)
			if(response._id !== undefined){
				this.modalReference.close();
				this.getTarea();
			}
    })
    .catch(data =>{
        console.log(data.error)
    });
	}

	putTarea(id){

		let time = this.getDateToday();

		let data = {
			"nombre": this.nombrePut,
			"descripcion": this.descripcionPut,
			"idUser": this.idUserPut,
			"idActividad": this.idActividadPut,
			"time" : time
		};

		this.service.putUrl('tareas/{id}', data, [id])
		.then(response => {
			console.log(response._id)
			if(response._id !== undefined){
				this.modalReference.close();
				this.getTarea();
			}
	    })
	    .catch(data =>{
	        console.log(data.error)
	    });
	}

	deleteTarea(id){

		this.service.deleteUrl('tareas/{id}', [id])
		.then(data => { 
	    	this.getTarea(); 
	    	this.modalReference2.close();
	    })
	    .catch(data =>{});
	}

	createForm() {

		this.getActividad();
		this.getUsuario();

	    this.propertyForm = this._formBuilder.group({
	    	Nombre: ['', Validators.required],
	    	Descripcion: ['', Validators.required],
	    	idUser: [null, Validators.required],
	    	idActividad: [null, Validators.required]
	    });
	}

	verTarea(content, data : any){
		this.tarea = data;

		this.getActividadById(this.tarea.idActividad);
		this.getUsuarioById(this.tarea.idUser);

		this.modalReference2 = this.modalService2.open(content, { size: 'lg', centered: true});

		this.modalReference2.result.then((result) => {
		  this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
		  this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});
	}

}
