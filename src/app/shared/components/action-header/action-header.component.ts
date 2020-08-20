import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-action-header',
  templateUrl: './action-header.component.html',
  styleUrls: ['./action-header.component.scss'],
})
export class ActionHeaderComponent implements OnInit {

  @Input() defaultHref: any;
  @Input() actionTitle: any;
  @Input() title: any;

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
