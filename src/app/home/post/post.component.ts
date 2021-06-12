import { Component, OnInit, ElementRef, AfterViewInit, Renderer2} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';
import { UsersService } from '../../users/users.service';
import { Publicacion } from "../../classes/publicacion";
import { Usuario } from "../../classes/usuario";
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import { HttpClient , HttpHeaders} from  '@angular/common/http';
import $ from 'jquery';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  
  public propertyForm: FormGroup;
  public closeResult: string;
  public modalReference: any;
  public username : any;
  public role : any;
  public descriptionPut : any;
  public idPut : any;
  public imagePut : any;
  public publicaciones : Publicacion[] = []
  public usuarios : Usuario[] = []
  public archivo : any = [];
  public part : any = 5;
  public urlPreview : any = '';

  constructor(private modalService: NgbModal, private _formBuilder: FormBuilder, 
  			  private service: UsersService, private router: Router, private  httpClient:  HttpClient) {
	}

	ngOnInit() {

		this.username = localStorage.getItem('username');
		this.role = localStorage.getItem('role');
			
		this.createForm();
	  this.getPublicacion();

	  const onScroll = () => {

	    console.log(this.part + ' < ' + this.publicaciones.length)

	   if(this.part <= this.publicaciones.length){
			 if (document.body.scrollHeight - window.innerHeight - 500 <= window.scrollY) {
			   // hacer fetch
			   console.log('estoy en el final del scroll')
			   this.masPublicaciones();
			 }
		 }

		}

		window.addEventListener('scroll', onScroll)
	}

	open(content, id : any, description : any, imagen : any) {
	  this.idPut = id;
	  this.descriptionPut = description;

	  if(imagen !== undefined && imagen !== ''){
	  	this.urlPreview = imagen;
	  }

	  this.modalReference = this.modalService.open(content, { size: 'lg', centered: true});

	  this.modalReference.result.then((result) => {
		  this.closeResult = `Closed with: ${result}`;
	  }, (reason) => {
	  	this.clickEliminarImagen();
	  	this.limpiarInputDescription();
		  this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
	  });
	}

	openImage(content, id : any, image : any, description : any){
		this.idPut = id;
		this.imagePut = image;
	  this.descriptionPut = description;

	  this.modalReference = this.modalService.open(content, { size: 'lg', centered: true });

	  this.modalReference.result.then((result) => {
		  this.closeResult = `Closed with: ${result}`;
	  }, (reason) => {
	  	this.clickEliminarImagen();
		  this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
	  });
	}

	public getHeightImagePost(id): any{
			return $('#imagen-post-'+id).height();
	}

	public getWidthImagePost(id): any{
			return $('#imagen-post-'+id).width();
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

  public clickInsertarImagen(){
    $('#imagen').click();
  }

  public clickInsertarImagenPut(){
    $('#imagenPut').click();
  }

  public clickEliminarImagen(){

  	var inputImage = <HTMLInputElement> document.getElementById('imagen');
  	var inputImagePut = <HTMLInputElement> document.getElementById('imagenPut');

  	if(inputImage !== null){
  		 inputImage.value = '';
  	}	

  	if(inputImagePut !== null){
  		 inputImagePut.value = '';
  	}

  	this.archivo = [];
  	this.urlPreview = '';
  }

  public limpiarInputDescription(){
  	this.propertyForm.get('Comentarios').setValue("");
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

	public getPublicacion(){

		this.service.getUrl('publicaciones/part/{cont}', [this.part])
	    .then(data => { 
	    	
	    	this.service.getUrl('users')
	    	.then(data2 => { 

					this.publicaciones = data;
					this.usuarios = data2;

					for(var i=0; i < this.usuarios.length; i++){
						for(var j=0; j < this.publicaciones.length; j++){
							if(this.usuarios[i].username == this.publicaciones[j].idUser){
								this.publicaciones[j].avatar = this.usuarios[i].avatar;
							}
						}
					}

					//this.publicaciones.sort().reverse();
					
				})
				.catch(data =>{});
	    
	    })
	    .catch(data =>{});
	}

	public setPublicaciones(){

		let time = this.getDateToday();

		if(this.urlPreview !== ''){
			const formularioImagen = new FormData();
	    formularioImagen.append('file', this.archivo);
	    formularioImagen.append('upload_preset', 'imagen');

	    $('#publicar_button').html("<li class='fa fa-spinner fa-spin fa-1x'> </li>");

	    this.httpClient.post(`https://api.cloudinary.com/v1_1/ucab/image/upload`, formularioImagen).subscribe( 
	    (response: any) => {

	    			console.log(response)

						let data = {
							"descripcion": this.propertyForm.get('Comentarios').value,
							"idUser": localStorage.getItem('username'),
							"time" : time,
							"imagen" : response.secure_url
						};

						$('#publicar_button').html("Publicar");

						this.service.postUrl('publicaciones', data)
						.then(response => {
							console.log(response._id)
									if(response._id !== undefined){
										this.modalReference.close();
										this.getPublicacion();
									}
					    })
					    .catch(data =>{
					        console.log(data.error)
					    });
			});
		}else{

			let data = {
							"descripcion": this.propertyForm.get('Comentarios').value,
							"idUser": localStorage.getItem('username'),
							"time" : time,
							"imagen" : ''
						};

			this.service.postUrl('publicaciones', data)
			.then(response => {
				console.log(response._id)
						if(response._id !== undefined){
							this.modalReference.close();
							this.getPublicacion();
						}
		    })
		    .catch(data =>{
		        console.log(data.error)
		    });
		}
	}

	public deletePublicacion(id){

		this.service.deleteUrl('publicaciones/{id}', [id])
		.then(data => { 
	    	this.getPublicacion(); 
	    })
	    .catch(data =>{});
	}

	public putPublicacion(id){

		let time = this.getDateToday();

		if(this.urlPreview !== ''){

			const formularioImagen = new FormData();
	    formularioImagen.append('file', this.archivo);
	    formularioImagen.append('upload_preset', 'imagen');

	    $('#cambiar_img_button').html("<li class='fa fa-spinner fa-spin fa-1x'> </li>");

	    this.httpClient.post(`https://api.cloudinary.com/v1_1/ucab/image/upload`, formularioImagen).subscribe( 
	    (response: any) => {

	    		let data = {
						"descripcion": this.descriptionPut,
						"time" : time,
						"imagen" : response.secure_url
					};

					$('#cambiar_img_button').html("Cambiar");

					this.service.putUrlFiles('publicaciones/{id}', data, [id])
					.then(response => {
							console.log(response._id)
							if(response._id !== undefined){
								this.modalReference.close();
								this.getPublicacion();
							}
				    })
				    .catch(data =>{
				        console.log(data.error)
				    });

	  	});
	  }else{

	  			let data = {
						"descripcion": this.descriptionPut,
						"time" : time,
						"imagen" : ''
					};

	  }
	}

	public createForm() {
	    this.propertyForm = this._formBuilder.group({
	    	Comentarios: ['', Validators.required]
	    });
	}

	public masPublicaciones(){
		this.part = this.part + 5;
		this.getPublicacion();
	}

}
