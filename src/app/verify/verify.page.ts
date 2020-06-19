import { Component, OnInit } from '@angular/core';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core'; 
const { Storage, Modals } = Plugins;
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { MayorDataService } from '../api/mayor-data.service';


@Component({
  selector: 'app-verify',
  templateUrl: './verify.page.html',
  styleUrls: ['./verify.page.scss'],
})
export class VerifyPage implements OnInit {
  profile : any;
  code : string = '';

  constructor(
    public mayorData         : MayorDataService,
    private router           : Router,
    private activatedRoute   : ActivatedRoute,
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.profile = this.router.getCurrentNavigation().extras.state.profile;
      }
    });
  }

  ngOnInit() {

  }

  async verifyCodeWithData(data) {
    if(data && data['status'] == 'error') {
      let alertRet = await Modals.alert({
        title: 'Unable to verify your account.',
        message: 'We were unable to verify your account with that code.'
      });
    } else {
      let alertRet = await Modals.alert({
        title: 'Account Verified',
        message: 'Account was verified.'
      });
    }
  }

  async enterCode() {
    let promptRet = await Modals.prompt({
      title: 'Please enter your verification code.',
      message: 'What\'s your name?'
    });
  }

  verify() {
    console.log('### verifying: ' + this.code);
    if(this.code && this.code != '') {
      let body = { verificationCode : this.code }

      this.mayorData.querySf('sendcode', 'POST', true, body).then((data) => {

        this.verifyCodeWithData(data);
        
      });
    } else {
      this.enterCode();
    }
  }

  async promptCode(data) {
    let confirmRet = await Modals.confirm({
      title: data['status'],
      message: data['message']
    }); 
  }

  sendCode() {
    this.mayorData.querySf('sendcode', 'GET', true, null).then((data) => {

      console.log('### data: ' + JSON.stringify(data));
      this.promptCode(data);
          
    });
  }
}
