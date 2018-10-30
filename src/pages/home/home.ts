import { OrderSummary } from './../checkout/order-summary/order-summary';
import { AccountRegister } from './../account/register/register';
import { ClayfulService } from './../../services/shopping-services/clayful-service';
import { Functions } from '../../services/shopping-services/functions';
import { Storage } from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage';
import { Values } from '../../services/shopping-services/values';
import { HomeDetailPage } from './../home-detail/home-detail';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Nav, Platform, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { WordpressService } from '../../services/wordpress.service';
import { CardnewsService } from '../../services/shopping-services/cardnews-service';
import {EventDetailPage} from '../event-detail/event-detail';
import { ShoppingProductPage } from '../shopping-product/shopping-product';
import { PointDetailPage } from '../point-detail/point-detail';
import { CmsService } from '../../services/cms-service.service';
import { Config } from '../../services/shopping-services/config';

import {ShoppingProductsPage} from '../../pages/shopping-products/shopping-products';
import {ShoppingSearchPage} from '../../pages/shopping-search/shopping-search';
import {Service} from "../../services/shopping-services/service";

import {Market} from "@ionic-native/market";


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
  page:number = 1;
  
  morePagesAvailable: boolean = true;
  loggedUser: boolean = false;
  homeCategoryId : number = 20;

  categoryId: number;
  categoryTitle: string;

  has_more_items: boolean = true;


  http: Http;

  public alertShown:boolean = false;

  versionChk: boolean = true;

  private urlParameters: Array<any> = [];

  orderId:any;

  contentCategory:any = [];

  selectCategory:number = 643;


  @ViewChild(Nav) nav: Nav;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public wordpressService: WordpressService,
    public loadingCtrl: LoadingController,
    public values : Values,
    public storage : Storage,
    public functions: Functions,
    public service : CardnewsService,
    public cmsService : CmsService,
    public config : Config,
    public platform: Platform,
    public appService : Service,
    public market : Market,
    public alertCtrl: AlertController,
    public clayfulService : ClayfulService) {
      this.orderId = null;
      this.contentCategory = [
        {name:"메인컨텐츠", id:643},
        {name:"AvsB", id:641},
        {name:"다이어트", id:23},
        {name:"레시피", id:21},
        {name:"생활", id:165},
        {name:"부부공감", id:172},
        {name:"여행", id:638},
        {name:"육아생활", id:20},
        {name:"인기상품", id:640},
        {name:"제품리뷰", id:639}
      ]
      this.service.presentLoading("로딩중입니다.");
      this.page = 1;
      this.service.getPostEmbedbyCategory(this.selectCategory, this.page).then(results => this.handleResults(results));
  }

  selectCategoryEvent(categoryId){
    this.page = 1;
    this.has_more_items = true;
    if(this.selectCategory == categoryId)
      this.selectCategory = 643
    else
      this.selectCategory = categoryId;
    this.service.getPostEmbedbyCategory(this.selectCategory, this.page).then(results => this.handleResults(results));
  }


  handleResults(results){
    this.posts = results;
    for(let post of this.posts){
      post.excerpt.rendered = post.excerpt.rendered.split('<a')[0] + "</p>";
      if(post._embedded['wp:featuredmedia'] != undefined){
          post.thumbnail = post['_embedded']['wp:featuredmedia'][0].media_details.sizes.medium.source_url;
      }
    }
    this.service.dismissLoading();
    console.log(results);
  }


  ionViewDidEnter(){
    this.platform.registerBackButtonAction(() => {
      if (this.alertShown==false) {
        this.presentConfirm();
      }
    }, 0);
    if (document.URL.indexOf("?") > 0) {
      let getURL = document.URL.split("#");
      let splitURL = getURL[0].split("?");
      let splitParams = splitURL[1].split("&");
      let i: any;
      for (i in splitParams){
        let singleURLParam = splitParams[i].split('=');
        if (singleURLParam[0] == "token"){
          this.values.clayful_token = singleURLParam[1];
        }
        if (singleURLParam[0] == "customer"){
          this.values.clayful_id = singleURLParam[1];
        }
        if (singleURLParam[0] == "order"){
          this.orderId = singleURLParam[1];
        }
        
        let urlParameter = {
        'name': singleURLParam[0],
        'value': singleURLParam[1]
      };
      this.urlParameters.push(urlParameter);
      }
      if(this.orderId == null){
        this.storage.set('token', this.values.clayful_token);
        this.storage.set('customer', this.values.clayful_id);
        this.clayfulService.memberLogin(this.values.clayful_id, this.values.clayful_token).subscribe(result => {
          if(result.status == "error"){
            this.functions.showAlert("에러", "로그인에 실패하였습니다. 다시 로그인 해주세요.");
          }else{
            if(result.msg.phone != null){
              this.values.isLoggedIn = true;
              this.functions.showAlert("성공", "로그인 되었습니다.");
              this.clayfulService.memberChk(this.values.clayful_id, this.values.clayful_token).then(result => {
                this.values.clayful_data = result;
                  this.values.customerName = this.values.clayful_data.name;
                  if(this.values.clayful_data.point == null)
                    this.values.point = 0;
                  else
                    this.values.point = this.values.clayful_data.point;
              }).catch(err => {
                this.values.point = 0;
              });
            }else{
              this.navCtrl.push(AccountRegister);
            }
          }
        })
      }else{
        this.getCustomerToken();
      }
    }else{
        this.getCustomerToken();
    }
    window.history.pushState('','','/');
  }

  getCustomerToken(){
    this.storage.get('customer').then(cs_value => {
      if(cs_value != null){
          this.values.clayful_id = cs_value;
          this.storage.get('token').then(token_value => {
              this.values.clayful_token = token_value;
              this.clayfulService.memberChk(this.values.clayful_id, this.values.clayful_token).then(result => {
                  this.values.isLoggedIn = true;
                  this.values.clayful_data = result;
                  this.values.customerName = this.values.clayful_data.name;
                  if(this.values.clayful_data.point == null)
                    this.values.point = 0;
                  else
                    this.values.point = this.values.clayful_data.point;
                  if(this.orderId != null){
                    if(this.orderId == "err"){
                      this.functions.showAlert("에러", "주문에 실패하였습니다. 다시 주문해주세요.");
                    }else{
                      this.navCtrl.push(OrderSummary, this.orderId);
                      this.orderId = null;
                    }
                  }
              }).catch(error => {
                  console.log(error);
                  this.values.isLoggedIn = false;
              });
          });
      }
    });
  }

  ionViewWillLeave() {
    this.platform.registerBackButtonAction(() => {
        this.navCtrl.pop();
    });
}

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: '종료',
      message: '미즈톡을 종료하시겠습니까?',
      buttons: [
        {
          text: '취소',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            this.alertShown=false;
          }
        },
        {
          text: '확인',
          handler: () => {
            console.log('Yes clicked');
            this.platform.exitApp();
          }
        }
      ]
    });
     alert.present().then(()=>{
      this.alertShown=true;
    });
  }


  presentVersion() {
    let alert = this.alertCtrl.create({
      title: '업데이트',
      message: '미즈톡 새로운 버전이 나왔어요. 업데이트를 해주세요.',
      buttons: [
        {
          text: '취소',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            this.versionChk = false;
          }
        },
        {
          text: '설치',
          handler: () => {
            this.market.open('com.mistalk.mistalk');
          }
        }
      ]
    });
    alert.present().then(()=>{
      this.alertShown=true;
    });
  }



  getPostConent(postId:number, postName:string){
    let passData = {name:'', id:0};
    passData.name = postName;
    passData.id = postId;
    this.navCtrl.push(HomeDetailPage, passData);
  }

  getBannerConent(postType:number,postId:number){
    let passData = {name:'', id:0};
    passData.id = postId;

    if(postType == 0)
      this.navCtrl.push(ShoppingProductPage, postId);
    else if(postType == 1){
      passData.name = "이벤트";
      this.navCtrl.push(EventDetailPage, passData);
    }
    else if(postType == 4){
      passData.name = "기획전";
      this.navCtrl.push(ShoppingProductsPage, passData);
    }
  }
  
  handlePostResults(results) {
    this.posts = results;
    console.log(this.posts);
    for(let post of this.posts){
      post.excerpt.rendered = post.excerpt.rendered.split('<a')[0] + "</p>";
      if(post._embedded['wp:featuredmedia'] != undefined){
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

  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}



  ionViewWillEnter() {
  }

  getSearch() {
    this.navCtrl.push(ShoppingSearchPage);
  }

  showPointDetail(){
    if(this.values.isLoggedIn)
      this.navCtrl.push(PointDetailPage);
  }

  goCategory(id){
    let item = {
        id : "",
        name : "",
        categories : []
    };
    item.id = id;
    this.navCtrl.push(EventDetailPage,item);
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
    this.page = 1;
    this.service.getPostEmbedbyCategory(this.selectCategory, this.page).then(results => this.handleRefresh(results, refresher));
  };

  handleRefresh(results, refresher){
    this.posts = results;
    for(let post of this.posts){
      post.excerpt.rendered = post.excerpt.rendered.split('<a')[0] + "</p>";
      if(post._embedded['wp:featuredmedia'] != undefined){
          post.thumbnail = post['_embedded']['wp:featuredmedia'][0].media_details.sizes.medium.source_url;
      }
    }
    refresher.complete();
  }
  

  doInfinite(infiniteScroll) {
    this.page += 1;
    this.service.getPostEmbedbyCategory(this.selectCategory, this.page).then(results => this.handleMore(results, infiniteScroll)).catch(err => {
      this.has_more_items = false;
      infiniteScroll.complete();
    });
  }

  handleMore(results, infiniteScroll) {
      if (!results) {
          this.has_more_items = false;
      }
      else{
        console.log("dasfsdf");
        for(let post of results){
          post.excerpt.rendered = post.excerpt.rendered.split('<a')[0] + "</p>";
          if(post._embedded['wp:featuredmedia'] != undefined){
              post.thumbnail = post['_embedded']['wp:featuredmedia'][0].media_details.sizes.medium.source_url;
          }
          this.posts.push(post);
        }
        console.log(this.posts);
      }
      infiniteScroll.complete();
  }

  

}
