
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
  selector: 'app-resolution-categories',
  templateUrl: './resolution-categories.page.html',
  styleUrls: ['./resolution-categories.page.scss'],
})
export class ResolutionCategoriesPage implements OnInit {

  resolutions  = [];
  categories = [];
  meeting;
  @ViewChild(IonContent, {static: false}) content : IonContent;

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

  handleResolutions(resolutions: any[]) {
    this.resolutions = resolutions;
    this.categories = [];
    let categories = [];

    
    for(let resolution of resolutions) {
      if(resolution.Event__c == this.meeting.Id) {
        categories.push(resolution.Category__c);
      }
    }
    this.categories = this.unique(categories).sort();
  }

  async loadResolutions() {
    const { value } = await Storage.get({ key: 'resolutions' });

    if(value) {
      this.handleResolutions(JSON.parse(value));
    }
  }


  ngOnInit() {
    this.loadResolutions();

    this.mayorData.querySf('resolutions', 'GET', false, null).then((resolutions) => {
      Storage.set({ key: 'resolutions', value : JSON.stringify(resolutions) });
      this.handleResolutions(resolutions);
    }, (err) => {
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

  goToResolutionsList(category: any) {
    let resolutions = [];
    for(let resolution of this.resolutions) {
      if(resolution.Event__c == this.meeting.Id && resolution.Category__c == category) {
        resolutions.push(resolution);
      }
    }

    let navigationExtras: NavigationExtras = { state: { resolutions: resolutions, category : category, meeting: this.meeting } };
    this.router.navigate(['/tabs/tabs/meetings/resolutions'], navigationExtras);
  }
}

