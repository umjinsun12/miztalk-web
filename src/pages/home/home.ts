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
  posts: Array<any> = new Array<any>();
  
  morePagesAvailable: boolean = true;
  loggedUser: boolean = false;
  homeCategoryId : number = 20;

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
    public storage : Storage,
    public functions: Functions) {

    this.products = [
      {
        name: "계란요리 레시피",
        categories: [{name: "간단한 레시피"}],
        images: [{src: "../assets/img/reci1.png"}]
      },
      {
        name: "윤식당 닭강정 만들기",
        categories: [{name: "간단한 레시피"}],
        images: [{src: "../../assets/img/reci2.png"}]
      },
      {
        name: "스마트폰 중독과 예방",
        categories: [{name: "비너스 육아팁"}],
        price: 33,
        images: [{src: "../../assets/img/reci3.png"}]
      },
      {
        name: "은우엄마 뚝딱뚝딱",
        categories: [{name: "간단한 레시피"}],
        images: [{src: "../../assets/img/reci4.png"}]
      },
      {
        name: "계란요리 레시피",
        categories: [{name: "간단한 레시피"}],
        images: [{src: "../assets/img/reci1.png"}]
      },
      {
        name: "윤식당 닭강정 만들기",
        categories: [{name: "간단한 레시피"}],
        images: [{src: "../../assets/img/reci2.png"}]
      },
      {
        name: "스마트폰 중독과 예방",
        categories: [{name: "비너스 육아팁"}],
        price: 33,
        images: [{src: "../../assets/img/reci3.png"}]
      },
      {
        name: "은우엄마 뚝딱뚝딱",
        categories: [{name: "간단한 레시피"}],
        images: [{src: "../../assets/img/reci4.png"}]
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
      this.getRecentPosts('start');
    }


  }

  getPostConent(postId:number, postName:string){
    let passData = {name:'', id:0};
    passData.name = postName;
    passData.id = postId;
    this.navCtrl.push(HomeDetailPage, passData);
  }

  

  getRecentPosts(mode, event:any = undefined) {
      let loading = this.loadingCtrl.create();
      
      if(mode == 'start')
        loading.present();
      //let categoryArray = {};


      this.wordpressService.getAllCategory().subscribe(categoryData =>{
        let categorydatas = categoryData;
        let categoryArray = {};
        let cardnews_order = [];
        function shuffle(a) {
          for (let i = a.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [a[i], a[j]] = [a[j], a[i]];
          }
          return a;
        }

        categorydatas.forEach(function(item){
          categoryArray[item.id] = item.name;
          if(item.id == 20){
            let pagenum = Math.ceil(item.count/10);
            for(let i=0; i < pagenum-1; i++){
              cardnews_order.push(i+1);
            }
            shuffle(cardnews_order);
            cardnews_order.push(pagenum);
            console.log(cardnews_order);
          }
        })
        this.cardnews_order = cardnews_order;

        this.wordpressService.getPostEmbedbyCategory(this.homeCategoryId, cardnews_order[0]).subscribe(posts =>{
          let tmppost: Array<any> = new Array<any>();
          for(let post of posts){
            post.thumbnail = {
              source_url : "dd"
            };
            post.excerpt.rendered = post.excerpt.rendered.split('<a')[0] + "</p>";
            if(post._embedded['wp:featuredmedia'] != undefined){
              post.thumnail = post._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url;
            }
              
            
            for(let categoryID of post.categories){
              if(categoryID == 20)
                continue;
              else{
                post.categoryName = categoryArray[categoryID];
                break;
              }
            }
            tmppost.push(post);
            //this.posts.push(post);
          }
          
          shuffle(tmppost);
          if(mode == 'refresh')
            this.posts = [];
          this.posts = this.posts.concat(tmppost);

          console.log(this.posts);
          if(mode == 'start')
            loading.dismiss();
          else if(mode == 'refresh')
            event.complete();
        });

      });
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
    this.morePagesAvailable = true;
    this.cardpos = 1;
    this.getRecentPosts('refresh', refresher);
  };
  

  doInfinite(infiniteScroll) {
    console.log(infiniteScroll);
    this.loadMore(infiniteScroll);
  }

  loadMore(infiniteScroll){
    let page = this.cardnews_order.length;
    console.log(page);
    console.log(this.cardpos);
    console.log(this.cardnews_order[this.cardpos]);
    if(page <= this.cardpos){
      this.morePagesAvailable = false;
      infiniteScroll.complete();
      return;
    }
      
    

    let homePosts  = this.wordpressService.getPostEmbedbyCategory(this.homeCategoryId, this.cardnews_order[this.cardpos]);
    let allCategorys = this.wordpressService.getAllCategory();
    this.cardpos++;
    

    Observable.forkJoin([homePosts, allCategorys]).subscribe(datas => {

      function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
      }


      let posts = datas[0];
      let categorydatas = datas[1];
      let categoryArray = {};
      let tmppost = [];

      categorydatas.forEach(function(item){
        categoryArray[item.id] = item.name;
      })

      for(let post of posts){
        post.thumbnail = {
          source_url : "dd"
        };
        post.excerpt.rendered = post.excerpt.rendered.split('<a')[0] + "</p>";
        if(post._embedded['wp:featuredmedia'] != undefined){
          post.thumnail = post._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url;
        }
          
        for(let categoryID of post.categories){
          if(categoryID == 20)
            continue;
          else{
            post.categoryName = categoryArray[categoryID];
            break;
          }
        }
        
        tmppost.push(post);
      }
      shuffle(tmppost);
      this.posts = this.posts.concat(tmppost);
      infiniteScroll.complete();
    }, err => {
      this.morePagesAvailable = false;
    })

  
  }



}
