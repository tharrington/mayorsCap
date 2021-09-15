
import { Component, ViewChild, ElementRef, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras} from '@angular/router';

import { SearchPipe } from '../core/search.pipe';

import { MayorDataService } from '../api/mayor-data.service';
import { Plugins } from '@capacitor/core'; 
const { Storage } = Plugins;
import * as moment from 'moment';


@Component({
  selector: 'app-committees-detail',
  templateUrl: './committees-detail.page.html',
  styleUrls: ['./committees-detail.page.scss'],
})
export class CommitteesDetailPage implements OnInit {
  committee: any;
  meeting: any;
  members: any = [];

  constructor(
    public mayorData       : MayorDataService,
    private activatedRoute : ActivatedRoute,
    private router         : Router
  ) {
    
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.committee = this.router.getCurrentNavigation().extras.state.committee;
        this.meeting = this.router.getCurrentNavigation().extras.state.meeting;
        console.log('### committe:: ' + JSON.stringify(this.committee));
        if(this.committee && this.committee.Committee_Members__r) {
          for(let member of this.committee.Committee_Members__r.records) {
            console.log('### member: ' + member.Type__c);
            if(member.Type__c == 'Member' || member.Type__c == 'Chair' || member.Type__c == 'Vice Chair' || member.Type__c == 'Co-Chair') {
              this.members.push(member);
            }
          }
        }

      }
    });  
  }

  ngOnInit() {
  }

  goToDetail(member : any) {
    console.log('### member: ' + JSON.stringify(member));
    if(!member.Contact) {
      member.Contact = member.Contact__r;
    }
    let navigationExtras: NavigationExtras = { state: { mayor: member } };
    this.router.navigate(['/tabs/tabs/meetings/mayors/' + member.Id], navigationExtras);

  }
}
