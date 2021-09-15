
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonSearchbar, NavController, PickerController } from '@ionic/angular';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { PickerOptions } from "@ionic/core";

import { SearchPipe } from '../core/search.pipe';

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

  isAttendee = false;
  resbycommittee;
  showSponsorship = false;
  showVotingButton = false;
  verifiedcontact;
  votingOpen = false;
  sponsorOpen = false;
  selVerifiedContact;
  selVerifiedContactDisplayName;
  votes = [];          // votes for which the current user owns
  sponsors = [];       // sponsoships for which the current user owns
  allVotes = [];          // votes for which the current user owns
  allSponsors = [];       // sponsoships for which the current user owns


  @ViewChild(IonContent, {static: false}) content : IonContent;

  constructor(
    public navCtrl           : NavController,
    public mayorData         : MayorDataService,
    private pickerController : PickerController,

    private router           : Router,
    private activatedRoute   : ActivatedRoute,
    private emailComposer    : EmailComposer
  ) {

    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.meeting = this.router.getCurrentNavigation().extras.state.meeting;
        this.resolution = this.router.getCurrentNavigation().extras.state.resolution;

        
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
      this.determineVoting();
    }

    this.mayorData.querySf('verifiedcontact', 'GET', true, null).then((verifiedcontact) => {
      Storage.set({ key: 'verifiedcontact', value : JSON.stringify(verifiedcontact) });
      this.verifiedcontact = verifiedcontact;
      console.log('### verifiedcontact: ' + JSON.stringify(verifiedcontact));

      if(this.verifiedcontact && this.verifiedcontact.Contact_Roles__r) {

        if(this.verifiedcontact.Contact_Roles__r.totalSize > 0) {
          this.selVerifiedContact = this.verifiedcontact.Contact_Roles__r.records[0].Id;
          this.selVerifiedContactDisplayName = this.verifiedcontact.Contact_Roles__r.records[0].Account__r.City__c + ', ' + this.verifiedcontact.Contact_Roles__r.records[0].Account__r.State__c;
        }

        this.isVerifiedContact = true;
        this.getVotes();
        this.getResSponsers();   

      }
      this.getResolution();
      
    });
  }

  matchVotes() {
    let votes = [];
    if(this.verifiedcontact && this.verifiedcontact.Contact_Roles__r) {
      for (let con of this.verifiedcontact.Contact_Roles__r.records) {
        if (con.Id == this.selVerifiedContact) {
          for (let vote of this.allVotes) {
            if (vote.cityName == con.Account__r.City__c) {
              votes.push(vote);
            }
          }
        }
      }
    }

    this.votes = votes;
  }

  matchSponsors() {
    let sponsors = [];
    for(let con of this.verifiedcontact.Contact_Roles__r.records) {
      for(let sponsor of this.allSponsors) {
        if(sponsor.Contact__r.City__c == con.Account__r.City__c && con.Id == this.selVerifiedContact) {
          sponsors.push(sponsor);
        }
      }
    }

    this.sponsors = sponsors;
  }

  async getVotes() {
    const { value } = await Storage.get({ key: 'votes/' + this.resolution.Id });
    if(value) {
      this.allVotes = JSON.parse(value);
      this.matchSponsors();
    }

    this.mayorData.querySf('votes/' + this.resolution.Id, 'GET', true, null).then((votes) => {
      Storage.set({ key: 'votes/' + this.resolution.Id, value : JSON.stringify(votes) });
      this.allVotes = votes;
      this.matchVotes();
    });
  }

  async getResSponsers() {
    const { value } = await Storage.get({ key: 'resolution_sponsors/' + this.resolution.Id });
    if(value) {
      this.allSponsors = JSON.parse(value);
      this.matchSponsors();
    }

    this.mayorData.querySf('resolution_sponsors/' + this.resolution.Id, 'GET', true, null).then((sponsors) => {
      Storage.set({ key: 'resolution_sponsors/' + this.resolution.Id, value : JSON.stringify(sponsors) });
      this.allSponsors = sponsors;
      this.matchSponsors();
    });
  }


  /**
   *
   */
  determineSponsorship() {
    this.showSponsorship = false;
    this.sponsorOpen = false;

    if(this.resbycommittee) {
      for(let resbycomm of this.resbycommittee) {
        if(this.selVerifiedContact == resbycomm.role.Id && (resbycomm.canSponsorSubmission || resbycomm.canSponsorPrior)) {
          this.showSponsorship = true;
        }
        if(resbycomm.canSponsorSubmission || resbycomm.canSponsorPrior) {
          this.sponsorOpen = true;
        }
      }
      console.log('### sponsorOpen open: ' + this.sponsorOpen);
    }
    
  }

  /**
   *
   */
  determineVoting() {
    // this.selVerifiedContact = this.verifiedcontact.Contact_Roles__r.records[0].Id;
    this.showVotingButton = false;
    this.votingOpen = false;
    console.log('### this.selVerifiedContact: ' + this.selVerifiedContact);
    if(this.resbycommittee) {
      for(let resbycomm of this.resbycommittee) {
        if(this.selVerifiedContact == resbycomm.role.Id && (resbycomm.canVoteBusiness || resbycomm.canVoteCommittee)) {
          this.showVotingButton = true;

          if(resbycomm.canVoteBusiness) {
            this.votingSession = 'Business';
          } else {
            this.votingSession = 'Committee';
          }
        }
        if(resbycomm.canVoteBusiness || resbycomm.canVoteCommittee) {
          this.votingOpen = true;
        }
      }
      console.log('### voting open: ' + this.votingOpen);
    }
  }

  determineVotingSponsorship() {
    this.mayorData.querySf('resbycommittee/' + this.resolution.Id, 'GET', true, null).then((resbycommittee) => {
      console.log('### resbycommittee: ' + JSON.stringify(resbycommittee));
      this.resbycommittee = resbycommittee;
      this.determineVoting();
      this.determineSponsorship();
    }, err => {
    }); 
  }

  /**
   *
   */
  getResolution() {
    console.log('### resoltion: ' + JSON.stringify(this.resolution));
    this.mayorData.querySf('resolutions/' + this.resolution.Id, 'GET', true, null).then((resolutions) => {

      console.log('### resolutions[0]: ' + JSON.stringify(resolutions));

      if(resolutions && resolutions.length > 0) {
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

        this.determineVotingSponsorship();
      }


    }, err => {
    }); 
  }


  /**
   *
   */
  ngOnInit() {
    this.getVerifiedContact();
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


  /**
   * open date picker
   */
  async openPicker(){
    let col_options = [];

    for(let con of this.verifiedcontact.Contact_Roles__r.records) {
      col_options.push({ text: con.Account__r.City__c + ', ' + con.Account__r.State__c, value: con.Id });
    }
    
    let options: PickerOptions = {
      buttons: [
        {
          text: "Cancel",
          role: 'cancel'
        },
        {
          text:'Ok',
          handler:(value:any) => {
            console.log('### val: ', value);
            this.selVerifiedContact = value.City.value;
            this.selVerifiedContactDisplayName = value.City.text;
            this.determineVoting();
            this.determineSponsorship();
            let votes = [];
            let sponsors = [];
            for(let con of this.verifiedcontact.Contact_Roles__r.records) {
              if(con.Id == this.selVerifiedContact) {
                for(let vote of this.allVotes) {
                  if(vote.cityName == con.Account__r.City__c) {
                    votes.push(vote);
                  }
                }

                for(let sponsor of this.allSponsors) {
                  if(sponsor.Contact__r.City__c == con.Account__r.City__c) {
                    sponsors.push(sponsor);
                  }
                }
              }
            }
            console.log('### votes: ' + JSON.stringify(votes));
            console.log('### sponsors: ' + JSON.stringify(sponsors));
            this.votes = votes;
            this.sponsors = sponsors;

          }
        }
      ],
      columns:[{
        name: 'City',
        options: col_options
      }]
    };

    let picker = await this.pickerController.create(options);
    picker.present()
  }

  postSponsor(applySpnsorship : boolean) {
    if(applySpnsorship) {
      // this.sponsorResolution(this.verifiedcontact.Contact_Roles__r.records[0].Id);
      this.sponsorResolution(this.selVerifiedContact);
    } else {
      this.revokeSponsorResolution(this.sponsors[0].Id);
    }
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
      for(let con of this.verifiedcontact.Contact_Roles__r.records) {
        if(con.Id == this.selVerifiedContact) {
          this.voteNo(con.Account__r.Id, vote, this.votes[0].voteId);
        }
        // this.voteNo(this.verifiedcontact.Contact_Roles__r.records[0].Account__r.Id, vote, this.votes[0].voteId);
      }
      
    } else {

      for(let con of this.verifiedcontact.Contact_Roles__r.records) {
        if(con.Id == this.selVerifiedContact) {
          this.voteNo(con.Account__r.Id, vote, null);
        }
      }
      
      // this.voteNo(this.verifiedcontact.Contact_Roles__r.records[0].Account__r.Id, vote, null);
    }
    

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
    let state = { sessionId: session.Session__c, meeting : this.meeting } ;
    let navigationExtras: NavigationExtras = { state: state };
    this.router.navigate(['/tabs/tabs/meetings/session/' + session.Id], navigationExtras);
  }
}
