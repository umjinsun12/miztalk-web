import { Storage } from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage';
import { Values } from './../../services/shopping-services/values';
import { HomeDetailPage } from './../home-detail/home-detail';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController ,Nav} from 'ionic-angular';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { WordpressService } from '../../services/wordpress.service';


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

  products:any = []

  posts: Array<any> = new Array<any>();
  morePagesAvailable: boolean = true;
  loggedUser: boolean = false;
  homeCategoryId : number = 21;

  categoryId: number;
  categoryTitle: string;


  http: Http;


  @ViewChild(Nav) nav: Nav;


  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public wordpressService: WordpressService,
    public loadingCtrl: LoadingController,
    public values : Values,
    public nativeStorage : NativeStorage,
    public storage : Storage) {

    this.products = [
      {
        name: "계란요리 레시피",
        categories: [{name: "간단한 레시피"}],
        images: [{src: "../assets/imgs/reci1.png"}]
      },
      {
        name: "윤식당 닭강정 만들기",
        categories: [{name: "간단한 레시피"}],
        images: [{src: "../../assets/imgs/reci2.png"}]
      },
      {
        name: "스마트폰 중독과 예방",
        categories: [{name: "비너스 육아팁"}],
        price: 33,
        images: [{src: "../../assets/imgs/reci3.png"}]
      },
      {
        name: "은우엄마 뚝딱뚝딱",
        categories: [{name: "간단한 레시피"}],
        images: [{src: "../../assets/imgs/reci4.png"}]
      },
      {
        name: "계란요리 레시피",
        categories: [{name: "간단한 레시피"}],
        images: [{src: "../assets/imgs/reci1.png"}]
      },
      {
        name: "윤식당 닭강정 만들기",
        categories: [{name: "간단한 레시피"}],
        images: [{src: "../../assets/imgs/reci2.png"}]
      },
      {
        name: "스마트폰 중독과 예방",
        categories: [{name: "비너스 육아팁"}],
        price: 33,
        images: [{src: "../../assets/imgs/reci3.png"}]
      },
      {
        name: "은우엄마 뚝딱뚝딱",
        categories: [{name: "간단한 레시피"}],
        images: [{src: "../../assets/imgs/reci4.png"}]
      }
    ]
  }


  segmentChanged(){
    //console.log(this.topTab);
  }


  ionViewWillEnter() {
    this.morePagesAvailable = true;
    //if we are browsing a category
    this.categoryId = this.navParams.get('id');
    this.categoryTitle = this.navParams.get('title');



    if(!(this.posts.length > 0)){
      let loading = this.loadingCtrl.create();
      loading.present();
      let categoryArray = {};

      let homePosts  = this.wordpressService.getPostEmbedbyCategory(this.homeCategoryId);
      let allCategorys = this.wordpressService.getAllCategory();

      Observable.forkJoin([homePosts, allCategorys]).subscribe(datas => {
        let posts = datas[0];
        let categorydatas = datas[1];
        let categoryArray = {};

        categorydatas.forEach(function(item){
          categoryArray[item.id] = item.name;
        })


        for(let post of posts){
          post.excerpt.rendered = post.excerpt.rendered.split('<a')[0] + "</p>";
          if(post._embedded['wp:featuredmedia'] != undefined)
            post.thumnail = post._embedded['wp:featuredmedia'][0].source_url;
          
          for(let categoryID of post.categories){
            if(categoryID == 20)
              continue;
            else{
              post.categoryName = categoryArray[categoryID];
              break;
            }
          }
          this.posts.push(post);
        }

        loading.dismiss()
      });
    }
  }

  getPostConent(postId:number, postName:string){
    let passData = {name:'', id:0};
    passData.name = postName;
    passData.id = postId;
    this.navCtrl.push(HomeDetailPage, passData);
  }


  getRecentPosts(categoryId:number, page:number = 1) {
    //if we want to query posts by category
    let category_url = categoryId? ("&categories=" + categoryId): "";
    
  }

  
  openPage(page: HomePageInterface) {
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
