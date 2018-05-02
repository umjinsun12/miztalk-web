import { Values } from './../../services/shopping-services/values';
import { WordpressService } from './../../services/wordpress.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
import { AuthenticationService } from '../../services/authentication.service';
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
