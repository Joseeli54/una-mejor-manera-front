import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'projectService';


  constructor(
 	private _http: HttpClient
  ){

  	// let data = {"name":"Jose", 
			// 	"lastname": "Barrientos", 
			// 	"email": "barrientosjoseelias@hotmail.com", 
			// 	"telephone": "04142398425",
			// 	"comment": "Hello it's me you looking for"};

  	// this._http.post('http://localhost:3000/users', data, 
  	// 	{
  	// 		headers: new HttpHeaders({
			// 	    'Content-Type':  'application/json'
			// 	  })
  	// 	}).subscribe(
  	// 	data => console.log(data),
  	// 	(err: HttpErrorResponse) => {
  	// 		console.log("Ha ocurrido un error de red");
  	// 		console.log(err.message);
  	// 	},
  	// 	() => console.log("Peticion Finalizada")
  	// )
  }

}
