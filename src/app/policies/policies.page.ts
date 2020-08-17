import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonSearchbar, NavController, IonInfiniteScroll } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';

import { SearchPipe } from '../core/search.pipe';

import { MayorDataService } from '../api/mayor-data.service';
import { Plugins } from '@capacitor/core'; 
const { Storage } = Plugins;
import * as moment from 'moment';


@Component({
  selector: 'app-policies',
  templateUrl: './policies.page.html',
  styleUrls: ['./policies.page.scss'],
})
export class PoliciesPage implements OnInit {
  meetings: any[] = [];
  allPolicies : any[] = [];
  committees: any[] = [];
  policies: any[] = [];
  isSearch : boolean = false;
  queryText                 = '';
  segment = 'committees';

  @ViewChild(IonContent, {static: false}) content : IonContent;
  @ViewChild(IonSearchbar, {static: false}) searchbar : IonSearchbar;
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;

  constructor(
    public navCtrl           : NavController,
    public mayorData         : MayorDataService,
    private router           : Router
  ) {
  }

  async getResolutions() {
    const { value } = await Storage.get({ key: 'resolutions' });
    if(value) {
      this.handlePolicies(JSON.parse(value)); 
    }
    
  }

  ngOnInit() {
    this.getResolutions();
    this.mayorData.querySf('resolutions', 'GET', false, null).then((policies) => {
      Storage.set({ key : 'resolutions', value : JSON.stringify(policies) });
      this.handlePolicies(policies);
    }, err => {
    }); 
  }


  unique(values : any[]) {
    let a = [];
    for (let current of values) {
      if (a.indexOf(current) < 0) a.push(current);
    }

    values.length = 0;
    for ( let current of a) {
      if(current && current != '') {
        values.push( current );
      }
    }
    return values;
  }
 
  sortMeetings(meetings : any[]) {
    let sorted = [];
    this.meetings = [];
    for(let meeting of meetings) {
      let date_start, date_end;
      date_start = meeting.indexOf('(');
      date_end = meeting.indexOf(')');
      let meeting_year = meeting.substring(date_start + 1, date_end);
      sorted.push({ meeting_year: parseInt(meeting_year), meeting : meeting });
    }
    function compare(a,b) {
      if (a.meeting_year > b.meeting_year)
        return -1;
      if (a.meeting_year < b.meeting_year)
        return 1;
      return 0;
    }
    sorted.sort(compare);
    for(let meeting of sorted) {
      let date_start, date_end;
      date_start = meeting.meeting.indexOf(' (');
      date_end = meeting.meeting.indexOf(')');
      this.meetings.push({ 
        full_meeting : meeting.meeting, 
        name : meeting.meeting.substring(0, date_start + 1), 
        city : meeting.meeting.substring(date_start + 1, meeting.meeting.length)
      });
    }
  }

  handlePolicies(policies: any[]) {
    let meetings = [], committees = [];
    this.allPolicies = [];
    console.log('### policies: ' + policies.length);

    for(let entry of policies) {
      if(entry.isPublished__c) {
      }

      if(entry.isPublished__c && (entry.Status__c == 'Adopted' || entry.Status__c == 'Approved')) {
        this.allPolicies.push(entry);
        if(entry.Event__r && entry.Event__r.Host_City__r) {
          meetings.push(entry.Event__r.Name + ' (' + moment(entry.Event__r.Start_Date__c).format('YYYY') + ') ' + entry.Event__r.Host_City__r.City__c);
        } else {
          meetings.push(entry.Event__r.Name + ' (' + moment(entry.Event__r.Start_Date__c).format('YYYY') + ') ');
        }
        
        committees.push(entry.Category__c);

        if(entry && entry.Adopted_Date__c) {
          entry.adopted_date = moment.utc(entry.Adopted_Date__c).format('M/D/YYYY');
        }
      }       
    }
    this.policies = this.allPolicies;
    this.sortMeetings(this.unique(meetings));
    this.committees = this.unique(committees).sort();
  }

  changeTab(tabName : any) {
    this.queryText = '';
  }

  goToPolicy(policy: any) {
    let navigationExtras: NavigationExtras = { state: { policy: policy } };
    this.router.navigate(['/tabs/tabs/policies/policy/' + policy.Id], navigationExtras);
  }

  goToMeeting(meeting: any) {
    let navigationExtras: NavigationExtras = { state: { meeting: meeting.full_meeting, allPolicies : this.allPolicies } };
    this.router.navigate(['/tabs/tabs/policies/policy-list'], navigationExtras);
  }

  goToCommittee(committee: any) {
    console.log('### allPolicies: ' + this.allPolicies.length);
    let navigationExtras: NavigationExtras = { state: { committee: committee, allPolicies : this.allPolicies } };
    this.router.navigate(['/tabs/tabs/policies/policy-list'], navigationExtras);
  }

  scrollTopAndSearch() { 
    this.content.scrollToTop();
    this.policies = new SearchPipe().transform(this.allPolicies, this.queryText);
  }
}
