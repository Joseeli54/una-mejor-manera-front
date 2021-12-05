import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { SwPush } from '@angular/service-worker';
import { Options } from 'selenium-webdriver';
import { environment } from '../environments/environment';
import { UsersService } from './users/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'projectService';
  public readonly VAPID_PUBLIC_KEY = 'BNiSC8uZYtVccTg-pYMUk2WNFZ5UfPAmfYzEK7OpbJCkkT0-R5h-H0YPRKXKCI0_CwtB5y48T0LKaoiXIjVraow';

  constructor(
 	private _http: HttpClient,
	private swPush: SwPush,
  private service: UsersService
  ){
    this.subscribeToNotifications();
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
            
          this.service.postUrl('saveToken', data).then(response => {
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

}
