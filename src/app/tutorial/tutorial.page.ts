import { Component, OnInit } from '@angular/core';

import { MayorDataService } from '../api/mayor-data.service';
import { Plugins } from '@capacitor/core'; 
const { 
  Storage, 
  Http,
  Platform,
  Browser
} = Plugins;


import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
})
export class TutorialPage implements OnInit {
  refreshToken: string;


  constructor( 
    public mayorData : MayorDataService,
    private iab: InAppBrowser,
    private router: Router,
    public navCtrl : NavController
    ) { 
  }

  ngOnInit() {
  }

  handleLoginEvent(url : string, browser: any) { 
    try {
      let fragment = ((url).split('#')[1]).split('&');
      let oauth = {};
      fragment.forEach(function(entry) {
        let result = entry.split('=');
        oauth[result[0]] = decodeURIComponent((result[1]));
      });

      this.mayorData.setToken(oauth);
      Storage.set({ key : 'token', value : JSON.stringify(oauth)});
      browser.close();
      this.router.navigateByUrl('/tabs/tabs/meetings');
    } catch (err) { 
      browser.close();
    }
  }
 
  startApp() {

    let clientId = this.mayorData.getAppId();
    let redirectUri = 'http://localhost/callback';
    let loginUrl  = this.mayorData.getURL() + 'services/oauth2/authorize?display=touch' +
          '&response_type=token&client_id=' + clientId +
          '&redirect_uri=' + redirectUri;
 
    let options = "location=no,toolbarposition=top,enableViewportScale=yes,closebuttoncaption=Cancel,clearsessioncache=yes,clearcache=yes";

    let browser = this.iab.create(loginUrl, "_blank", options);
      

    browser.on("loadstart").subscribe(
      (event) => {
        if(event.url.substr(0, redirectUri.length) === redirectUri) {
          this.handleLoginEvent(event.url, browser);
        } 
      }, err => { }
    );
  }



  async viewPrivacyPolicy() {
    const policyUrl  = 'https://www.usmayors.org/privacy-policy/'; 
    await Browser.open({ url : policyUrl });
  }
}
