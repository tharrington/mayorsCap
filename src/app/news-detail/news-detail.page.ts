import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.page.html',
  styleUrls: ['./news-detail.page.scss'],
})
export class NewsDetailPage implements OnInit {
  news;
  
  constructor(
    private activatedRoute   : ActivatedRoute,
    private router           : Router,
    private iab              : InAppBrowser,
  ) { 
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.news = this.router.getCurrentNavigation().extras.state.news;
      }
    });
  }

  ngOnInit() {
  }

  view() { 
    window.open(this.news.weblink, '_system', 'location=yes');
  }

}
