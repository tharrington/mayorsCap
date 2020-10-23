import { Component, OnInit } from '@angular/core';
import {NavController, PickerController} from "@ionic/angular";
import {MayorDataService} from "../api/mayor-data.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-notifications-detail',
  templateUrl: './notifications-detail.page.html',
  styleUrls: ['./notifications-detail.page.scss'],
})
export class NotificationsDetailPage implements OnInit {
  notification;

  constructor(
      public navCtrl           : NavController,
      private router           : Router,
      private activatedRoute   : ActivatedRoute,
  ) {

    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.notification = this.router.getCurrentNavigation().extras.state.notification;
        console.log('### notification: ' + JSON.stringify((this.notification)));
      }
    });
  }

  ngOnInit() {
  }

}
