import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MayorDataService } from '../api/mayor-data.service';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

declare var window;
import * as moment from 'moment';
@Component({
  selector: 'app-policies-detail',
  templateUrl: './policies-detail.page.html',
  styleUrls: ['./policies-detail.page.scss'],
})
export class PoliciesDetailPage implements OnInit {
  policy: any;

  constructor(
    public mayorData         : MayorDataService,
    private activatedRoute   : ActivatedRoute,
    private router           : Router,
    private emailComposer    : EmailComposer
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.policy = this.router.getCurrentNavigation().extras.state.policy;
      }
    });
  }

  ngOnInit() {
    this.mayorData.querySf('resolutions/' + this.policy.Id, 'GET', false, null).then((policy) => {
      this.policy = policy[0];

      if(this.policy  && this.policy.Adopted_Date__c) {
        this.policy.adopted_date = moment.utc(this.policy.Adopted_Date__c).format('M/D/YYYY');
      }
    }, err => {
    }); 
  }

  sharePolicy() {
    let body = '<br/><br/><br/><b><u>' + this.policy.Long_Name__c + '</u></b><br/><br/>';

    body += '<b>Category:</b> ' + this.policy.Category__c + '<br/>';
    body += '<b>Adopted Date:</b> ' + this.policy.adopted_date + '<br/><br/>';


    body += this.policy.Resolution_Text__c;

    let email = {
        to: '',
        cc: '',
        bcc: [],
        subject: this.policy.Long_Name__c,
        body: body,
        isHtml: true
    };
    this.emailComposer.open(email);
  }
}
