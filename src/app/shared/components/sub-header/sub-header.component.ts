import { Component, OnInit, Input } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.scss'],
})
export class SubHeaderComponent implements OnInit {

  @Input() title: any;
  @Input() defaultHref: any;

  isAndroid: boolean = false;

  constructor(private platform: Platform) { }

  ngOnInit() {
    if(this.platform.is('android')) {
      this.isAndroid = true;
    } else
      this.isAndroid = false;
  }

}
