
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonSearchbar, NavController, PickerController } from '@ionic/angular';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

import { SearchPipe } from '../core/search.pipe';
import { PickerOptions } from "@ionic/core";

import { MayorDataService } from '../api/mayor-data.service';
import { Plugins } from '@capacitor/core'; 
const { Storage } = Plugins;
import * as moment from 'moment';

import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Component({
  selector: 'app-resolutions-detail',
  templateUrl: './resolutions-detail.page.html',
  styleUrls: ['./resolutions-detail.page.scss'],
})
export class ResolutionsDetailPage implements OnInit {
  resolution;
  meeting;
  segment = 'resolution';
  isVerifiedContact;
  votingSession;
  showVotingButton;
  verifiedcontact;
  votes;          // votes for which the current user owns

  sponsors = [];       // sponsoships for which the current user owns


  @ViewChild(IonContent, {static: false}) content : IonContent;

  constructor(
    public navCtrl           : NavController,
    public mayorData         : MayorDataService,
    private router           : Router,
    private activatedRoute   : ActivatedRoute,
    private emailComposer    : EmailComposer
  ) {

    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.meeting = this.router.getCurrentNavigation().extras.state.meeting;
        this.resolution = this.router.getCurrentNavigation().extras.state.resolution;

        this.getResolution();
        if(this.resolution && this.resolution.Resolution_Related_Sessions__r && this.resolution.Resolution_Related_Sessions__r.records) {
          for(let entry of this.resolution.Resolution_Related_Sessions__r.records) {
            entry.Session__r.start_time = moment.utc(entry.Session__r.Session_Start_Time__c).add(this.meeting.Event_UTC_Offset_in_Hours__c, 'hours').format('h:mm a');
            entry.Session__r.end_time =  moment.utc(entry.Session__r.Session_End_Time__c).add(this.meeting.Event_UTC_Offset_in_Hours__c, 'hours').format('h:mm a'); 
            entry.Session__r.day = moment.utc(entry.Session__r.Session_Start_Time__c).add(this.meeting.Event_UTC_Offset_in_Hours__c, 'hours').format('dddd, MMMM Do YYYY');
          }
        }
      }
    });
  }


  /**
   * Add enrollment
   */  
  addSessionEnrollment(session: any, event : any) {
    let body = { sessionIds : [ session.Id ] };
    this.mayorData.querySf('enrollments', 'POST', true, body).then((enrollments) => { 
      session.Session_Enrollments__r = {};

      this.mayorData.querySf('segments', 'GET', true, null).then((sessions) => {
      });
    });
    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * Remove enrollment
   */  
  removeSessionEnrollment(session: any, event : any) {

    let body = session.Id;
    this.mayorData.querySf('enrollments', 'DELETE', true, body).then((enrollments) => { 
      session.Session_Enrollments__r = null;

      this.mayorData.querySf('enrollments', 'GET', true, null).then((enrollments) => { 
      });

      this.mayorData.querySf('segments', 'GET', true, null).then((sessions) => {
      });
    });
    event.preventDefault();
    event.stopPropagation();
  }


  async getVerifiedContact() {
    const { value } = await Storage.get({ key: 'verifiedcontact' });
    if(value) {
      this.verifiedcontact = JSON.parse(value);
      this.evaluateVotingTime();
    }

    this.mayorData.querySf('verifiedcontact', 'GET', true, null).then((verifiedcontact) => {
      Storage.set({ key: 'verifiedcontact', value : JSON.stringify(verifiedcontact) });
      this.verifiedcontact = verifiedcontact;
      console.log('### verifiedcontact: ' + JSON.stringify(this.verifiedcontact));
      if(verifiedcontact) {
        this.isVerifiedContact = true;
        this.getVotes();
        this.getResSponsers();
      }
      this.evaluateVotingTime();
    });
  }

  async getVotes() {
    const { value } = await Storage.get({ key: 'votes/' + this.resolution.Id });
    if(value) {
      this.votes = JSON.parse(value);
    }

    this.mayorData.querySf('votes/' + this.resolution.Id, 'GET', true, null).then((votes) => {
      Storage.set({ key: 'votes/' + this.resolution.Id, value : JSON.stringify(votes) });
      this.votes = votes;
    });
  }

  async getResSponsers() {
    const { value } = await Storage.get({ key: 'resolution_sponsors/' + this.resolution.Id });
    if(value) {
      this.sponsors = JSON.parse(value);
    }

    this.mayorData.querySf('resolution_sponsors/' + this.resolution.Id, 'GET', true, null).then((sponsors) => {
      Storage.set({ key: 'resolution_sponsors/' + this.resolution.Id, value : JSON.stringify(sponsors) });
      this.sponsors = sponsors;
    });
  }

  getResolution() {
    this.mayorData.querySf('resolutions/' + this.resolution.Id, 'GET', false, null).then((resolutions) => {
      this.resolution = resolutions[0];

      if(this.resolution  && this.resolution.Adopted_Date__c) {
        this.resolution.adopted_date = moment.utc(this.resolution.Adopted_Date__c).format('M/D/YYYY');
      }


      if(this.resolution && this.resolution.Resolution_Related_Sessions__r && this.resolution.Resolution_Related_Sessions__r.records) {
        for(let entry of this.resolution.Resolution_Related_Sessions__r.records) {
          entry.Session__r.start_time = moment.utc(entry.Session__r.Session_Start_Time__c).add(this.meeting.Event_UTC_Offset_in_Hours__c, 'hours').format('h:mm a');
          entry.Session__r.end_time =  moment.utc(entry.Session__r.Session_End_Time__c).add(this.meeting.Event_UTC_Offset_in_Hours__c, 'hours').format('h:mm a'); 
          entry.Session__r.day = moment.utc(entry.Session__r.Session_Start_Time__c).add(this.meeting.Event_UTC_Offset_in_Hours__c, 'hours').format('dddd, MMMM Do YYYY');
        }
      }
      console.log('### resolution: ' + JSON.stringify(this.resolution));

    }, err => {
    }); 
  }

  ngOnInit() {
    this.getVerifiedContact();
  }


  /**
   * evaluateVotingTime : determine if voting is allowed at the current time.
   */
  evaluateVotingTime() { 
    if (this.meeting.Voting_Business_Start__c &&
        this.meeting.Voting_Business_End__c &&
        moment() >= moment(this.meeting.Voting_Business_Start__c) && 
        moment() <= moment(this.meeting.Voting_Business_End__c)) {
      this.showVotingButton = true;
    console.log('### is business');
      this.votingSession = 'Business';
    } else if (this.meeting.Voting_Committee_Start__c &&
        this.meeting.Voting_Committee_End__c &&
        moment() >= moment(this.meeting.Voting_Committee_Start__c) && 
        moment() <= moment(this.meeting.Voting_Committee_End__c)) {
      this.showVotingButton = true;
      this.votingSession = 'Committee';

    } else {
      this.showVotingButton = false;
      this.votingSession = null;          
    }

  }

  changeTab() {

  }


  /**
   * sponsor resolution
   */
  sponsorResolution(contactRoleId: string) {
    let body = {
      contactRoleId: contactRoleId
    }

    this.mayorData.querySf('resolution_sponsors/' + this.resolution.Id, 'POST', true, body).then((data) => {
      this.sponsors = data;
      this.getResolution();
    });
  }


  /**
   * sponsor resolution
   */
  revokeSponsorResolution(sponsorId: string) {
    this.mayorData.querySf('resolution_sponsors', 'DELETE', true, sponsorId).then((data) => {
      this.sponsors.forEach((item, index) => {
        if(item.Id == sponsorId) {
          this.sponsors.splice(index, 1);
        }
      });

      this.resolution.Sponsoring_Mayors__r.records.forEach((item, index) => {
        if(item.Id == sponsorId) {
          this.resolution.Sponsoring_Mayors__r.records.splice(index, 1);
        }
      });
      this.getResolution();
    });
  }

  postSponsor(applySpnsorship : boolean) {

    if(applySpnsorship) {
      this.sponsorResolution(this.verifiedcontact.Contact_Roles__r.records[0].Id);
    } else {
      this.revokeSponsorResolution(this.sponsors[0].Id);
    }


    // // if multiple contact roles, present modal
    // if(this.verifiedcontact && this.verifiedcontact.Contact_Roles__r && this.verifiedcontact.Contact_Roles__r.totalSize > 1) {
    //   let cityModal = this.modalCtrl.create(CityModalPage, { verifiedcontact: this.verifiedcontact, sponsors: this.sponsors, title : 'Sponsor', meeting: this.meeting });
    //   cityModal.present();
    //   cityModal.onDidDismiss(data => {
    //     if(data) {
    //       for(let city of data) {
    //         let found = false;
    //         let contactRoleId = city.Id;
    //         let sponsorId;


    //         for(let sponsor of this.sponsors) {
    //           if(sponsor && sponsor.Contact__r && city && city.Account__r && sponsor.Contact__r.City__c == city.Account__r.City__c) {
    //             found = true;
    //             sponsorId = sponsor.Id;
    //           }
    //         }
    //         if(found && !city.sponsor) {
    //           this.revokeSponsorResolution(sponsorId);
    //         } else if(!found && city.sponsor) {
    //           this.sponsorResolution(contactRoleId);
    //         }
    //       }
    //     }
    //   });

    // } else if(this.verifiedcontact && this.verifiedcontact.Contact_Roles__r && this.verifiedcontact.Contact_Roles__r.totalSize == 1) {
    //   if(applySpnsorship) {
    //     this.sponsorResolution(this.verifiedcontact.Contact_Roles__r.records[0].Id);
    //   } else {
    //     this.revokeSponsorResolution(this.sponsors[0].Id);
    //   }
    // } 
  }


  voteNo(cityId: string, vote: string, voteId: string) {
    let body = {
      cityId: cityId,
      votingSession: this.votingSession,
      vote: vote
    }

    let vote_dialog = 'Revoking Vote';
    if(vote == 'No') {
      vote_dialog = 'Voting No';
    }

    if(voteId) {
      this.mayorData.querySf('votes/' + voteId, 'POST', true, body).then((data) => {
        this.mayorData.querySf('votes/' + this.resolution.Id, 'GET', true, null).then((votes) => { 
          this.votes = votes;
        });
        
      });
    } else {
      this.mayorData.querySf('votes/' + this.resolution.Id, 'POST', true, body).then((data) => {
        this.votes = data;
        this.mayorData.querySf('votes/' + this.resolution.Id, 'GET', true, null).then((votes) => {
          this.votes = votes;
        });
      });
    }
  }

  /**
   * determine how the current user should vote
   */
  postVote(vote: string) {
    if(this.votes[0].voteId) {
      this.voteNo(this.verifiedcontact.Contact_Roles__r.records[0].Account__r.Id, vote, this.votes[0].voteId);
    } else {
      this.voteNo(this.verifiedcontact.Contact_Roles__r.records[0].Account__r.Id, vote, null);
    }

    // // if multiple contact roles, present modal
    // if(this.verifiedcontact && this.verifiedcontact.Contact_Roles__r && this.verifiedcontact.Contact_Roles__r.totalSize > 1) {
    //   let cityModal = this.modalCtrl.create(CityModalPage, { verifiedcontact: this.verifiedcontact, votes: this.votes, title : 'Voting', meeting: this.meeting });
    //   cityModal.present();

    //   cityModal.onDidDismiss(data => {
    //     if(data) {
    //       for(let city of data) {
    //         for(let vote of this.votes) {
    //           if(vote.cityName == city.Account__r.City__c) {
    //             if(city.vote && (!vote.vote || vote.vote == 'Revoked')) {
    //               if(vote && vote.voteId) {
    //                 this.voteNo(city.Account__r.Id, 'No', vote.voteId);
    //               } else {
    //                 this.voteNo(city.Account__r.Id, 'No', null);
    //               }
    //             } else if(!city.vote && (vote.vote && vote.vote == 'No')) {
    //               this.voteNo(city.Account__r.Id, 'Revoked', vote.voteId);
    //             }
    //           }
    //         }
    //       }
    //     }
    //   });

    // } else if(this.verifiedcontact && this.verifiedcontact.Contact_Roles__r && this.verifiedcontact.Contact_Roles__r.totalSize == 1) {
    //   if(this.votes[0].voteId) {
    //     this.voteNo(this.verifiedcontact.Contact_Roles__r.records[0].Account__r.Id, vote, this.votes[0].voteId);
    //   } else {
    //     this.voteNo(this.verifiedcontact.Contact_Roles__r.records[0].Account__r.Id, vote, null);
    //   }
    // } 
  }

  goToMayorDetail(mayor: any) {
    mayor.Contact = mayor.Contact__r;
    let state = { mayor: mayor } ;
    let navigationExtras: NavigationExtras = { state: state };
    this.router.navigate(['/tabs/tabs/meetings/mayors/' + mayor.Id], navigationExtras);
  }


  /** 
   *
   */
  mailResolution() {
    
    let body = '<br/><br/><br/><b><u>' + this.resolution.Long_Name__c + '</u></b><br/><br/>';

    body += '<b>Resolution Number:</b> ' + this.resolution.Resolution_Number__c + '<br/>';
    body += '<b>Status:</b> ' + this.resolution.Status__c + '<br/><br/>';

    let sponsoringMayors = '';
    if (this.resolution && this.resolution.Sponsoring_Mayors__r != null) {
        for(let i = 0; i < this.resolution.Sponsoring_Mayors__r.records.length; i++) {
            sponsoringMayors += '<b>' + this.resolution.Sponsoring_Mayors__r.records[i].Type__c + ':</b> ' +
                                this.resolution.Sponsoring_Mayors__r.records[i].Contact__r.Name + '<br/>' +
                                this.resolution.Sponsoring_Mayors__r.records[i].Contact__r.City__c + ', ' + 
                                this.resolution.Sponsoring_Mayors__r.records[i].Contact__r.State__c +  '<br/>';
        }    
        if (sponsoringMayors != '') sponsoringMayors += '<br/>';
    }

    body += sponsoringMayors;
    body += this.resolution.Resolution_Text__c;

    let email = {
        to: '',
        cc: '',
        bcc: [],
        subject: 'Resolution Number ' + this.resolution.Resolution_Number__c +
                 ' - ' + this.resolution.Name,
        body: body,
        isHtml: true
    };
    this.emailComposer.open(email);
  }


  goToSession(session: any) {
    console.log('### session: ' + JSON.stringify(session));

    let state = { sessionId: session.Session__c, meeting : this.meeting } ;
    let navigationExtras: NavigationExtras = { state: state };
    this.router.navigate(['/tabs/tabs/meetings/session/' + session.Id], navigationExtras);
  }
}
