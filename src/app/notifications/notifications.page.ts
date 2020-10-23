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
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  notifications = [];
  allNotifications = [];
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
        this.notifications = [];
        this.category = this.router.getCurrentNavigation().extras.state.category;

        for(let notification of this.router.getCurrentNavigation().extras.state.notifications) {
          if(notification.isPublished__c) {
            this.notifications.push(notification);
            this.allNotifications.push(notification);
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
      this.notifications = new SearchPipe().transform(this.allNotifications, this.queryText);
    } else {
      this.notifications = this.allNotifications;
    }

  }


  goToNotification(notification) {
    let navigationExtras: NavigationExtras = { state: { notification: notification, meeting: this.meeting } };
    this.router.navigate(['/tabs/tabs/home/notifications/' + notification.Id], navigationExtras);
  }
}
