import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonSearchbar, NavController, IonInfiniteScroll } from '@ionic/angular';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

import { SearchPipe } from '../core/search.pipe';

import { MayorDataService } from '../api/mayor-data.service';
import { Plugins } from '@capacitor/core'; 
const { Storage } = Plugins;




@Component({
  selector: 'app-attendees',
  templateUrl: './attendees.page.html',
  styleUrls: ['./attendees.page.scss'],
})
export class AttendeesPage  implements OnInit {

  allAttendees = [];
  guests = [];
  mayors = [];
  meeting;
  queryText  = '';
  segment = 'mayors';

  @ViewChild(IonContent, {static: false}) content : IonContent;
  @ViewChild(IonSearchbar, {static: false}) searchbar : IonSearchbar;
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;

  constructor(
    public mayorData: MayorDataService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { 
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.meeting = this.router.getCurrentNavigation().extras.state.meeting;
      }
    });
  }


  handleAttendees(attendees ) {
    this.guests = [];
    this.mayors = [];
    
    for(let attendee of attendees) {
      if(attendee.Tab__c == 'Speakers & Guests') {
        this.guests.push(attendee);
      } else {
        this.mayors.push(attendee);
      }
    }
    console.log('### guests: ' + this.guests.length);
  }

  handleAllAttendees(attendees ) {
    this.allAttendees = [];
    for(let attendee of attendees) { 
      if(attendee.Contact__r.isPublished__c && attendee.Event__c == this.meeting.Id && attendee.Event_Status__c == 'Attending') {
        this.allAttendees.push(attendee);
      }
    }
  }



  async getAttending() {
    const { value } = await Storage.get({ key: 'attending' });
    this.handleAllAttendees(JSON.parse(value));
    this.handleAttendees(this.allAttendees);
  }

  ngOnInit() {
    this.getAttending();

    this.mayorData.querySf('attending', 'GET', false, null).then((attendees) => {
      Storage.set({ key : 'attending', value : JSON.stringify(attendees) });
      console.log('### attending: ' + attendees.length);
      console.log('### attendees: ' + attendees[0]);
      this.handleAllAttendees(attendees);
      this.handleAttendees(this.allAttendees);
    }, (err) => {});
  }

  /**
   * Segment Changed
   */
  segmentChanged(ev: any) {
    

  }


  goToAttendeeDetail(attendee: any) {

    if(attendee.Contact__r) {
      attendee.Contact = attendee.Contact__r;
    } 

    let navigationExtras: NavigationExtras = { state: { mayor: attendee } };
    this.router.navigate(['/tabs/tabs/meetings/mayors/' + attendee.Contact.Id], navigationExtras);
  }

  scrollTopAndSearch() { 
    this.content.scrollToTop();
    
    if(this.queryText.length > 2) {
      let searched_attendees = new SearchPipe().transform(this.allAttendees, this.queryText);
      this.handleAttendees(searched_attendees);
    } else {
       this.handleAttendees(this.allAttendees);
    }      
  }
}
