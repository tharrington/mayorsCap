
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
  selector: 'app-sponsors-detail',
  templateUrl: './sponsors-detail.page.html',
  styleUrls: ['./sponsors-detail.page.scss'],
})
export class SponsorsDetailPage implements OnInit {

  sponsor : any;
  meeting : any;

  constructor(
    public navCtrl           : NavController,
    public mayorData         : MayorDataService,
    private router           : Router,
    private activatedRoute   : ActivatedRoute,
  ) {

    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.meeting = this.router.getCurrentNavigation().extras.state.meeting;
        this.sponsor = this.router.getCurrentNavigation().extras.state.sponsor;

        
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SponsorDetail');
  }

  ngOnInit() {
  }
}
