import { WordpressService } from './../../services/wordpress.service';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import {ImgCacheService} from '../../services/img-util';
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

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public wordpressService: WordpressService,
    public loadingCtrl: LoadingController,
    imgCacheService: ImgCacheService) {
      console.log(navParams.data);
      this.postId = navParams.data.id;
      this.postName = navParams.data.name;
  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create();
    loading.present();

    this.wordpressService.getPostMediabyIdheader(this.postId).subscribe(data =>{
      let pagesize:number = parseInt(data.headers.get('X-WP-TotalPages'));
      let posts = data.json();

      for(let post of posts){
        this.posts.push(post);
      }

      if(pagesize > 1){
        let pagereqeusts = [];
        for(let i=2 ; i <= pagesize ; i++){
          pagereqeusts.push(this.wordpressService.getPostMediabyId(this.postId, i));
        }

        Observable.forkJoin(pagereqeusts).subscribe(datas => {

          for(let i=0; i < pagesize-1 ;i++){
            let posts = datas[0];
            var postsArray = Object.keys(posts).map(function(postindex){
              let postarr = posts[postindex];
              return postarr;
            });
            for(let post of postsArray){
              this.posts.push(post);
            }
          }
          this.sortPost();
          console.log(this.posts);
          loading.dismiss();
        });
      }else{
        this.sortPost();
        console.log(this.posts);
        loading.dismiss();
      }
    })
  }

  sortPost(){
    this.posts.sort((a,b) => {
      return a.title.rendered.localeCompare(b.title.rendered);
    })
  }

}
