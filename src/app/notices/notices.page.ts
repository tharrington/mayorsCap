import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-notices',
  templateUrl: './notices.page.html',
  styleUrls: ['./notices.page.scss'],
})
export class NoticesPage implements OnInit {
  meeting : any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
   ) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.meeting = this.router.getCurrentNavigation().extras.state.meeting;
      }
    });
  }

  ngOnInit() {
  }

}
