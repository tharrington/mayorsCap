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
  selector: 'app-resolutions',
  templateUrl: './resolutions.page.html',
  styleUrls: ['./resolutions.page.scss'],
})
export class ResolutionsPage implements OnInit {
  resolutions = [];
  allResolutions = [];
  meeting;
  ionScroll;
  category;
  queryText;
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
        this.resolutions = [];
        this.category = this.router.getCurrentNavigation().extras.state.category;

        for(let resolution of this.router.getCurrentNavigation().extras.state.resolutions) {
          if(resolution.isPublished__c) {
            this.resolutions.push(resolution);
            this.allResolutions.push(resolution);
          }
        }
      }
    });
  }


  ngOnInit() {

  }

  /**
   * Scroll Top and Search
   */
  scrollTopAndSearch() { 
    this.content.scrollToTop();
    
    if(this.queryText.length > 2) {
      this.resolutions = new SearchPipe().transform(this.allResolutions, this.queryText);
    } else {
      this.resolutions = this.allResolutions;
    }    
    
  }


  goToResolution(resolution) {
    let navigationExtras: NavigationExtras = { state: { resolution: resolution, meeting: this.meeting } };
    this.router.navigate(['/tabs/tabs/meetings/resolutions/' + resolution.Id], navigationExtras);
  }
}
