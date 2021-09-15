
import { Component, ViewChild, ElementRef, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras} from '@angular/router';

import { SearchPipe } from '../core/search.pipe';

import { MayorDataService } from '../api/mayor-data.service';
import { Plugins } from '@capacitor/core'; 
const { Storage } = Plugins;
import * as moment from 'moment';

@Component({
  selector: 'app-sessions-detail',
  templateUrl: './sessions-detail.page.html',
  styleUrls: ['./sessions-detail.page.scss'],
})
export class SessionsDetailPage implements OnInit {
  session : any = {};
  meeting : any = {};
  segments : any = [];
  sessionId : string;
  links : any = [];
  resolutions : any = [];

  constructor(
    public mayorData : MayorDataService,
    private activatedRoute : ActivatedRoute,
    private router : Router
  ) {
    
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.sessionId = this.router.getCurrentNavigation().extras.state.sessionId;

        if(this.router.getCurrentNavigation().extras.state.session) {
          this.session = this.router.getCurrentNavigation().extras.state.session; 
          this.segments = this.router.getCurrentNavigation().extras.state.segments;
          console.log('### session111: ' + JSON.stringify(this.session));
          if(this.session && this.session.LWEV_Links__r) {
            this.links = this.session.LWEV_Links__r.records;
          }
          this.sortResolutions();
        } else {
          this.mayorData.querySf('segments', 'GET', true, null).then((sessions) => {
            for(let session of sessions['sessions']) {
              if(this.sessionId == session.Id) {
                this.session = session;
                this.links = session.LWEV_Links__r;
                this.initSession();
                this.sortResolutions();
              }
            }

          });
        }
        
        this.meeting = this.router.getCurrentNavigation().extras.state.meeting;        
      }
    });
  }

  sortResolutions() {

    if(this.session && this.session.Resolution_Related_Sessions__r && this.session.Resolution_Related_Sessions__r.totalSize > 0)  {
      this.resolutions = this.session.Resolution_Related_Sessions__r.records.sort((a,b) =>  a.Resolution__r.Resolution_Number__c - b.Resolution__r.Resolution_Number__c );
    }
  }

  goToLink(link: any) {
    window.open(link.Link_URL__c, '_system', 'location=yes');
    return false;
  }

  async getSessionLocal() {
    const { value } = await Storage.get({ key: 'segments' });
    if(value) {
      for(let session of JSON.parse(value)['sessions']) {
        if(this.sessionId == session.Id) {
          this.session = session;
          this.initSession();
        }
      }
    }
    
  }


  ionViewWillEnter() {
    if(this.sessionId) {
      this.getSessionLocal();
    }
  }

  initSession() {
    this.session.date = moment.utc(this.session.Session_Start_Time__c).add(this.meeting.Event_UTC_Offset_in_Hours__c, 'hours').format("dddd, MMMM Do YYYY");
    this.session.start_time = moment.utc(this.session.Session_Start_Time__c).add(this.meeting.Event_UTC_Offset_in_Hours__c, 'hours').format("h:mm a");
    this.session.end_time = moment.utc(this.session.Session_End_Time__c).add(this.meeting.Event_UTC_Offset_in_Hours__c, 'hours').format("h:mm a");

    if(this.session && this.session.Session_Segments__r) {
      this.segments = this.session.Session_Segments__r.records;
    }
  }


  async loadSessionDetails() {
    const { value } = await Storage.get({ key: 'segments' });
    let segments = JSON.parse(value);
  }

  ngOnInit() {
    this.initSession();
  }

  goToMayorDetail(mayorName) {
    if(!mayorName.Contact) {
      mayorName.Contact = mayorName.Contact__r;
    }
    let state = { mayor: mayorName } ;
    console.log('### going to mayor: ' + JSON.stringify(state));
    let navigationExtras: NavigationExtras = { state: state };
    this.router.navigate(['/tabs/tabs/meetings/mayors/' + mayorName.Id], navigationExtras); 

  }

  goToResolution(resolution: any) {
    console.log('### resolution: ' + JSON.stringify(resolution));
    let navigationExtras: NavigationExtras = { state: { resolution: resolution.Resolution__r, meeting: this.meeting } };
    this.router.navigate(['/tabs/tabs/meetings/resolutions/' + resolution.Id], navigationExtras);
  }

  goToSessionFeedback() {
    

  }

  goToSponsor(sponsor : any) {
  }

  /**
   * Create enrollmenet and push to server
   */
  createEnrollment() {
    let body = { sessionIds : [ this.session.Id ] };

    this.mayorData.querySf('enrollments', 'POST', true, body).then((enrollments) => { 
      this.session.Session_Enrollments__r = {};
    }, (err : any) => {
    });
  }



  /**
   * Remove enrollment
   */  
  removeEnrollment() {

    let body = this.session.Id;
    this.mayorData.querySf('enrollments', 'DELETE', true, body).then((enrollments) => { 
      this.session.Session_Enrollments__r = null;
    }, (err : any) => {
    });
  }

  showLink(theURL : string) {
    if(theURL.indexOf('http://') == -1 && theURL.indexOf('https://') != 0) {
      theURL = 'http://' + theURL;
    } else if(theURL.indexOf('https://') == -1 && theURL.indexOf('http://') != 0) {
      theURL = 'https://' + theURL;

    }
    window.open(theURL, '_system', 'location=yes');
  }

}
