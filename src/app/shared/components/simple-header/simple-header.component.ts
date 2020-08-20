import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-simple-header',
  templateUrl: './simple-header.component.html',
  styleUrls: ['./simple-header.component.scss'],
})
export class SimpleHeaderComponent implements OnInit {

  @Input() title: any;
  
  isAndroid: boolean = false;

  constructor(private platform: Platform) { }

  ngOnInit() {
    if(this.platform.is('android')) {
      this.isAndroid = true;
    } else
      this.isAndroid = false;
  }

}
