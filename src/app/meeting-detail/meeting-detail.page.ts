
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonSearchbar, NavController, PickerController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { PickerOptions } from "@ionic/core";

import { SearchPipe } from '../core/search.pipe';

import { MayorDataService } from '../api/mayor-data.service';
import { Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed } from '@capacitor/core';
const { Storage, PushNotifications } = Plugins;
import * as moment from 'moment';


@Component({
  selector: 'app-meeting-detail',
  templateUrl: './meeting-detail.page.html',
  styleUrls: ['./meeting-detail.page.scss'],
})
export class MeetingDetailPage implements OnInit {
  all_sessions = [];
  meeting_sessions = [];
  sessions = [];
  meeting_dates = [];
  meetings = [];
  meeting_id : any;
  display_dates = [];
  meeting: any = {};
  segments: any;
  selected_index : number;
  enrollments  = [];
  selected_date: string;
  searching  = false;
  has_changed_tab = false;

  searchTerm = '';
  slideHeaderPrevious = 0;
  isBoothMode : boolean = false;
  showSession : boolean = false;
  sessionOptions : any = {};

  constructor(

    public mayorData         : MayorDataService,
    private router           : Router,
    private pickerController : PickerController
  ) {
   
  }
 

  async loadSelectedMeetingId() {
    const { value } = await Storage.get({ key: 'selected_meeting_id' });
    this.meeting_id = value;
    if(this.meeting.Id != this.meeting_id) {
    }
  }

  async loadStoredEvents() {
    const { value } = await Storage.get({ key: 'events2' });
    if(value) {
      this.meetings = JSON.parse(value);
      this.handleMeetings(this.meetings); 
    }
  }

  async loadMeeting() {
    const { value } = await Storage.get({ key: 'meeting' });

    if(value) {
      this.handleMeeting(JSON.parse(value)); 
    }
  }

  async loadStoredSegments() {
    const { value } = await Storage.get({ key: 'segments' });
    let sessions = JSON.parse(value);
    if(sessions && sessions['sessions'] && sessions['sessions'].length > 0) {
      this.segments = sessions['segments'];
      this.handleSessions(sessions['sessions']); 
      this.handleEnrollments();
    }
  }

  doRefresh(event) {
    this.loadSelectedMeetingId();
    this.loadMeeting();
    this.loadStoredEvents();
    this.loadStoredSegments();
    this.getSessionDetails();
    event.target.complete();
  }


