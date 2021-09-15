
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonSearchbar, NavController, PickerController } from '@ionic/angular';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

import { SearchPipe } from '../core/search.pipe';
import { PickerOptions } from "@ionic/core";

import { MayorDataService } from '../api/mayor-data.service';
import { Plugins } from '@capacitor/core'; 
const { Storage } = Plugins;
import * as moment from 'moment';


@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
})
export class AgendaPage implements OnInit {
  enrollments = [];
  meeting_dates = [];
  display_dates = [];
  meeting;
  selected_date;
  sessions = [];
  meeting_id;
  selected_index = 0;

  constructor(
    public mayorData         : MayorDataService,
    public navCtrl           : NavController,
    private router           : Router,
    private activatedRoute   : ActivatedRoute,
    private pickerController : PickerController
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.meeting = this.router.getCurrentNavigation().extras.state.meeting;
        this.handleMeeting();
      }
    });
  }

  ngOnInit() {

  }

  handleMeeting() {
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
        
      this.getEnrollments();
    }
  }


  async getEnrollments() {
    this.mayorData.querySf('enrollments', 'GET', true, null).then((enrollments) => { 
      Storage.set({ key: 'enrollments', value : JSON.stringify(enrollments) });
      this.enrollments = enrollments;
      this.handleEnrollments();
    });
  }


  ionViewWillEnter() {
    this.handleMeeting();
  }


  handleEnrollments() {
    this.sessions = [];
    // get current date moment val
    let shown_date;
    for(let entry of this.meeting_dates) {
      if(this.selected_date == entry.format('ddd D')) {
        shown_date = entry;
      }
    }

    this.sessions = [];
      
    for(let entry of this.enrollments) {
      entry.start_time = moment.utc(entry.Session_Start_Time__c).add(this.meeting.Event_UTC_Offset_in_Hours__c, 'hours').format('h:mm a');
      entry.end_time =  moment.utc(entry.Session_End_Time__c).add(this.meeting.Event_UTC_Offset_in_Hours__c, 'hours').format('h:mm a'); 
      if (moment.utc(entry.Session_Start_Time__c).add(this.meeting.Event_UTC_Offset_in_Hours__c, 'hours').isSame(moment.utc(shown_date), 'day')) {
        this.sessions.push(entry);
      }  
    }
  }

  changeDate(new_date : any, date_index : number) {
    this.selected_index = date_index;
    this.selected_date = new_date;
    this.handleEnrollments();
  }

  goToSession(session: any) {
    let navigationExtras: NavigationExtras = { state: { session: session } };
    this.router.navigate(['/tabs/tabs/meetings/session/' + session.Id], navigationExtras);
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
            this.handleEnrollments();
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
   * Remove enrollment
   */  
  removeEnrollment(session: any, slidingItem: any) {
    let body = session.Id;
    this.mayorData.querySf('enrollments', 'DELETE', true, body).then((enrollments) => { 
      this.mayorData.querySf('enrollments', 'GET', true, null).then((enrollments) => {
        console.log('### enrollments: ' + JSON.stringify(enrollments));
        this.enrollments = enrollments;
      });

      this.mayorData.querySf('segments', 'GET', true, null).then((sessions) => {
        console.log('### enrollments 2: ' + JSON.stringify(enrollments));
        this.handleEnrollments();
      });

    });
  }

}
