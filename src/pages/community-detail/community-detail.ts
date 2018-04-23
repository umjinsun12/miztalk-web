import { WordpressService } from './../../services/wordpress.service';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

/**
 * Generated class for the CommunityDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  templateUrl: 'community-detail.html',
})
export class CommunityDetailPage {

  postId: number;
  postName: string;
  post: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public wordpressService: WordpressService,
    public loadingCtrl: LoadingController
  ) {
      console.log(navParams.data);
      this.postId = navParams.data.id;
      this.postName = navParams.data.name;
  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create();
    loading.present();
    this.wordpressService.getPostbyId(this.postId).subscribe(data =>{
      this.post = data;
      console.log(this.post);
      loading.dismiss();
    });
  }

}
