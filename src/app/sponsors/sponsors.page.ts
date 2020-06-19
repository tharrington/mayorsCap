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
  selector: 'app-sponsors',
  templateUrl: './sponsors.page.html',
  styleUrls: ['./sponsors.page.scss'],
})
export class SponsorsPage implements OnInit {

  sponsors : any[] = [];
  allSponsors : any[] = [];
  sponsorSegments : any;

  hostSponsors : any[] = [];
  hostAllSponsors : any[] = [];

  meeting : any;
  segment = 'uscm';
  queryText : string = '';
  @ViewChild(IonContent, {static: false}) content : IonContent;
  overlayHidden : boolean = true;

  constructor(
    public navCtrl           : NavController,
    public mayorData         : MayorDataService,
    private router           : Router,
    private activatedRoute   : ActivatedRoute,
  ) {

    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.meeting = this.router.getCurrentNavigation().extras.state.meeting;
      }
    });
  }

  /**
   * break up the segments for sticky headers
   */
  breakupSegments(sponsors : any[]) {
    let segments = {};

    for(let sponsor of sponsors) {
      if(!segments[sponsor.Sponsorship_Level__c]) {
        segments[sponsor.Sponsorship_Level__c] = [sponsor];
      } else {
        segments[sponsor.Sponsorship_Level__c].push(sponsor);
      }
    }
    let segmentArr = [];
    for(var key in segments) {
      segmentArr.push(segments[key]);
    }
    return segmentArr;
  }


  handleSponsors(sponsors : any[]) {
    this.sponsors = [];
    this.allSponsors = [];
    for(let sponsor of sponsors) {
      if(sponsor.Event__c == this.meeting.Id) {
        if(sponsor.Category__c == 'Host City') {
          this.hostSponsors.push(sponsor);
          this.hostAllSponsors.push(sponsor);
        } else {
          this.sponsors.push(sponsor);
          this.allSponsors.push(sponsor);
        }
      }
    }
    this.sponsorSegments = this.breakupSegments(this.sponsors);
  }

  async getSponsors() {
    const { value } = await Storage.get({ key: 'sponsors' });

    if(value) {
      this.handleSponsors(JSON.parse(value));
    }
  }

  ngOnInit() {
    this.getSponsors();
    this.mayorData.querySf('sponsors', 'GET', false, null).then((sponsors) => {
      Storage.set({ key: 'sponsors', value : JSON.stringify(sponsors) });
      console.log('### sponsors: ' + sponsors.length);
      this.handleSponsors(sponsors);
    }, (err) => {
    });
  }

  changeTab() {
    this.queryText = '';
    this.content.scrollToTop();
  }


  goToSponsorDetail(sponsor: any) {

    // let navigationExtras: NavigationExtras = { state: { sponsor: sponsor, meeting: this.meeting } };
    // this.router.navigate(['/tabs/tabs/meetings/sponsors/' + sponsor.Id], navigationExtras);
  }

  scrollTopAndSearch() { 

    this.content.scrollToTop();
    if(this.segment == 'uscm') {
      if(this.queryText.length > 2) {
        this.sponsors = new SearchPipe().transform(this.allSponsors, this.queryText);
        this.sponsorSegments = this.breakupSegments(this.sponsors);
      } else {
        this.sponsors = this.allSponsors;
      }  
    } else {
      if(this.queryText.length > 2) {
        this.hostSponsors = new SearchPipe().transform(this.hostAllSponsors, this.queryText);
      } else {
        this.hostSponsors = this.hostAllSponsors;
      }  
    }
    
       
  }
}
