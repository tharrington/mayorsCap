

import { Injectable } from '@angular/core';
import { Plugins, App } from '@capacitor/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

const { 
  Storage, 
  Platform
} = Plugins;

import { Observable, throwError, from } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';


//576810726544

/**
 * MayorData Service
 * @author Tyler Harrington - tyler@kinetik.tech
 * @description   This is the starting point for all data operations. It uses Ionic 2's storage mechanism with smartly chooses
 *                what storage options are available based on the platform running the application. The general pattern:
 *                    1. Query the local database for object
 *                    2. If it exists, return the records 
 *                    3. Query Online (salesforce) API
 *                    4. Upsert local records
 *                    5. If changes exist, return to calling component
 */
@Injectable({
  providedIn: 'root'
})
export class MayorDataService {
  data: any;
  token : string;
  full_token : any;
  is_developer : boolean = false;  
  tutorialPage : any;

  constructor(
    public http: HttpClient,
    public nativeHttp : HTTP,
    private router: Router
  ) 
  { 
    this.findToken();

    this.querySf('leadership', 'GET', false, null);
    this.querySf('mayors', 'GET', false, null);
    this.querySf('resolutions', 'GET', false, null);

  }

  setToken(token : any) {
    this.token = token.access_token;
    this.full_token = token;
  }

  async findToken() {
    const { value } = await Storage.get({ key: 'token' });
    if(value) {
      this.setToken(JSON.parse(value));
    }
  }


  async getSFToken() {
    const ret = await Storage.get({ key: 'token' });
    const user = JSON.parse(ret.value);
  }

  async querySf(object: string, method: string, auth_required: boolean, body: any) {
    try {
      let endpoint = this.getBaseURL() + object;
      const params = {};
      let headers = {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
        'Content-Type' : 'application/json'
      };

      if(this.token && auth_required) {
        headers['Authorization'] = 'Bearer ' + this.token;
        headers['x-csrf-token'] = '_csrf';
      } else if(!this.token && auth_required) {
        
      }

      let response;
      if(method === 'GET') {
        response = await this.nativeHttp.get(endpoint, params, headers);
      } else if(method === 'POST') {
        this.nativeHttp.setDataSerializer('json');
        response = await this.nativeHttp.post(endpoint, body, headers);
      } else if(method === 'PUT') {
        this.nativeHttp.setDataSerializer('json');
        response = await this.nativeHttp.put(endpoint, body, headers);
      } else if(method === 'DELETE') {      
        endpoint = endpoint + '/' + body;
        response = await this.nativeHttp.delete(endpoint, params, headers);
      }
      return JSON.parse(response.data);
    } catch (error) {
      console.error('### err status: ' + error.status);
      console.error('### err: ' + error.error); // Error message as string
      console.error('### err headers: ' + JSON.stringify(error.headers));
      if(error.status == 401 || error.status == 403) {
        return this.refreshToken(this.full_token.refresh_token, object, method, auth_required, body);
      }
    }
  }

  /**
   * Get social posts from heroku
   */ 
  async getSocialPosts() { 
    try {
      let endpoint = 'https://usmayors-org.herokuapp.com/allSocialPosts';
      let headers = {
        'Content-Type' : 'application/json'
      };

      let response;
      response = await this.nativeHttp.get(endpoint, {}, headers);
      return JSON.parse(response.data);
    } catch (error) {
      console.error('### err status: ' + error.status);
      console.error('### err: ' + error.error); // Error message as string
      console.error('### err headers: ' + error.headers);

    }
  }




   handleQueryError(object: string, method: string, auth_required : boolean, body : any, err : any, endpoint : string) {
    console.log('### query error: ' + endpoint);
    console.log('### err: ' + JSON.stringify(err));
    return this.refreshToken(this.full_token.refresh_token, object, method, auth_required, body);
  }


  refreshToken(refresh_token : string, object: string, method: string, auth_required : boolean, body : any) {
    var appId = this.getAppId();
    let endpoint = this.getRefreshBaseURL();
    let token_body = {
      grant_type : 'refresh_token', 
      client_id : appId, 
      refresh_token : refresh_token
    };

    this.nativeHttp.setDataSerializer('urlencoded');

    let refresh_request = this.nativeHttp.post(endpoint, token_body, {})
      .then(data => {
        let new_token = JSON.parse(data.data);
        new_token.refresh_token = refresh_token;
        Storage.set({ key : 'token', value : JSON.stringify(new_token) });


        this.token = new_token.access_token;
        this.full_token = new_token;

        this.setToken(new_token);
        // redo the failed query
        return this.querySf(object, method, auth_required, body);
      })
      .catch(error => {
        // if this errors, go back to tutorial page.
        // this.app.getRootNav().setRoot(this.tutorialPage);
        this.router.navigate([''], null);
        console.log('### error');
        console.log('### GOT  REFRESH ERROR: ' + JSON.stringify(error));
      });

  }

  /**
   * Write to calendar
   */
  // addToCalendar(session : any, meeting : any) {
  //   let start_date = moment.utc(session.Session_Start_Time__c).toDate();
  //   let end_date = moment.utc(session.Session_End_Time__c).toDate();

  //   this.storage.get('saveToDeviceCalendar').then((val) => {
  //     if(val) {
  //       this.calendar.createEvent(session.Name, '', session.Session_Abstract__c, start_date, end_date).then(
  //         (result) => {
  //           console.log('### calendar result: ' + JSON.stringify(result));
  //         }); 
  //     }
  //   });
  // }

  // removeFromCalendar(session : any,  meeting : any) {
  //   let start_date = moment.utc(session.Session_Start_Time__c).toDate();
  //   let end_date = moment.utc(session.Session_End_Time__c).toDate();
    
  //   this.storage.get('token').then((val) => {
  //     if(val) {
  //       this.calendar.deleteEventFromNamedCalendar(session.Name, '', session.Session_Abstract__c, start_date, end_date, 'USCM Calendar').then(
  //         (result) => {
  //           console.log('### calendar result: ' + JSON.stringify(result));
  //         }); 
  //     }
  //   });
  // }

  getAppId() {
    if(this.is_developer) {
      return '3MVG9pHRjzOBdkd8xU6Dxo9qLhtG1iUfd1yCVbhByUY1aWY.mst8ITvIXvnTTrApqRldycoqHkWJfEhqjtki5';
    } else {
      return '3MVG9KI2HHAq33RxF7ja4vqKUzJf7IIaNUnhLaq3kUokYYmrH4IcI22JEUvyI1hcXi17reeaIs3m4Mr0L5jtS';
    }
  }
  /**
   *
   */
  getBaseURL() {
    if(this.is_developer) {
      return 'https://dev-usmayors-org.cs26.force.com/services/apexrest/v1/';
    } else {
      return 'https://usmayors-org.force.com/services/apexrest/v1/'
    }
  }

  getURL() {
    if(this.is_developer) {
      return 'https://dev-usmayors-org.cs26.force.com/';
    } else {
      return 'https://usmayors-org.force.com/'
    }
  }

  getRefreshBaseURL() {
    if(this.is_developer) {
      return 'https://dev-usmayors-org.cs26.force.com/services/oauth2/token';
    } else {
      return 'https://usmayors-org.force.com/services/oauth2/token'
    }
  }


}
