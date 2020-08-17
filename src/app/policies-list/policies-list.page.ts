import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { IonContent, IonSearchbar, NavController, IonInfiniteScroll } from '@ionic/angular';

import * as moment from 'moment';
import { SearchPipe } from '../core/search.pipe';


@Component({
  selector: 'app-policies-list',
  templateUrl: './policies-list.page.html',
  styleUrls: ['./policies-list.page.scss'],
})
export class PoliciesListPage implements OnInit {
  policies = [];
  committee;
  meeting;
  allPolicies = [];
  queryText ='';

  @ViewChild(IonContent, {static: false}) content : IonContent;
  @ViewChild(IonSearchbar, {static: false}) searchbar : IonSearchbar;
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;

  

  constructor(
    private activatedRoute   : ActivatedRoute,
    private router           : Router,
    public navCtrl           : NavController,
  ) {

    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.meeting = this.router.getCurrentNavigation().extras.state.meeting;
        this.committee = this.router.getCurrentNavigation().extras.state.committee;
        this.allPolicies = this.router.getCurrentNavigation().extras.state.allPolicies;

        if(this.committee) {
          this.handlePoliciesForCommittee();
        } else {
          this.handlePoliciesForMeeting();
        }
      }
    });
  }

  ngOnInit() {
    
  }




  handlePoliciesForMeeting() {
    this.policies = [];
    for(let policy of this.allPolicies) {
      if(policy && policy.Event__r) {

        let meetingName;

        if(policy.Event__r && policy.Event__r.Host_City__r) {
          meetingName = policy.Event__r.Name + ' (' + moment(policy.Event__r.Start_Date__c).format('YYYY') + ') ' + policy.Event__r.Host_City__r.City__c;
        } else {
          meetingName = policy.Event__r.Name + ' (' + moment(policy.Event__r.Start_Date__c).format('YYYY') + ') ';
        } 

        if(meetingName == this.meeting) {
          this.policies.push(policy);
        }
      }
    }

    this.policies.sort((a, b) => {
      if(moment(a.Adopted_Date__c).isBefore(moment(b.Adopted_Date__c))) {
        return 1;
      } else if(moment(b.Adopted_Date__c).isBefore(moment(a.Adopted_Date__c))) {
        return -1;
      } else {
        return 0;
      }
    });

  }

  handlePoliciesForCommittee() {
    console.log('### handling policties for committee');
    this.policies = [];
    for(let policy of this.allPolicies) {
      if(policy && policy.Category__c == this.committee) {
        this.policies.push(policy);
      }
    }

    this.policies.sort((a, b) => {
      if(moment(a.Adopted_Date__c).isBefore(moment(b.Adopted_Date__c))) {
        return 1;
      } else if(moment(b.Adopted_Date__c).isBefore(moment(a.Adopted_Date__c))) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  goToPolicy(policy: any) {
    let navigationExtras: NavigationExtras = { state: { policy: policy } };
    this.router.navigate(['/tabs/tabs/policies/policy/' + policy.Id], navigationExtras);
  }

  scrollTopAndSearch() { 
    this.content.scrollToTop(); 
    this.policies = new SearchPipe().transform(this.allPolicies, this.queryText); 
  }

}
