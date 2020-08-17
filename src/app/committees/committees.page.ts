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
  selector: 'app-committees',
  templateUrl: './committees.page.html',
  styleUrls: ['./committees.page.scss'],
})
export class CommitteesPage implements OnInit {
  committees: any[] = [];
  meeting: any;
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

  async loadCommittee() {
    const { value } = await Storage.get({ key: 'sponsors' });

    if(value) {
      this.committees = JSON.parse(value);
    }

  }

  ngOnInit() {
    this.loadCommittee();

    this.mayorData.querySf('committees', 'GET', true, null).then((committees) => {
      Storage.set({ key: 'committees', value : JSON.stringify(committees) });
      this.committees = committees;
    }, err => {
    }); 

  }

  goToCommittee(committee : any) {
    let navigationExtras: NavigationExtras = { state: { committee: committee, meeting: this.meeting } };
    this.router.navigate(['/tabs/tabs/meetings/committees/' + committee.Id], navigationExtras);
  }
}
