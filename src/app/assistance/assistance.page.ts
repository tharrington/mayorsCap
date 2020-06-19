import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-assistance',
  templateUrl: './assistance.page.html',
  styleUrls: ['./assistance.page.scss'],
})
export class AssistancePage implements OnInit {
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

  ionViewWillEnter() {
    
  }
}
