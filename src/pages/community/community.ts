import { CommunityWritePage } from './../community-write/community-write';
import { Values } from './../../services/shopping-services/values';
import { WordpressService } from './../../services/wordpress.service';
import { Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, LoadingController, Slides} from 'ionic-angular';
import { Http } from '@angular/http';
import { AuthenticationService } from '../../services/authentication.service';
import * as moment from 'moment';
import { CommunityDetailPage } from '../community-detail/community-detail';

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

  @ViewChild('mySlider') slider: Slides;
  selectedSegment: string;
  slides: any;


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

  activeIndex: any = 0;

 
  // Reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

 
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public wordpressService: WordpressService,
    public loadingCtrl: LoadingController,
    public values: Values) { 
    this.myIndex = navParams.data.tabIndex || 0;
    this.selectedSegment = 'main';
    moment.locale('ko');
    this.slides = [
      {
        id: "main",
        title: "메인",
        categoryid: 23
      },
      {
        id: "clinic",
        title: "부부클리닉",
        categoryid: 25
      },
      {
        id: "usedmarket",
        title: "중고장터",
        categoryid: 26
      },
      {
        id: "boast",
        title: "자랑거리",
        categoryid: 24
      }
    ];
    
  }


  segmentChanged(){
    console.log("adsfsdfs");
    console.log(this.topTab);
  }

  getPostCategory(categoryid){
      let loading = this.loadingCtrl.create();
      loading.present();

      this.posts = [];
      this.wordpressService.getPostEmbedbyCategory(categoryid).subscribe(data=>{
        console.log(data);
        this.posts = [];
        for(let post of data){
          post.excerpt.rendered = post.excerpt.rendered.split('<a')[0].replace("<p>","").replace("</p>","");
          post.author = post._embedded['author'][0].name;
          post.reltime = moment(post.date).fromNow();
          post.replies = 0;
          if(post._embedded.replies != undefined)
            post.replies = post._embedded.replies[0].length;
          else
            post.replies = 0;
          this.posts.push(post);
        }
        loading.dismiss();
      });
  }


  onSegmentChanged(segmentButton) {
    console.log("Segment changed to", segmentButton.value);
    const selectedIndex = this.slides.findIndex((slide) => {
      if(slide.id === segmentButton.value){
        this.categoryId = slide.categoryid;
        this.getPostCategory(slide.categoryid);
        return slide.id === segmentButton.value;
      }
    });
    this.activeIndex = selectedIndex;
    this.slider.slideTo(selectedIndex);
  }

  onSlideChanged(slider) {
    console.log('Slide changed');
    console.log(slider.getActiveIndex());
    this.activeIndex = slider.getActiveIndex();
    if(slider.getActiveIndex()>=4)
      return;
    
    const currentSlide = this.slides[slider.getActiveIndex()];
    this.selectedSegment = currentSlide.id;
  }






  ionViewWillEnter() {
    this.morePagesAvailable = true;
    //if we are browsing a category
    this.categoryId = this.slides[this.activeIndex].categoryid;
    console.log(this.categoryId);
    this.categoryTitle = this.navParams.get('title');
    this.getPostCategory(this.categoryId);
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
      this.wordpressService.getPostEmbedbyCategory(this.categoryId).subscribe(data=>{
        console.log(data);
        this.posts = [];
        for(let post of data){
          post.excerpt.rendered = post.excerpt.rendered.split('<a')[0].replace("<p>","").replace("</p>","");
          post.author = post._embedded['author'][0].name;
          post.reltime = moment(post.date).fromNow();
          post.replies = 0;
          if(post._embedded.replies != undefined)
            post.replies = post._embedded.replies[0].length;
          else
            post.replies = 0;
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

  getPostConent(postId:number, postName:string){
    let passData = {name:'', id:0};
    passData.name = postName;
    passData.id = postId;
    this.navCtrl.push(CommunityDetailPage, passData);
  }

  doWrite(){
    this.navCtrl.push(CommunityWritePage);
  }

}
