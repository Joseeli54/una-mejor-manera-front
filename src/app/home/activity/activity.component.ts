import { Component, OnInit, ElementRef, AfterViewInit, Renderer2} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';
import { UsersService } from '../../users/users.service';
import { Actividad } from "../../classes/actividad";
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {

	public propertyForm: FormGroup;
	public closeResult: string;
	public modalReference: any;
	public modalReference2: any;
	public username : any;
	public role : any;
	public activity : any;
	public actividades : Actividad[] = []

	public nombrePut : any;
	public descripcionPut : any;
	public tipoPut : any;
	public fechaPut : any;
	public startTimePut : any;
	public endTimePut : any;
	public idPut : any;


	constructor(private modalService: NgbModal, private modalService2: NgbModal, private _formBuilder: FormBuilder, 
				  private service: UsersService, private router: Router) {}

	ngOnInit() {

		this.username = localStorage.getItem('username');
		this.role = localStorage.getItem('role');
		this.createForm();
		this.getActividad();
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

	editActivity(content, id : any, nombre : any, descripcion : any, 
				tipo : any, fecha : any, startTime : any, endTime : any){

		this.modalReference2.close();

		this.idPut = id;
		this.nombrePut = nombre;
		this.descripcionPut = descripcion;
		this.tipoPut = tipo;
		this.fechaPut = fecha;
		this.startTimePut = startTime;
		this.endTimePut = endTime;

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

	getActividad(){
		this.service.getUrl('actividades')
		.then(data => { 
			this.actividades = data;

			for (var i = 0; i < this.actividades.length; ++i) {
				this.actividades[i].fecha = this.actividades[i].fecha.split("T")[0];
			}
		})
		.catch(data =>{});
	}

	setActividad(){

		let time = this.getDateToday();

		let data = {
			"nombre": this.propertyForm.get('Nombre').value,
			"descripcion": this.propertyForm.get('Descripcion').value,
			"tipo": this.propertyForm.get('Tipo').value,
			"fecha": this.propertyForm.get('Fecha').value,
			"startTime": this.propertyForm.get('StartTime').value,
			"endTime": this.propertyForm.get('EndTime').value,
			"createBy": this.username,
			"time": time
		};

		this.service.postUrl('actividades', data)
		.then(response => {
			console.log(response)
			if(response._id !== undefined){
				this.modalReference.close();
				this.getActividad();
			}
	    })
	    .catch(data =>{
	        console.log(data.error)
	    });
	}

	putActividad(id){

		let time = this.getDateToday();

		let data = {
			"nombre": this.nombrePut,
			"descripcion": this.descripcionPut,
			"tipo": this.tipoPut,
			"fecha": this.fechaPut,
			"startTime": this.startTimePut,
			"endTime": this.endTimePut,
			"time": time
		};

		this.service.putUrl('actividades/{id}', data, [id])
		.then(response => {
			console.log(response._id)
			if(response._id !== undefined){
				this.modalReference.close();
				this.getActividad();
			}
	    })
	    .catch(data =>{
	        console.log(data.error)
	    });
	}

	deleteActividad(id){

		this.service.deleteUrl('actividades/{id}', [id])
		.then(data => { 
	    	this.getActividad(); 
	    	this.modalReference2.close();
	    })
	    .catch(data =>{});
	}

	createForm() {
	    this.propertyForm = this._formBuilder.group({
	    	Nombre: ['', Validators.required],
	    	Descripcion: ['', Validators.required],
	    	Tipo: ['', Validators.required],
	    	Fecha: ['', Validators.required],
	    	StartTime: ['', Validators.required],
	    	EndTime: ['', Validators.required]
	    });
	}

	verActividad(content, data : any){
		this.activity = data;

		this.modalReference2 = this.modalService2.open(content, { size: 'lg', centered: true });

		this.modalReference2.result.then((result) => {
		  this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
		  this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});
	}

}
