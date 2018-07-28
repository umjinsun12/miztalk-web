import { Values } from './../../services/shopping-services/values';
import { DomSanitizer } from '@angular/platform-browser';
import { WordpressService } from './../../services/wordpress.service';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { CmsService } from '../../services/cms-service.service';
import * as moment from 'moment';
import { Functions } from '../../services/shopping-services/functions';
/**
 * Generated class for the EventDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-event-detail',
  templateUrl: 'event-detail.html',
})
export class EventDetailPage {
  
  postId: number;
  postName: string;
  post: any;
  cmsId: any;
  likebtn: boolean;
  comment: any;


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public wordpressService: WordpressService,
    public loadingCtrl: LoadingController,
    public cmsService: CmsService,
    public values : Values,
    public sanitizer: DomSanitizer,
    public functions : Functions
  ) {
    this.postId = navParams.data.id;
      this.postName = navParams.data.name;
      this.post = {
        categoryName : "",
        content : {
          rendered : ""
        },
        date : "",
        title :{
          rendered : ""
        },
        author : "",
        replies : [],
        like: 0,
        comments : [],
        likelist : [],
        commentSize: 0
      }
      this.likebtn = true;
      this.loadPost();
  }

  ionViewDidLoad() {
    
  }
  loadPost(){
    console.log('ionViewDidLoad EventDetailPage');
    console.log(this.postId);
    console.log(this.post);
    let loading = this.loadingCtrl.create();
    loading.present();
    this.wordpressService.getPostbyId(this.postId).subscribe(data =>{
      this.post = data;
      this.post.categoryName = data._embedded['wp:term'][0][0].name.replace("커뮤니티-","");
      this.post.author = data._embedded['author'][0].name;
      this.post.content.rendered = data.content.rendered.replace("<p>","").replace("</p>","");
      this.post.date = moment(data.date).fromNow();
      
      this.cmsService.getNotices(this.postId, 9091).subscribe(result => {
        console.log(result);
        this.cmsId = result.contents[0]._id;
        this.post.like = result.contents[0].likelist.length;
        this.post.comments = [];
        this.post.commentSize = result.contents[0].comments.length;
        for(var i=0 ; i < result.contents[0].comments.length ; i++){
          result.contents[0].comments[i].date = moment(result.contents[0].comments[i].date).fromNow();
          if(result.contents[0].comments[i].name == this.values.customerName){
            result.contents[0].comments[i].isMine = true;
          }
          else
            result.contents[0].comments[i].isMine = false;
          console.log(result.contents[0].comments[i]);
          this.post.comments.push(result.contents[0].comments[i]); 
        }
      });


      loading.dismiss();
      });
  }

  doLike(){
    if(this.values.isLoggedIn){
      if(this.likebtn){
        this.likebtn = false;
        this.post.like += 1;
        this.cmsService.createLike(this.cmsId, this.values.token).then(data =>{
          console.log(data);
        });
      }
      else{
        this.likebtn = true;
        this.post.like -= 1;
        this.cmsService.createLike(this.cmsId, this.values.token).then(data =>{
          console.log(data);
        });
      }
    }else{
      this.functions.showAlert("에러", "마이페이지에서 로그인을 먼저 해주세요.");
    }
  }


  removeComment(replyid){
    this.cmsService.removeComment(this.cmsId, replyid).then(data => {
      this.loadPost();
    })
  }

  writeComment(){
    if(this.values.isLoggedIn == false){
      this.functions.showAlert("에러", "마이페이지에서 로그인을 먼저 해주세요. ");
    }
    else if(this.comment == undefined || this.comment == ''){
      this.functions.showAlert("에러", "댓글 내용을 입력해 주세요.");
    }
    else{
      this.cmsService.createReply(this.cmsId, this.comment, this.values.token).then(data =>{
        console.log(data);
        this.loadPost();
        this.comment = '';
      });
    }
  }


}
