import { Component, OnInit, ElementRef, AfterViewInit, Renderer2} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { UsersService } from '../users/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.css']
})
export class UploadsComponent implements OnInit {

   public formUpload: FormGroup;
   public archivo : any = [];

  constructor(private _formBuilder: FormBuilder, private service: UsersService, private router: Router) {
	}

	ngOnInit() {

		this.createForm();
	}

	capturarImagen(event){
		const archivoEncontrado = event.target.files[0];
		this.archivo = archivoEncontrado;
	}

	setUpload(){

		const Formulario = new FormData();
		
		Formulario.append('image', this.archivo);
		Formulario.append('titulo', this.formUpload.get('titulo').value);
		Formulario.append('descripcion', this.formUpload.get('descripcion').value);

		this.service.postUrlFiles('imagen', Formulario)
		.then(response => {
			console.log(response._id)
			if(response._id !== undefined){
				this.formUpload.get('titulo').setValue("");
				this.formUpload.get('descripcion').setValue("");
			}
	    })
	    .catch(data =>{
	        console.log(data.error)
	    });
	}

	createForm() {
		this.formUpload = this._formBuilder.group({
			titulo: ['', Validators.required],
			descripcion: ['', Validators.required],
			image: ['', Validators.required]
		});
	}

}
