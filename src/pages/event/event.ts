import { Values } from './../../services/shopping-services/values';
import { WordpressService } from './../../services/wordpress.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
import { EventDetailPage } from '../event-detail/event-detail';

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
  morePagesAvailable: boolean = true;
  loggedUser: boolean = false;

  categoryId: number = 27;
  categoryTitle: string = "이벤트";

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public wordpressService: WordpressService,
    public loadingCtrl: LoadingController,
    public values : Values) { 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventPage');
  }

  ionViewWillEnter() {
    this.morePagesAvailable = true;

    if(!(this.posts.length > 0)){
      let loading = this.loadingCtrl.create();
      loading.present();

      this.wordpressService.getPostEmbedbyCategory(this.categoryId)
      .subscribe(data =>{
        for(let post of data){
          post.excerpt.rendered = post.excerpt.rendered.split('<a')[0] + "</p>";
          post.title.datas = post.title.rendered.split('|');
          post.thumbnail = post['_embedded']['wp:featuredmedia'][0].media_details.sizes.medium.source_url;
          post.event = {
            company : "",
            title : "",
            content : "",
            startdate : "",
            enddate : ""
          }
          if(post.title.datas.length == 5){
            post.event.company = post.title.datas[0];
            post.event.title = post.title.datas[1];
            post.event.content = post.title.datas[2];
            post.event.startdate = post.title.datas[3];
            post.event.enddate = post.title.datas[4];
          }
          console.log(post.title);
          this.posts.push(post);
          console.log(post);
        }
        loading.dismiss();
      });
      
    }
  }


  getPostConent(postId:number, postName:string){
    let passData = {name:'', id:0};
    passData.name = postName;
    passData.id = postId;
    this.navCtrl.push(EventDetailPage, passData);
  }


}
