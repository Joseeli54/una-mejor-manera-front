import { Component, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';
import { UsersService } from '../../users/users.service';
import Swal from 'sweetalert2';
import $ from 'jquery';

@Component({
  selector: 'app-graphics',
  templateUrl: './graphics.component.html',
  styleUrls: ['./graphics.component.css']
})
export class GraphicsComponent implements OnInit {

  //////////////// Vertical Bar Chart options ///////////////////////
  single: any = [];
  multi: any[];
  view: any[] = [window.innerWidth/1.3, 280];
  showXAxis = true;                          //////////////////////
  showYAxis = true;                         /////////////////////
  gradient = false;                        ////////////////////
  showLegend = false;                     ///////////////////
  showXAxisLabel = true;                 //////////////////
  xAxisLabel = '';                      /////////////////
  showYAxisLabel = true;               ////////////////
  yAxisLabel = 'Cantidad por Región'; ///////////////


  ////////////// Pie Chart ////////////////////////////////////  
  single2: any = [];
  view2: any[] = [window.innerWidth/1.3, 280];
  gradient2: boolean = true;            ////////////////////
  showLegend2: boolean = true;         ///////////////////
  showLabels: boolean = true;         ///////////////////
  isDoughnut: boolean = false;       ///////////////////
  legendPosition: string = 'below'; ///////////////////

  ////////////// Pie Chart ////////////////////////////////////  
  single3: any = [];
  view3: any[] = [window.innerWidth/1.3, 280];
  gradient3: boolean = true;            ////////////////////
  showLegend3: boolean = true;         ///////////////////

  ///////////// Top User with Tasks //////////////////////////
  single4: any = [];

  ///////////// Top Activities with Tasks //////////////////////////
  single5: any = [];

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(private service: UsersService,) {
    Object.assign(this, this.single)
    Object.assign(this, this.single2)
    Object.assign(this, this.single3)
  }

  ngOnInit() {
    this.getUsersByRegion();

  }

  public getUsersByRegion(){

     this.service.getUrl('users/countByStatus')
        .then(data => { 
            console.log(data)
            this.single = data;
            this.getTasksByStatus();
        })
        .catch(data =>{});
  }

  public getTasksByStatus(){

     this.service.getUrl('tareas/countByStatus')
        .then(data => { 
            console.log(data)
            this.single2 = data;
            this.getActivityByStatus();
        })
        .catch(data =>{});
  }

  public getActivityByStatus(){

     this.service.getUrl('actividades/countByStatus')
        .then(data => { 
            console.log(data)
            this.single3 = data;
            this.getTopUsersByTasks();
        })
        .catch(data =>{});
  }

  public getTopUsersByTasks(){

     this.service.getUrl('users/TopUsersByTask')
        .then(data => { 
            console.log(data)
            this.single4 = data;
            this.getTopActivitiesByTasks();
        })
        .catch(data =>{});
  }

  public getTopActivitiesByTasks(){

     this.service.getUrl('actividades/TopActivitiesByTask')
        .then(data => { 
            console.log(data)
            this.single5 = data;
        })
        .catch(data =>{});
  }

  onResize(event) {
      this.view = [event.target.innerWidth / 1.3, 280];
      this.view2 = [event.target.innerWidth / 1.3, 280];
      this.view3 = [event.target.innerWidth / 1.3, 280];
  }

  onSelect(event) {
    console.log(event);
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

}
