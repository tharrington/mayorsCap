import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonSearchbar, NavController, IonInfiniteScroll } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';

import { SearchPipe } from '../core/search.pipe';

import { MayorDataService } from '../api/mayor-data.service';
import { Plugins } from '@capacitor/core'; 
const { Storage } = Plugins;


/**
 * Component declaration
 */
@Component({
  selector: 'app-mayors',
  templateUrl: './mayors.page.html',
  styleUrls: ['./mayors.page.scss'],
})
export class MayorsPage implements OnInit {
  mayors                    = [];
  allMayors                 = [];
  leadership                = [];
  segment                   = 'leadership';
  queryText                 = '';
  isSearch                  = false;
  leadershipSegments        = [];
  mayorSegments             = [];
  isBoothMode               = false;


  @ViewChild(IonContent, {static: false}) content : IonContent;
  @ViewChild(IonSearchbar, {static: false}) searchbar : IonSearchbar;
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;

  constructor(
    public mayorData         : MayorDataService,
    public navCtrl           : NavController,
    private router           : Router
  ) { }

  ngOnInit() {
    this.loadStoredLeadership();
    this.loadStoredMayors();

    this.mayorData.querySf('meetthemayors', 'GET', true, null).then(mayors => {
      Storage.set({ key : 'mayors', value : JSON.stringify(mayors) });
      console.log('### mayors 0: ' + JSON.stringify(mayors[0]));
      this.handleAllMayorData(mayors);
    });

    this.mayorData.querySf('leadership', 'GET', true, null).then(leadership => {
      Storage.set({ key : 'leadership', value : JSON.stringify(leadership) });
      this.leadership = this.formatMayors(leadership);
      this.leadershipSegments = this.breakupSegments(leadership);
    });
  }


  /**
   *
   */
  goToMayor(mayor : any) {
    let navigationExtras: NavigationExtras = { state: { mayor: mayor  } };
    this.router.navigate(['/tabs/tabs/mayors/' + mayor.Contact.Id], navigationExtras);
  }


  /**
   * break up the segments for sticky headers
   */
  breakupSegments(mayors ) {
    let segments = {};

    for(let mayor of mayors) {
      if(!segments[mayor.Sort_Order__c]) {
        segments[mayor.Sort_Order__c] = [mayor];
      } else {
        segments[mayor.Sort_Order__c].push(mayor);
      }
    }
    let segmentArr = [];
    for(var key in segments) {
      segmentArr.push(segments[key]);
    }
    return segmentArr;
  }

  /**
   * Format Mayors Helper
   */
  formatMayors(mayors ) {
    mayors.forEach(function(mayor) {
      if(mayor.Contact__r) {
        mayor.Contact = mayor.Contact__r;
      }
    });
    return mayors;
  }

  /**
   * Segment Changed
   */
  segmentChanged(ev: any) {
    if(this.queryText.length > 0 && this.segment == 'leadership') {
      this.queryText = '';
      this.isSearch = false;
      this.mayors = this.allMayors.slice(0, 30);
    }
  }

  /**
   * Load More
   */
  loadMore(infiniteScroll) {

    if(this.allMayors.length > (this.mayors.length + 30)) {
      this.mayors = this.allMayors.slice(0, this.mayors.length + 30);
    } else {
      this.mayors = this.allMayors;
    }
    infiniteScroll.target.complete();
  }



  /**
   * Handle All Mayor Data
   */
  handleAllMayorData(mayors ) {
    let published_mayors = [];
    for(let mayor of mayors) {
      if(!mayor.Contact) {
        mayor.Contact = mayor.Contact__r;
      }
      if(mayor.Contact && mayor.Contact.isPublished__c) {
        published_mayors.push(mayor);
      }
    }
    
    if(published_mayors && published_mayors.length > 30) {
      this.mayors = published_mayors.slice(0,29);
    } else {
      this.mayors = published_mayors;
    }
    this.allMayors = published_mayors;    
  }

  /**
   * Scroll Top and Search
   */
  scrollTopAndSearch() { 
    this.content.scrollToTop();
    this.segment = 'mayors';
    
    if(this.queryText.length > 2) {
      // search all mayors with query text
      this.isSearch = true;
      this.mayors = new SearchPipe().transform(this.allMayors, this.queryText);
    } else {
      this.isSearch = false;
      if(this.allMayors.length > 30) {
        this.mayors = this.allMayors.slice(0, 30);
      } else {
        this.mayors = this.allMayors;
      }
    }    
  }

  /**
   * Load cached data
   */
  async loadStoredLeadership() {
    const { value } = await Storage.get({ key: 'leadership' });
    if(value) {
      this.leadershipSegments = this.breakupSegments(JSON.parse(value));
      this.leadership = this.formatMayors(JSON.parse(value));
    }
    
  }
  async loadStoredMayors() {
    const { value } = await Storage.get({ key: 'mayors' });
    if(value) {
      let mayors = JSON.parse(value);
      this.handleAllMayorData(mayors);
    }
  }
}
