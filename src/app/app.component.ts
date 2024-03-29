import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';

import { Plugins, registerWebPlugin } from '@capacitor/core'; 
const { Storage } = Plugins;

/**
Android build
ionic cordova build android --release --versionCode=153 (unique code)

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore android_app.keystore ./platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk uscm

Password: isbell26
Password 2: uscm15

uscm2020

/Users/tylerharrington/Library/Android/sdk/build-tools/27.0.3/zipalign -v 4 ./platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk ./platforms/android/app/build/outputs/apk/release/uscm.apk


 android sdk:


*/

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router
  ) {

    this.findToken();
  }

  async findToken() {
    const { value } = await Storage.get({ key: 'token' });
    this.initializeApp(value);
  }

  initializeApp(value : any) {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      if(value) {
        this.router.navigateByUrl('/tabs/tabs/meetings');
      } 
    });
  }

}
