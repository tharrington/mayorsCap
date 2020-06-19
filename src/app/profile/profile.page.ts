import { Component, OnInit } from '@angular/core';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core'; 
const { Storage, Modals } = Plugins;
import { Router, NavigationExtras } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MayorDataService } from '../api/mayor-data.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profile : any;
  verifiedcontact : any;
  photo: SafeResourceUrl;

  constructor(
    public mayorData         : MayorDataService,
    private sanitizer        : DomSanitizer,
    private router           : Router,
    private transfer         : FileTransfer, 
    private iab              : InAppBrowser
  ) { 
  }

  ngOnInit() {
    this.getProfile();
    this.getVerifiedContact();

    this.mayorData.querySf('myprofile', 'GET', true, null).then((profile) => {
      Storage.set({ key : 'myprofile', value : JSON.stringify(profile) });
      this.profile = profile;

    }, (err) => {
    });

    this.mayorData.querySf('verifiedcontact', 'GET', true, null).then((verifiedcontact) => {
      Storage.set({ key : 'verifiedcontact', value : JSON.stringify(verifiedcontact) });
      this.verifiedcontact = verifiedcontact;
    });
  }

  async getProfile() {
    const { value } = await Storage.get({ key: 'myprofile' });
    this.profile = JSON.parse(value);
  }

  async getVerifiedContact() {
    const { value } = await Storage.get({ key: 'verifiedcontact' });
    this.verifiedcontact = JSON.parse(value);
  }



  viewPrivacyPolicy() {
    let policyUrl  = 'https://www.usmayors.org/privacy-policy/';
    let options = "location=no,toolbarposition=top,closebuttoncaption=Cancel,clearsessioncache=yes,clearcache=yes";
    let browser = this.iab.create(policyUrl, "_blank", options);
  }




  /**
   * Save Profile
   */
  saveProfile() {
    let profile = {
      firstName : this.profile.FirstName,
      lastName : this.profile.LastName,
      email : this.profile.Email,
      newPassword : this.profile.newPassword
    }
    if(this.profile.newPassword && this.profile.newPassword.length < 8) {
    } else {
      if (this.profile.FirstName ||
      this.profile.LastName ||
      this.profile.Email ||
      this.profile.newPassword) {

        this.mayorData.querySf('myprofile', 'POST', true, profile).then((profile) => { 
          Storage.set({ key : 'myprofile', value : JSON.stringify(this.profile) });
        });
              
      }
    }
  }

  /**
   * Verify Profile
   */
  verifyProfile() {
    let navigationExtras: NavigationExtras = { state: { profile: this.profile } };
    this.router.navigate(['/tabs/tabs/home/verify'], navigationExtras);
  }


  uploadPhoto(imageURI) {
    const fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
      params : { 'upload_preset': 'jLsFfG2crUmusSimBS5f8tjL3GFX' }
    }    
    // console.log('### imageURI: ' + imageURI);

    fileTransfer.upload(imageURI, 'http://api.cloudinary.com/v1_1/usmayors/image/upload', options)
      .then((data) => {
        console.log('### got xxx : ');

        let response = JSON.parse(decodeURIComponent(data.response));
        this.profile.Image_URL__c = response.secure_url;
        this.mayorData.querySf('myprofile', 'PUT', true, { imageUrl: encodeURI(response['secure_url'] )}).then((profile: any) => {
          console.log('### got profile: ');
        });
      }, (err) => {
        console.log('#### ERR');
    })
  }

  async takePicture() {
    const image = await Plugins.Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });

    // this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));
    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image.base64String);
    // this.profile.Image_URL__c = this.photo;
    // let base64Image = 'data:image/jpeg;base64,' + image.dataUrl;
    this.uploadPhoto(image.base64String);
  }

  async takePictureFromLibrary() {
    const image = await Plugins.Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos
    });


    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));
    this.profile.Image_URL__c = this.photo;
    // let base64Image = 'data:image/jpeg;base64,' + image.dataUrl;
    console.log('### take from lib');
    this.uploadPhoto(image.dataUrl);
  }

  async showCameraOptions() {
    let promptRet = await Modals.showActions({
      title: 'Photo Options',
      message: 'Select an option to perform',
      options: [
        { title: 'Use Camera' },
        { title: 'Choose From Library' },
        { title: 'Cancel' }
      ]
    });

    if(promptRet.index == 0) {
      this.takePicture();
    } else if(promptRet.index == 1) {
      this.takePictureFromLibrary();
    }
  }

  /**
   *
   */
  mayorUpdateRequest() {
    // https://capacitor.ionicframework.com/docs/apis/modals
    if(this.verifiedcontact && this.verifiedcontact.Contact_Roles__r.totalSize > 1) {
      let navigationExtras: NavigationExtras = { state: { verifiedcontact: this.verifiedcontact } };
      this.router.navigate(['/tabs/tabs/home/mayors-update'], navigationExtras);
    } else {
      let navigationExtras: NavigationExtras = { state: { verifiedcontact: this.verifiedcontact } };
      this.router.navigate(['/tabs/tabs/home/mayors-update/' + this.verifiedcontact.Contact_Roles__r[0].Id], navigationExtras);
    }
  }
  

  logout() {
    Storage.clear();
    // this.router.navigate([''], null);
    this.router.navigateByUrl('/');
    // let state = {  } ;
    // let navigationExtras: NavigationExtras = { state: state };
    // this.router.navigate([''], navigationExtras);
  }


}
