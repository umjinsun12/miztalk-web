import { Values } from '../../services/shopping-services/values';
import { WordpressService } from './../../services/wordpress.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform, AlertController } from 'ionic-angular';
import { EventDetailPage } from '../event-detail/event-detail';
import {EventAnouncePage} from '../event-anounce/event-anounce'
import * as moment from 'moment';
import { PointDetailPage } from '../point-detail/point-detail';

/**
 * Generated class for the EventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
})
export class EventPage {

  posts: Array<any> = new Array<any>();
  anounce_posts: Array<any> = new Array<any>();
  morePagesAvailable: boolean = true;
  loggedUser: boolean = false;

  categoryId: number = 27;
  categoryTitle: string = "이벤트";

  showOverview: boolean = true;
  showAnounce : boolean = false;
  segment = 'overview';
  public alertShown:boolean = false;


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public wordpressService: WordpressService,
    public loadingCtrl: LoadingController,
    public values : Values,
    public platform : Platform,
    public alertCtrl : AlertController) { 
    this.morePagesAvailable = true;
    moment.locale('ko');

    if(!(this.posts.length > 0)){
      let loading = this.loadingCtrl.create();
      loading.present();

      this.wordpressService.getPostEmbedbyCategory(this.categoryId)
      .subscribe(data =>{
        for(let post of data){
          post.excerpt.rendered = post.excerpt.rendered.split('<a')[0] + "</p>";
          console.log(post);
          post.thumbnail = post['_embedded']['wp:featuredmedia'][0].source_url;
          this.posts.push(post);
        }
        console.log(this.posts);
        loading.dismiss();
      });
      
    }

    this.getPostCategory(173);
  }


  ionViewDidEnter(){
    this.platform.registerBackButtonAction(() => {
      if (this.alertShown==false) {
        this.presentConfirm();
      }
    }, 0)
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


  updateSchedule(event) {
    console.log(event._value);
    if (event._value == 'overview') {
        this.showOverview = true;
        this.showAnounce = false;
    } else if (event._value == 'anounce') {
        this.showOverview = false;
        this.showAnounce = true;
    }
  }

  getPostCategory(categoryid){
    let loading = this.loadingCtrl.create();
    loading.present();

    this.anounce_posts = [];
    this.wordpressService.getPostEmbedbyCategory(categoryid).subscribe(data=>{
      console.log(data);
      this.anounce_posts = [];
      for(let post of data){
        post.excerpt.rendered = post.excerpt.rendered.split('<a')[0].replace("<p>","").replace("</p>","");
        post.author = post._embedded['author'][0].name;
        post.reltime = moment(post.date).fromNow();
        post.replies = 0;
        if(post._embedded.replies != undefined)
          post.replies = post._embedded.replies[0].length;
        else
          post.replies = 0;
        this.anounce_posts.push(post);
      }
      loading.dismiss();
    });
}


showPointDetail(){
  if(this.values.isLoggedIn)
    this.navCtrl.push(PointDetailPage);
}


  ionViewDidLoad() {
    console.log('ionViewDidLoad EventPage');
  }

  ionViewWillEnter() {
    
  }


  getPostConent(postId:number, postName:string){
    let passData = {name:'', id:0};
    passData.name = postName;
    passData.id = postId;
    this.navCtrl.push(EventDetailPage, passData);
  }

  getAnounceConent(postId:number, postName:string){
    let passData = {name:'', id:0};
    passData.name = postName;
    passData.id = postId;
    this.navCtrl.push(EventAnouncePage, passData);
  }


}