  ngOnInit() {
    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermission().then( result => {
      if (result.granted) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
        (token: PushNotificationToken) => {
          // let platform = this.is_ios ? 'apple' : 'android';
          let body = {
            "appId": "uscm15appId-1ll",
            "platform": 'apple',
            "token": token.value
          }
          this.mayorData.querySf('devices', 'POST', true, body).then((devices) => {
          });
          // alert('Push registration success, token: ' + token.value);
        }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
        (error: any) => {
          alert(JSON.stringify(error));
        }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
        (notification: PushNotification) => {
          alert(JSON.stringify(notification.body));
        }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
        (notification: PushNotificationActionPerformed) => {
          alert(JSON.stringify(notification));
        }
    );
  }

  ionViewWillEnter() {

    this.mayorData.findToken();

    this.loadSelectedMeetingId();
    this.loadMeeting();
    this.loadStoredEvents();
    this.loadStoredSegments();
    this.getSessionDetails();
  }

  /**
   * after the modal is dismissed, regen the data
   */
  changeMeeting() {
    let state = { meetings : this.meetings } ;
    let navigationExtras: NavigationExtras = { state: state };    
    this.router.navigate(['/tabs/tabs/meetings/list'], navigationExtras);
  }

  clearAllData() {
    this.all_sessions = [];
    this.sessions = [];
    this.meeting_dates = [];
    this.segments = [];
    this.selected_date = '';
    this.display_dates = [];
  }


  getSessionDetails() {
    this.mayorData.querySf('events2', 'GET', true, null).then((meetings) => { 
      this.meetings = meetings;
      Storage.set({ key: 'events2', value : JSON.stringify(meetings) });
      this.handleMeetings(meetings); 
      this.mayorData.querySf('segments', 'GET', true, null).then((sessions) => {
        Storage.set({ key: 'segments', value : JSON.stringify(sessions) });

        if(sessions && sessions['sessions'] && sessions['sessions'].length > 0) {
          this.segments = sessions['segments'];
          this.handleSessions(sessions['sessions']); 
          this.handleEnrollments();
        }
      }).catch(err => {
        console.log('### error in segments');
      });
    }).catch(err => {
      console.log('### error in events2');
    });
  }
 

  /**
   * get all enrollements and match with list
   */
  async handleEnrollments() {
    const { value } = await Storage.get({ key: 'enrollments' });
    this.enrollments = JSON.parse(value);

    this.mayorData.querySf('enrollments', 'GET', true, null).then((enrollments) => { 

      Storage.set({ key: 'enrollments', value : JSON.stringify(enrollments) });
      this.enrollments = enrollments;
    });
  }

  /**
   * Handle sessions for meeting
   */
  handleSessions(sessions ) {
    this.all_sessions = [];

    for(let session of sessions) {
      if(session.isPublished__c) {
        this.all_sessions.push(session);
      }
    }
    this.meeting_sessions = [];
    this.sessions = [];

    // get current date moment val
    let shown_date;
    for(let entry of this.meeting_dates) {
      if(this.selected_date == entry.format('ddd D')) {
        shown_date = entry;
      }
    }
    

    if(this.meeting && this.all_sessions && this.all_sessions.length > 0) {
      for(let entry of this.all_sessions) {
        entry.start_time = moment.utc(entry.Session_Start_Time__c).add(this.meeting.Event_UTC_Offset_in_Hours__c, 'hours').format('h:mm a');
        entry.end_time =  moment.utc(entry.Session_End_Time__c).add(this.meeting.Event_UTC_Offset_in_Hours__c, 'hours').format('h:mm a'); 
        if (moment.utc(entry.Session_Start_Time__c).add(this.meeting.Event_UTC_Offset_in_Hours__c, 'hours').isSame(moment.utc(shown_date), 'day') && this.meeting.Id == entry.Event__c) {
          this.sessions.push(entry);

        }  

        if(entry.Event__c == this.meeting.Id) {
          entry.day = moment.utc(entry.Session_Start_Time__c).add(this.meeting.Event_UTC_Offset_in_Hours__c, 'hours').format('dddd, MMMM Do YYYY');
          this.meeting_sessions.push(entry);
        }
      }
    }
  }

  /**
   * Handle active meetings 
   */
  handleMeeting(meeting: any) {
    this.meeting = meeting;

    if(this.meeting && this.meeting.Start_Date__c) {
      let start_date = moment(this.meeting.Start_Date__c);  
      let total_days= this.meeting.Number_of_Days__c; 
      let dates = [];
      let display_dates = [];

      do {        
        display_dates.push(start_date.format('ddd D'));
        dates.push(moment(start_date));
        start_date.add(1, 'd');
        total_days--;
      } while(total_days > 0);
      this.meeting_dates = dates;
      this.display_dates = display_dates;

      if(this.meeting_dates && this.meeting_dates.length > 0) {

        if(!this.has_changed_tab) {
          let today = moment();
          if (today <= this.meeting_dates[0]) {
            this.selected_date = this.display_dates[0];
            this.selected_index = 0;
          } else if (today >= this.meeting_dates[this.meeting_dates.length - 1]) {
            this.selected_date = this.display_dates[this.display_dates.length - 1]
            this.selected_index = this.display_dates.length - 1;
          } else {
            this.selected_date = this.display_dates[this.display_dates.indexOf(today.format('ddd D'))];
            this.selected_index = this.display_dates.indexOf(today.format('ddd D'));
          }
        } else {
          this.selected_date = this.display_dates[this.selected_index];
        }
        
      }
    }
  }

  /**
   * Handle all meetings
   */
  handleMeetings(meetings) {
    if(meetings) {
      for (let meeting of meetings) {

        if(this.meeting_id) {
          if(this.meeting_id == meeting.Id) {
            Storage.set({ key : 'meeting', value : JSON.stringify(meeting) });
            this.handleMeeting(meeting);
            break;
          }
        } else {
          if(meeting.Default_Event_in_Mobile_App__c) {
            Storage.set({ key : 'meeting', value : JSON.stringify(meeting) });
            this.handleMeeting(meeting);
            break;
          }
        }
      }

    }
  }


  /**
   * Add enrollment
   */  
  addSessionEnrollment(session: any, event : any) {
    console.log('### create: ');
    let body = { sessionIds : [ session.Id ] };
    console.log('### body: ' + JSON.stringify(body));

    this.mayorData.querySf('enrollments', 'POST', true, body).then((enrollments) => { 
      this.enrollments = enrollments;
      session.Session_Enrollments__r = {};
      console.log('### enrollments: ' + JSON.stringify(enrollments));

      this.mayorData.querySf('segments', 'GET', true, null).then((sessions) => {
        this.segments = sessions['segments'];
        this.handleSessions(sessions['sessions']); 
        this.handleEnrollments();
      });      
    }, (err) => { 
      console.log(err); 
    });
  }

  /**
   * Remove enrollment
   */  
  removeSessionEnrollment(session: any, event : any) {
    let body = session.Id;
    this.mayorData.querySf('enrollments', 'DELETE', true, body).then((enrollments) => { 
      session.Session_Enrollments__r = null;

      this.mayorData.querySf('enrollments', 'GET', true, null).then((enrollments) => { 
        this.enrollments = enrollments;
      });

      
      this.mayorData.querySf('segments', 'GET', true, null).then((sessions) => {
        this.segments = sessions['segments'];
        this.handleSessions(sessions['sessions']); 
        this.handleEnrollments();
      });
    });
    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * open date picker
   */
  async openPicker(){
    let col_options = [];

    for(let display_date of this.display_dates) {
      col_options.push({ text: display_date, value: display_date });
    }
    
    let options: PickerOptions = {
      buttons: [
        {
          text: "Cancel",
          role: 'cancel'
        },
        {
          text:'Ok',
          handler:(value:any) => {
            console.log('### val: ', value);
            this.selected_date = value.Date.text;
            this.has_changed_tab = true;
            this.handleSessions(this.all_sessions);
          }
        }
      ],
      columns:[{
        name: 'Date',
        options: col_options
      }]
    };

    let picker = await this.pickerController.create(options);
    picker.present()
  }


  /**
   * Change the date and render new sessions
   */
  changeDate(ev: any) {
    this.selected_date = ev.detail.value;
    this.has_changed_tab = true;
    this.handleSessions(this.all_sessions);
  }

  /**
   * Navigate to session detail
   */
  goToSessionDetails(session: any) {
    let state = { session: session, meeting : this.meeting, sessionId : session.Id, segments : this.segments } ;
    let navigationExtras: NavigationExtras = { state: state };
    this.router.navigate(['/tabs/tabs/meetings/session/' + session.Id], navigationExtras);
  }


  /**
   * Navigate to pill page
   */
  goToPage(page : string) {
    if(page == 'Attendees') {
      let state = { meeting : this.meeting } ;
      let navigationExtras: NavigationExtras = { state: state };
      this.router.navigate(['/tabs/tabs/meetings/attendees'], navigationExtras);
    } else if(page == 'Activities') {
      let state = { meeting : this.meeting } ;
      let navigationExtras: NavigationExtras = { state: state };
      this.router.navigate(['/tabs/tabs/meetings/activities'], navigationExtras);
    } else if(page == 'Committees') {
      let state = { meeting : this.meeting } ;
      let navigationExtras: NavigationExtras = { state: state };
      this.router.navigate(['/tabs/tabs/meetings/committees'], navigationExtras);
    } else if(page == 'Resolutions') {
      let state = { meeting : this.meeting } ;
      let navigationExtras: NavigationExtras = { state: state };
      this.router.navigate(['/tabs/tabs/meetings/resolution-categories'], navigationExtras);
    } else if(page == 'Notices') {
      let state = { meeting : this.meeting } ;
      let navigationExtras: NavigationExtras = { state: state };
      this.router.navigate(['/tabs/tabs/meetings/notices'], navigationExtras);
    } else if(page == 'Sponsors') {
      let state = { meeting : this.meeting } ;
      let navigationExtras: NavigationExtras = { state: state };
      this.router.navigate(['/tabs/tabs/meetings/sponsors'], navigationExtras);
    } else if(page == 'Assistance') {
      let state = { meeting : this.meeting } ;
      let navigationExtras: NavigationExtras = { state: state };
      this.router.navigate(['/tabs/tabs/meetings/assistance'], navigationExtras);
    } else if(page == 'Agenda') {
      const state = { 
        meeting: this.meeting
      };

      const navigationExtras: NavigationExtras = { state: state };
      this.router.navigate(['/tabs/tabs/meetings/agenda'], navigationExtras);
    }
  }

  setupPush() {
    
  }

}
