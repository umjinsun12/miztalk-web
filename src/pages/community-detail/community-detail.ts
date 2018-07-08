import { WordpressService } from './../../services/wordpress.service';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import * as moment from 'moment';
import { CmsService } from '../../services/cms-service.service';
import { Functions } from '../../services/shopping-services/functions';
import { Values } from '../../services/shopping-services/values';
import { Config } from '../../services/shopping-services/config';

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
  categoryTitle : string;
  post: any;
  comment: any;
  likebtn : boolean;
  isMine : boolean;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public wordpressService: WordpressService,
    public service : CmsService,
    public loadingCtrl: LoadingController,
    public functions : Functions,
    public values : Values,
    public config : Config
  ) {
      console.log(navParams.data);
      this.postId = navParams.data.id;
      this.categoryTitle = navParams.data.categoryTitle;
      this.post = {
        date : '',
        writer : '',
        title : '',
        contents : '',
        like : 0,
        comments : [] 
      }
      this.likebtn = true;
      this.isMine = false;
  }

  ionViewDidLoad() {
    this.loadPost();
  }

  loadPost(){
    let loading = this.loadingCtrl.create();
    loading.present();
    this.service.getPost(this.postId).subscribe(data => {
      console.log(data);
      this.post = data.content;
      this.post.date = moment(data.content.date).fromNow();
      this.post.like = data.content.likelist.length;
      if(this.post.writer == this.values.customerName)
        this.isMine = true;
      else
        this.isMine = false;
      for(var i=0 ; i < this.post.comments.length ; i++){
        this.post.comments[i].date = moment(this.post.comments[i].date).fromNow();
        if(this.post.comments[i].name == this.values.customerName){
          this.post.comments[i].isMine = true;
        }
        else
          this.post.comments[i].isMine = false;
      }
      for(var i=0 ; i < this.post.image.length ; i++){
        this.post.image[i] = this.config.cmsurl + '/posts/image/' +this.post.image[i].split(':')[0];
      }
      var likeChk = this.post.likelist.indexOf(this.values.customerName);
      console.log(likeChk);
      if(likeChk == -1){this.likebtn = true;}
      else{this.likebtn = false;}
      loading.dismiss();
    });
  }

  doLike(){
    if(this.values.isLoggedIn){
      if(this.likebtn){
        this.likebtn = false;
        this.post.like += 1;
        this.service.createLike(this.postId, this.values.token).then(data =>{
          console.log(data);
        });
      }
      else{
        this.likebtn = true;
        this.post.like -= 1;
        this.service.createLike(this.postId, this.values.token).then(data =>{
          console.log(data);
        });
      }
    }else{
      this.functions.showAlert("에러", "로그인이 필요합니다.");
    }
  }

  removePost(){
    this.service.removePost(this.postId).then(data => {
      this.navCtrl.pop();
      console.log(data);
    });
  }

  removeComment(replyid){
    this.service.removeComment(this.postId, replyid).then(data => {
      this.loadPost();
    })
  }

  writeComment(){
    if(this.comment == undefined || this.comment == ''){
      this.functions.showAlert("에러", "댓글 내용을 입력해 주세요.");
    }
    else{
      this.service.createReply(this.postId, this.comment, this.values.token).then(data =>{
        console.log(data);
        this.loadPost();
        this.comment = '';
      });
    }
  }

}
