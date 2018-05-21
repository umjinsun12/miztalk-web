import { Functions } from './../../services/shopping-services/functions';
import { Storage } from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage';
import { Values } from './../../services/shopping-services/values';
import { HomeDetailPage } from './../home-detail/home-detail';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController ,Nav} from 'ionic-angular';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { WordpressService } from '../../services/wordpress.service';
import { CardnewsService } from '../../services/shopping-services/cardnews-service'


/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
export interface HomePageInterface {
  title: string;
  pageName: string;
  tabComponent?: any;
  index?: number;
  value : string;
}

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  products:any = [];
  cardnews_order: any = [];
  cardpos:number = 1;
  posts: any;
  
  morePagesAvailable: boolean = true;
  loggedUser: boolean = false;
  homeCategoryId : number = 20;

  categoryId: number;
  categoryTitle: string;

  has_more_items: boolean = true;


  http: Http;


  @ViewChild(Nav) nav: Nav;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public wordpressService: WordpressService,
    public loadingCtrl: LoadingController,
    public values : Values,
    public nativeStorage : NativeStorage,
    public storage : Storage,
    public functions: Functions,
    public service : CardnewsService) {
      this.service.presentLoading('로딩중입니다.');
      this.service.getRandomCardnews().then((results) => this.handlePostResults(results));
  }

  getPostConent(postId:number, postName:string){
    let passData = {name:'', id:0};
    passData.name = postName;
    passData.id = postId;
    this.navCtrl.push(HomeDetailPage, passData);
  }
  
  handlePostResults(results) {
    this.posts = results;
    console.log(this.posts);
    for(let post of this.posts){
      post.excerpt.rendered = post.excerpt.rendered.split('<a')[0] + "</p>";
      if(post._embedded['wp:featuredmedia'][0].media_details != undefined){
          post.thumnail = post['_embedded']['wp:featuredmedia'][0].media_details.sizes.medium.source_url;
      }

      for(let categoryID of post.categories){
        if(categoryID == 20)
            continue;
        else{
            post.categoryName = this.service.categoryArray[categoryID];
            break;
        }
      }
    }
    this.service.dismissLoading();
  }

  ionViewWillEnter() {

  }

  
  openPage(page: HomePageInterface) {
    let params = {};
 
    if (page.index) {
      params = { tabIndex: page.index };
    }
 
    // The active child nav is our Tabs Navigation
    if (this.nav.getActiveChildNav() && page.index != undefined) {
      this.nav.getActiveChildNav().select(page.index);
    } else {
      // Tabs are not active, so reset the root page 
      // In this case: moving to or from SpecialPage
      this.nav.setRoot(page.pageName, params);
    }
  }
 
  isActive(page: HomePageInterface) {
    // Again the Tabs Navigation
    let childNav = this.nav.getActiveChildNav();
 
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }
 
    // Fallback needed when there is no active childnav (tabs not active)
    if (this.nav.getActive() && this.nav.getActive().name === page.pageName) {
      return 'primary';
    }
    return;
  }

  postTapped(event, post) {
		console.log("tab!!!");
  }

  doRefresh(refresher) {
    this.has_more_items = true;
    this.service.getRandomCardnews().then((results) => this.handleRefresh(results, refresher));
  };

  handleRefresh(results, refresher){
    this.posts = results;
    this.service.filter.page = 0;
    console.log(this.posts);
    for(let post of this.posts){
      post.excerpt.rendered = post.excerpt.rendered.split('<a')[0] + "</p>";
      if(post._embedded['wp:featuredmedia'][0].media_details != undefined){
          post.thumnail = post['_embedded']['wp:featuredmedia'][0].media_details.sizes.medium.source_url;
      }

      for(let categoryID of post.categories){
        if(categoryID == 20)
            continue;
        else{
            post.categoryName = this.service.categoryArray[categoryID];
            break;
        }
      }
    }
    refresher.complete();
  }
  

  doInfinite(infiniteScroll) {
    console.log(infiniteScroll);
    this.service.loadMore().then((results) => this.handleMore(results, infiniteScroll));
  }

  handleMore(results, infiniteScroll) {
      if (!results) {
          this.has_more_items = false;
      }
      else{
        for(let post of results){
          post.excerpt.rendered = post.excerpt.rendered.split('<a')[0] + "</p>";
          if(post._embedded['wp:featuredmedia'][0].media_details != undefined){
              post.thumnail = post['_embedded']['wp:featuredmedia'][0].media_details.sizes.medium.source_url;
          }

          for(let categoryID of post.categories){
            if(categoryID == 20)
                continue;
            else{
                post.categoryName = this.service.categoryArray[categoryID];
                break;
            }
          }
          this.posts.push(post);
        }
        console.log(this.posts);
      }
      infiniteScroll.complete();
  }

}
