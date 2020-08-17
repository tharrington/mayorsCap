
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonSearchbar, NavController } from '@ionic/angular';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { MayorDataService } from '../api/mayor-data.service';
import { Plugins } from '@capacitor/core'; 
const { Storage } = Plugins;
import * as moment from 'moment';



@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {
  feed_items = [];
  news_items = [];
  photo_items = [];
  segment = 'headlines';

  constructor(public mayorData: MayorDataService,
    public navCtrl : NavController,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.getSocialPosts();

    this.mayorData.getSocialPosts().then((feed_items) => { 
      Storage.set({ key : 'social', value : JSON.stringify(feed_items) });

      this.feed_items = this.calculatePostTime(feed_items);
      this.parseItems();
    });
  }

  parseItems() {
    this.news_items = [];
    this.photo_items = [];

    for(let feed_item of this.feed_items) {
      if(feed_item.source == 'youtube' || feed_item.source == 'flickr' || feed_item.source == 'instagram') {
        this.photo_items.push(feed_item);
      } else if(feed_item.source == 'rss') {
        this.news_items.push(feed_item);
      }
    }
  }

  /**
   *
   */
  goToNews(news) {
    let navigationExtras: NavigationExtras = { state: { news: news } };
    // this.router.navigate(['/tabs/tabs/news/' + news._id], navigationExtras);

    this.navCtrl.setDirection('forward');

    this.router.navigateByUrl('/tabs/tabs/news/' + news._id, navigationExtras);
     
  }

  async getSocialPosts() {
    const { value } = await Storage.get({ key: 'social' });
    if(value) {
      this.feed_items = JSON.parse(value);
      this.calculatePostTime(this.feed_items);
      this.parseItems();
    }
  }

  calculatePostTime(values) {
    for(let value of values) {
      value.time_ago = moment(value.date).fromNow();  
    }
    return values;
  }
}
