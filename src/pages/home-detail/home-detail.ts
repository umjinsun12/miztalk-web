import { WordpressService } from './../../services/wordpress.service';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { CardnewsService } from './../../services/shopping-services/cardnews-service';

/**
 * Generated class for the HomeDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  templateUrl: 'home-detail.html',
})
export class HomeDetailPage {

  postId: number;
  postName: string;
  posts: Array<any> = new Array<any>();
  contents: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public wordpressService: WordpressService,
    public loadingCtrl: LoadingController,
    public service: CardnewsService) {
      console.log(navParams.data);
      this.postId = navParams.data.id;
      this.postName = navParams.data.name;
  }

  ionViewDidLoad() {
    this.service.presentLoading('카드뉴스 로딩중 입니다.');

    this.service.getDetailCards(this.postId).then(data => {
      this.contents = data;
      let imgs = [];
      this.contents.content.rendered = this.contents.content.rendered.replace('<p>',"");
      this.contents.content.rendered = this.contents.content.rendered.replace('</p>',"").trim();
      imgs = this.contents.content.rendered.split('<img');
      for(let post of imgs){
        if(post == "")
          continue;
        post = post.split("src=\"")[1].split("\"")[0];
        post = post.replace('-300x300',"");
        post = post.replace('-231x300',"");
        this.posts.push(post);
      }
      console.log(this.posts);
      this.service.dismissLoading();
    });
  }
}
