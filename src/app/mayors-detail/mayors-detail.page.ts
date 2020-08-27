import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Plugins, AppState } from '@capacitor/core';
const { App } = Plugins;

declare var window;
import * as moment from 'moment';
import { MayorDataService } from '../api/mayor-data.service';


@Component({
  selector: 'app-mayors-detail',
  templateUrl: './mayors-detail.page.html',
  styleUrls: ['./mayors-detail.page.scss'],
})
export class MayorsDetailPage implements OnInit {
  mayorId = null;
  mayor : any = { Contact : {}}; 

  constructor(
    private activatedRoute   : ActivatedRoute,
    public mayorData         : MayorDataService,
    private router           : Router
  ) { 
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.mayor = this.router.getCurrentNavigation().extras.state.mayor;
      }
    });
  }

  ionViewWillEnter() {
    console.log('### mayor: ' + 'contacts/' + this.mayor.Contact.Id);
    this.mayorData.querySf('contacts/' + this.mayor.Contact.Id, 'GET', true, null).then((con) => {

      console.log('### con: ' + JSON.stringify(con));


      if(con && con.length > 0) {
        this.mayor.Contact__r = con[0];    
        this.mayor.Contact = con[0];    
      }
    }, err => {
    });

    this.mayorData.querySf('contacts', 'GET', true, null).then((contacts) => {
      this.findContact(contacts);
      this.doGeocode();
    }, err => {
    });
  }

  ngOnInit() {
  }

  findContact(contacts : any[]) {
    if(contacts && contacts.length > 0) {
      for(let contact of contacts) {
        if(contact && this.mayor && this.mayor.Contact && contact.Id == this.mayor.Contact.Id) {
          this.mayor.Contact__r = contact;    
          this.mayor.Contact = contact;  
          break;
        }
      }
    }
  }


  doGeocode() {
    let city = this.mayor.Contact.City__c;
    let mayor_state = this.mayor.Contact.State__c;

    let state_abbreviation = mayor_state;

    let states = [
      { "name": "Alabama", "abbreviation": "AL" },
      { "name": "Alaska", "abbreviation": "AK" },
      { "name": "American Samoa", "abbreviation": "AS" },
      { "name": "Arizona", "abbreviation": "AZ" },
      { "name": "Arkansas", "abbreviation": "AR" },
      { "name": "California", "abbreviation": "CA" },
      { "name": "Colorado", "abbreviation": "CO" },
      { "name": "Connecticut", "abbreviation": "CT" },
      { "name": "Delaware", "abbreviation": "DE" },
      { "name": "District Of Columbia", "abbreviation": "DC" },
      { "name": "Federated States Of Micronesia", "abbreviation": "FM" },
      { "name": "Florida", "abbreviation": "FL" },
      { "name": "Georgia", "abbreviation": "GA" },
      { "name": "Guam", "abbreviation": "GU" },
      { "name": "Hawaii", "abbreviation": "HI" },
      { "name": "Idaho", "abbreviation": "ID" },
      { "name": "Illinois", "abbreviation": "IL" },
      { "name": "Indiana", "abbreviation": "IN" },
      { "name": "Iowa", "abbreviation": "IA" },
      { "name": "Kansas", "abbreviation": "KS" },
      { "name": "Kentucky", "abbreviation": "KY" },
      { "name": "Louisiana", "abbreviation": "LA" },
      { "name": "Maine", "abbreviation": "ME" },
      { "name": "Marshall Islands", "abbreviation": "MH" },
      { "name": "Maryland", "abbreviation": "MD" },
      { "name": "Massachusetts", "abbreviation": "MA" },
      { "name": "Michigan", "abbreviation": "MI" },
      { "name": "Minnesota", "abbreviation": "MN" },
      { "name": "Mississippi", "abbreviation": "MS" },
      { "name": "Missouri", "abbreviation": "MO" },
      { "name": "Montana", "abbreviation": "MT" },
      { "name": "Nebraska", "abbreviation": "NE" },
      { "name": "Nevada", "abbreviation": "NV" },
      { "name": "New Hampshire", "abbreviation": "NH" },
      { "name": "New Jersey", "abbreviation": "NJ" },
      { "name": "New Mexico", "abbreviation": "NM" },
      { "name": "New York", "abbreviation": "NY" },
      { "name": "North Carolina", "abbreviation": "NC" },
      { "name": "North Dakota", "abbreviation": "ND" },
      { "name": "Northern Mariana Islands", "abbreviation": "MP" },
      { "name": "Ohio", "abbreviation": "OH" },
      { "name": "Oklahoma", "abbreviation": "OK" },
      { "name": "Oregon", "abbreviation": "OR" },
      { "name": "Palau", "abbreviation": "PW" },
      { "name": "Pennsylvania", "abbreviation": "PA" },
      { "name": "Puerto Rico", "abbreviation": "PR" },
      { "name": "Rhode Island", "abbreviation": "RI" },
      { "name": "South Carolina", "abbreviation": "SC" },
      { "name": "South Dakota", "abbreviation": "SD" },
      { "name": "Tennessee", "abbreviation": "TN" },
      { "name": "Texas", "abbreviation": "TX" },
      { "name": "Utah", "abbreviation": "UT" },
      { "name": "Vermont", "abbreviation": "VT" },
      { "name": "Virgin Islands", "abbreviation": "VI" },
      { "name": "Virginia", "abbreviation": "VA" },
      { "name": "Washington", "abbreviation": "WA" },
      { "name": "West Virginia", "abbreviation": "WV" },
      { "name": "Wisconsin", "abbreviation": "WI" },
      { "name": "Wyoming", "abbreviation": "WY" }
    ];

    for(let state of states) {
      if(state.name == mayor_state) {
        state_abbreviation = state.abbreviation;
      }
    }
  }


  async goToLink(urlString, open_app){

    if(open_app) {
      var ret = await App.canOpenUrl({ url: 'com.facebook.katana' });
      var retx = await App.openUrl({ url:'com.facebook.katana' })
    } else {
      window.open(urlString, '_system');
    }
    
  }

  formatNumber(num : number) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  stripUsername(urlString : string) {
    let index = urlString.indexOf('.com/')
    return '@' + urlString.substr(index + 5);
  }

  dialPhone() {
    window.location = 'tel:' + this.mayor.Contact.Phone;
  }

  formatDate(dateString: string) {
    let formatted_date = moment(dateString);
    return formatted_date.format('MM/DD/YYYY');
  }

  mailTo(email) {
    window.open('mailto:${email}', '_system');
  }

  goToSessionDetail(session: any) {

  }
}
