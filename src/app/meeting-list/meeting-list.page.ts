import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonSearchbar, NavController } from '@ionic/angular';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

import { SearchPipe } from '../core/search.pipe';

import { MayorDataService } from '../api/mayor-data.service';
import { Plugins } from '@capacitor/core'; 
const { Storage } = Plugins;
import * as moment from 'moment';


@Component({
  selector: 'app-meeting-list',
  templateUrl: './meeting-list.page.html',
  styleUrls: ['./meeting-list.page.scss'],
})
export class MeetingListPage implements OnInit {

  meetings ;

  past_meetings ;
  upcoming_meetings ;

  constructor(
    public mayorData : MayorDataService,
    public navCtrl : NavController,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {


        // this.meetings = this.router.getCurrentNavigation().extras.state.meetings;
        console.log('### meetings: ' + JSON.stringify(this.meetings));
        this.meetings = this.router.getCurrentNavigation().extras.state.meetings.sort((a, b) => {
          return -(moment(a.End_Date__c).diff(b.End_Date__c));
        });
      }
    });
  }


  ngOnInit() {
    this.mayorData.querySf('events2', 'GET', true, null).then((meetings) => { 
      Storage.set({ key : 'events2', value : JSON.stringify(meetings) });
      this.meetings = meetings;
      console.log('### meetings 2: ' + JSON.stringify(this.meetings));

      // this.meetings.sort((a, b) => moment(a.End_Date__c, 'YYYY-MM-DD').isBefore(moment(b.End_Date__c, 'YYYY-MM-DD')) ? -1 : 1, );
      this.meetings = this.meetings.sort((a, b) => {
        return -(moment(a.End_Date__c).diff(b.End_Date__c));
      });
      console.log('### sorted 2: ' + JSON.stringify(this.meetings));
    }, (err : any) => { });
  }

  selectMeeting(meeting : any) {
    Storage.set({ key : 'selected_meeting_id', value : JSON.stringify(meeting.Id) });
    Storage.set({ key : 'meeting', value : JSON.stringify(meeting) });

    this.router.navigate(['/tabs/tabs/meetings']);
  }
}
