
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonSearchbar, NavController } from '@ionic/angular';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

import { SearchPipe } from '../core/search.pipe';

import { MayorDataService } from '../api/mayor-data.service';
import { Plugins } from '@capacitor/core'; 
const { Storage } = Plugins;
import * as moment from 'moment';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {


  all_sessions = [];
  sessions = [];
  meeting_dates = [];
  meetings = [];
  rsvps: any;
  sign_ons: any;
  meeting_id : any;
  display_dates = [];
  meeting: any;
  upcoming_session : any;
  segments: any;
  enrollments  = [];
  selected_date: string;
  notifications  = [];
  feed_items  = [];
  verifiedcontact : any;
  rsvp_display : any;
  sign_on_display: any;


  constructor(
    public mayorData: MayorDataService,
    public navCtrl : NavController,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.upcoming_session = {};
    this.getVerifiedContact();
    this.getSessionDetails();
    this.getSignOns();
    this.getRsvps();
    this.getNotifications();
    this.getEnrollments();
    this.getSegments();
  }

  /**
   * Get verified contact for mayor updates
   */
  async getVerifiedContact() {
    const { value } = await Storage.get({ key: 'verifiedcontact' });
    this.verifiedcontact = JSON.parse(value);
    
    this.mayorData.querySf('verifiedcontact', 'GET', true, null).then(verifiedcontact => {
      Storage.set({ key : 'verifiedcontact', value : JSON.stringify(verifiedcontact) });
      this.verifiedcontact = verifiedcontact;
    });
  }

  openProfile() {

    this.router.navigate(['/tabs/tabs/home/profile']);
  }

  findRecentActionItems(items , type : string) {
    for(let item of items) {
      if(!item.myResponse) {
        if(type == 'rsvp') {
          this.rsvp_display = item;
        } else  {
          this.sign_on_display = item;
        }
      }
    }
  }

  async getRsvps() {
    const rsvp_endpoint = 'actionitems?type=RSVP%20Event';

    const { value } = await Storage.get({ key: rsvp_endpoint });
    this.rsvps = JSON.parse(value);
    this.findRecentActionItems(this.rsvps, 'rsvp');
    this.mayorData.querySf(rsvp_endpoint, 'GET', true, null).then((action_items: any) => {
      Storage.set({ key : rsvp_endpoint, value : JSON.stringify(action_items) });
      this.rsvps = action_items;
      this.findRecentActionItems(this.rsvps, 'rsvp');
    }, err => {  }); 
  }

  async getSignOns() {
    const sign_on_endpoint = 'actionitems?type=' + encodeURIComponent('Sign-On Letter');

    const { value } = await Storage.get({ key: sign_on_endpoint });
    this.sign_ons = JSON.parse(value);
    this.findRecentActionItems(this.rsvps, 'sign_ons');
    this.mayorData.querySf(sign_on_endpoint, 'GET', true, null).then((action_items: any) => {
      Storage.set({ key : sign_on_endpoint, value : JSON.stringify(action_items) });
      this.rsvps = action_items;
      this.findRecentActionItems(this.rsvps, 'sign_ons');
    }, err => {  }); 
  }

  async getNotifications() {
    const { value } = await Storage.get({ key: 'notifications' });
    this.notifications = JSON.parse(value);
    this.mayorData.querySf('notifications', 'GET', true, null).then((notifications: any) => {
      Storage.set({ key : 'notifications', value : JSON.stringify(notifications) });
      this.notifications = this.calculateTimeAgo(notifications);
    }, err => {  }); 
  }

  async getEnrollments() {
    const { value } = await Storage.get({ key: 'enrollments' });
    this.enrollments = JSON.parse(value);
    this.findUpcomingSession();
  }


  clearAllData() {
    this.all_sessions = [];
    this.sessions = [];
    this.meeting_dates = [];
    this.segments = [];
    this.selected_date = '';
    this.display_dates = [];
  }

  async getSegments() {
    const { value } = await Storage.get({ key: 'segments' });
    if(value) {
      this.handleSessions(JSON.parse(value)['sessions']);
    }
  }

  async getSessionDetails() {
    const { value } = await Storage.get({ key: 'meeting' });
    if(value) {
      this.handleMeeting(JSON.parse(value));
    }
  }
 
  /**
   * Handle sessions for meeting
   */
  handleSessions(sessions ) {
    this.all_sessions = sessions;
    this.sessions = [];

    // get current date moment val
    let shown_date;
    for(let entry of this.meeting_dates) {
      if(this.selected_date == entry.format('ddd D')) {
        shown_date = entry;
      }
    }

    if(this.meeting && this.all_sessions) {
      for(let entry of this.all_sessions) {
        entry.start_time = moment(entry.Session_Start_Time__c).format('h:mm a');
        entry.end_time = moment(entry.Session_End_Time__c).format('h:mm a');
        if (moment.utc(entry.Session_Start_Time__c).add(this.meeting.Event_UTC_Offset_in_Hours__c, 'hours').isSame(moment.utc(shown_date), 'day')) {

          this.sessions.push(entry);
        }  
      }
    }
    this.calculateTimeToEnrollments(this.sessions);
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
        this.selected_date = this.display_dates[0];
      }
    }
  }

  /**
   * Handle all meetings
   */
  handleMeetings(meetings) {
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



  calculateTimeAgo(values) {
    for(let value of values) {
      value.time_ago = moment(value.LastPublishedDate__c).fromNow();  
    }
    return values;
  }

  calculateTimeToEnrollments(values) {
    for(let value of values) {
      value.time_ago = moment(value.Session_Start_Time__c).fromNow();  
    }
    return values;
  }

  findUpcomingSession() {
    let cur_difference;
    let cur_time = moment();
    let upcoming_session;

    for(let session of this.enrollments) {
      if(cur_time.diff(session.Session_Start_Time__c) < 0) {
        if(!cur_difference) {
          upcoming_session = session;
          cur_difference = cur_time.diff(session.Session_Start_Time__c);
        } else if(cur_time.diff(session.Session_Start_Time__c) > cur_difference) {
          upcoming_session = session;
        }
      }
    }
    if(upcoming_session) {
      this.upcoming_session = upcoming_session;
      for(let meeting of this.meetings) {
        if(meeting.Id == this.upcoming_session.Event__c) {
          this.meeting = meeting;
          this.upcoming_session.time_ago = moment.utc(this.upcoming_session.Session_Start_Time__c).add(this.meeting.Event_UTC_Offset_in_Hours__c, 'hours').fromNow();
          this.handleMeeting(meeting);
          this.handleSessions(this.all_sessions);
          break;
        }
      }
    }
  }

  
  /** ACTIONS **/
  mayorUpdateRequest() {
    // if(this.verifiedcontact && this.verifiedcontact.Contact_Roles__r.totalSize > 1) {
    //   let mayorModal = this.modalCtrl.create(MayorUpdateListPage, {
    //     verifiedcontact: this.verifiedcontact
    //   });
    //   mayorModal.present();
    // } else {
    //   let mayorModal = this.modalCtrl.create(MayorUpdateDetailPage, {
    //     verifiedcontact: this.verifiedcontact
    //   });
    //   mayorModal.present();
    // }

    window.open('https://community.usmayors.org/choosecity', '_system', 'location=yes');
    
  }


  goToNotifications() {
    let navigationExtras: NavigationExtras = { state: { notifications: this.notifications } };
    this.router.navigate(['/tabs/tabs/home/notifications'], navigationExtras);
  }

  goToMyAgenda() {
    // this.navCtrl.push(MyAgendaPage, { 
    //   meeting: this.meeting,
    //   enrollments : this.enrollments,
    //   meeting_dates : this.meeting_dates,
    //   selected_date : this.selected_date,
    //   display_dates : this.display_dates
    // });
  }

  goToSignOnList() {
    // this.navCtrl.push(SignOnListPage, { 
    //   meeting: this.meeting,
    //   sign_ons : this.sign_ons,
    //   verifiedcontact : this.verifiedcontact
    // });
  }

  goToRsvpList() {
    // this.navCtrl.push(RsvpListPage, { 
    //   meeting: this.meeting,
    //   rsvps : this.rsvps,
    //   verifiedcontact : this.verifiedcontact
    // });
  }

  goToFeed() {
    // this.navCtrl.push(ActivityFeedListPage, {
    //   feed_items : this.feed_items
    // });
  }
}
