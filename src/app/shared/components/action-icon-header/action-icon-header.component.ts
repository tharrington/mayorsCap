import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-action-icon-header',
  templateUrl: './action-icon-header.component.html',
  styleUrls: ['./action-icon-header.component.scss'],
})
export class ActionIconHeaderComponent implements OnInit {

  @Input() defaultHref: any;
  @Input() actionIcon: any;

  @Output() onClick = new EventEmitter();

  isAndroid: boolean = false;

  constructor(private platform: Platform) { }

  ngOnInit() {
    if(this.platform.is('android')) {
      this.isAndroid = true;
    } else
      this.isAndroid = false;
  }

  click() {
    this.onClick.emit();
  }

}
