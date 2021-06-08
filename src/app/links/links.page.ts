import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonSearchbar, NavController } from '@ionic/angular';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

import { SearchPipe } from '../core/search.pipe';

import { MayorDataService } from '../api/mayor-data.service';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
import * as moment from 'moment';

@Component({
  selector: 'app-links',
  templateUrl: './links.page.html',
  styleUrls: ['./links.page.scss'],
})
export class LinksPage implements OnInit {
  links ;
  meeting;


  constructor( public mayorData : MayorDataService,
               public navCtrl : NavController,
               private activatedRoute: ActivatedRoute,
               private router: Router
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {

        this.links = this.router.getCurrentNavigation().extras.state.links;
        this.meeting = this.router.getCurrentNavigation().extras.state.meeting;
        console.log('### links: ' + JSON.stringify(this.links));
      }
    });
  }


  ngOnInit() {
    this.mayorData.querySf('events2/' + this.meeting.Id, 'GET', true, null).then((aMeeting) => {
      console.log('### got meeting:' + JSON.stringify((aMeeting)));
      if(aMeeting && aMeeting.length > 0 && aMeeting[0].LWEV_Links__r) {
        this.links = aMeeting[0].LWEV_Links__r.records;
      }
      console.log('### links: ' + JSON.stringify(this.links));
    }).catch(err => {
      console.log('### error in events2');
    });
  }

  openLink(link) {
    console.log('### open link');
    window.open(link.Link_URL__c, '_system', 'location=yes');
    return false;
  }

}
