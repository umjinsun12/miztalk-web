import { WordpressService } from './../../services/wordpress.service';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, LoadingController} from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from '../../services/authentication.service';
import { PromiseObservable } from 'rxjs/observable/PromiseObservable';
import {Observable} from 'rxjs/Rx';
import { forkJoin } from "rxjs/observable/forkJoin";

/**
 * Generated class for the CommunityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export interface CommunityPageInterface {
  title: string;
  pageName: string;
  tabComponent?: any;
  index?: number;
  value : string;
}

@IonicPage()
@Component({
  selector: 'page-community',
  templateUrl: 'community.html',
})
export class CommunityPage {


  tab1Root: any = 'CommunityMainPage';
  tab2Root: any = 'CommunityClinicPage';
  tab3Root: any = 'CommunityUsedmarketPage';
  myIndex: number;
 
  rootPage = 'CommunityMainPage';
  topTab = 'tab1Root';

  posts: Array<any> = new Array<any>();
  morePagesAvailable: boolean = true;
  loggedUser: boolean = false;

  categoryId: number;
  categoryTitle: string;
  http: Http;

 
  // Reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

 
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public wordpressService: WordpressService,
    public loadingCtrl: LoadingController) { 
    this.myIndex = navParams.data.tabIndex || 0;
    this.topTab = 'tab1Root';
  }


  segmentChanged(){
    console.log(this.topTab);
    
  }


  ionViewWillEnter() {
    this.morePagesAvailable = true;
    //if we are browsing a category
    this.categoryId = this.navParams.get('id');
    this.categoryTitle = this.navParams.get('title');

    if(!(this.posts.length > 0)){
      let loading = this.loadingCtrl.create();
      loading.present();

      this.wordpressService.getRecentPosts(this.categoryId)
      .subscribe(data => {
        var authordatas = [];
        for(let post of data){          
          authordatas.push(this.wordpressService.getAuthor(post.author));
          post.excerpt.rendered = post.excerpt.rendered.split('<a')[0] + "</p>";
        }

        forkJoin(authordatas).subscribe(results => {
          for(var i= 0 ; i < data.length ; i++){
            data[i].authordata = results[i];
            this.posts.push(data[i]);
            console.log(this.posts);
          }
          loading.dismiss();
        });
      });

      
      
      
    }
  }


  getRecentPosts(categoryId:number, page:number = 1) {
    //if we want to query posts by category
    let category_url = categoryId? ("&categories=" + categoryId): "";
  
    
  }

  
  openPage(page: CommunityPageInterface) {
    let params = {};
 
    // The index is equal to the order of our tabs inside tabs.ts
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
 
  isActive(page: CommunityPageInterface) {
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

    console.log('reload');
    console.log(this.posts);
    this.wordpressService.getRecentPosts(this.categoryId)
      .subscribe(data => {
        for(let post of data){
          post.excerpt.rendered = post.excerpt.rendered.split('<a')[0] + "</p>";
          this.posts.push(post);
        }
        refresher.complete();
      });
    };
  

  doInfinite(infiniteScroll) {
    let page = (Math.ceil(this.posts.length/10)) + 1;
    let loading = true;

    this.wordpressService.getRecentPosts(this.categoryId, page)
    .subscribe(data => {
      for(let post of data){
        if(!loading){
          infiniteScroll.complete();
        }
        post.excerpt.rendered = post.excerpt.rendered.split('<a')[0] + "</p>";
        this.posts.push(post);
        loading = false;
      }
    }, err => {
      this.morePagesAvailable = false;
    })
  }

}
