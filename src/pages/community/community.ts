import { CommunityNoticePage } from './../community-notice/community-notice';
import { CommunityWritePage } from './../community-write/community-write';
import { Values } from './../../services/shopping-services/values';
import { WordpressService } from './../../services/wordpress.service';
import { Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, LoadingController, Slides} from 'ionic-angular';
import { Http } from '@angular/http';
import * as moment from 'moment';
import { CommunityDetailPage } from '../community-detail/community-detail';
import { PointDetailPage } from '../point-detail/point-detail';
import { CmsService } from '../../services/cms-service.service';
import { Functions } from '../../services/shopping-services/functions';

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
  noticeposts: Array<any> = new Array<any>();
  morePagesAvailable: boolean = true;
  loggedUser: boolean = false;

  categoryId: number;
  noticeId: number;
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
    public values: Values,
    public cmsService: CmsService,
    public funtions : Functions) { 
    this.myIndex = navParams.data.tabIndex || 0;
    this.selectedSegment = 'main';
    moment.locale('ko');
    this.noticeId = 23;
    this.slides = [
      {
        id: "main",
        title: "메인",
        categoryid: 0,
        noticeid: 23
      },
      {
        id: "clinic",
        title: "부부클리닉",
        categoryid: 1,
        noticeid: 25
      },
      {
        id: "usedmarket",
        title: "중고장터",
        categoryid: 2,
        noticeid:26
      },
      {
        id: "boast",
        title: "자랑거리",
        categoryid: 3,
        noticeid:24
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


      this.cmsService.getPosts(1, categoryid).subscribe((data) => {
        console.log(data);
        this.posts = [];
        for(let post of data.contents){
          console.log(post);
          post.date = moment(post.date).fromNow();
          post.like = post.likelist.length;
          post.commentsCnt = post.comments.length;
          this.posts.push(post);
        }
        loading.dismiss();
      });
  }

  getNoticeCategory(categoryid){
    this.noticeposts = [];
    this.wordpressService.getPostEmbedbyCategory(categoryid).subscribe((data) => {
      for(let post of data){
        post.excerpt.rendered = post.excerpt.rendered.split('<a')[0].replace("<p>","").replace("</p>","");
          post.author = post._embedded['author'][0].name;
          post.reltime = moment(post.date).fromNow();
          post.replies = 0;
          if(post._embedded.replies != undefined)
            post.replies = post._embedded.replies[0].length;
          else
            post.replies = 0;
          this.noticeposts.push(post);
          if(this.noticeposts.length >= 3)
            break;
      }
    });
  }


  onSegmentChanged(segmentButton) {
    console.log("Segment changed to", segmentButton.value);
    const selectedIndex = this.slides.findIndex((slide) => {
      if(slide.id === segmentButton.value){
        this.categoryId = slide.categoryid;
        this.noticeId = slide.noticeid;
        this.getPostCategory(slide.categoryid);
        this.getNoticeCategory(slide.noticeid);
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



  showPointDetail(){
    if(this.values.isLoggedIn)
      this.navCtrl.push(PointDetailPage);
  }



  ionViewWillEnter() {
    this.morePagesAvailable = true;
    //if we are browsing a category
    this.categoryId = this.slides[this.activeIndex].categoryid;
    console.log(this.categoryId);
    this.categoryTitle = this.navParams.get('title');
    this.getPostCategory(this.categoryId);
    this.getNoticeCategory(this.noticeId);
  }

  


  getRecentPosts(categoryId:number, page:number = 1) {
    //if we want to query posts by category
    //let category_url = categoryId? ("&categories=" + categoryId): "";
  
    
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
      this.posts = [];
      this.cmsService.getPosts(1, this.categoryId).subscribe((data) => {
        for(let post of data.contents){
          post.date = moment(post.date).fromNow();
          post.like = post.likelist.length;
          post.commentsCnt = post.comments.length;
          this.posts.push(post);
        }
        refresher.complete();
    });
  };
  

  doInfinite(infiniteScroll) {
    let page = (Math.ceil(this.posts.length/10)) + 1;
    let loading = true;

    this.cmsService.getPosts(page, this.categoryId).subscribe((data) => {
        for(let post of data.contents){
          post.date = moment(post.date).fromNow();
          post.like = post.likelist.length;
          post.commentsCnt = post.comments.length;
          this.posts.push(post);
        }
        infiniteScroll.complete();
    });

  }

  getPostConent(postId:number, category: any){
    var categoryTitle= this.slides[category];
    console.log(categoryTitle);
    console.log(postId);
    var param = {
      id : postId,
      categoryTitle : categoryTitle.title
    }
    this.navCtrl.push(CommunityDetailPage, param);
  }

  getNoticeConent(postId:number, postName:string){
    let passData = {name:'', id:0};
    passData.name = postName;
    passData.id = postId;
    this.navCtrl.push(CommunityNoticePage, passData);
  }

  doWrite(){
    if(this.values.isLoggedIn){
      this.navCtrl.push(CommunityWritePage, this.categoryId);
    }else{
      this.funtions.showAlert('에러', '로그인을 먼저 해주세요.');
    }
  }

}
