import { Values } from '../../services/shopping-services/values';
import { WordpressService } from './../../services/wordpress.service';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { CardnewsService } from '../../services/shopping-services/cardnews-service';
import { CmsService } from '../../services/cms-service.service';
import * as moment from 'moment';
import { Functions } from '../../services/shopping-services/functions';


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
  post: any;
  contents: any;
  cmsId: any;
  likebtn: boolean;
  comment: any;
  cardBegin: boolean = true;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public wordpressService: WordpressService,
    public loadingCtrl: LoadingController,
    public service: CardnewsService,
    public cmsService: CmsService,
    public values : Values,
    public functions : Functions) {
      moment.locale('ko');
      console.log(navParams.data);
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
      this.loadPost();
      this.service.dismissLoading();
    });
  }

  loadPost(){
    this.cmsService.getNotices(this.postId, 9091).subscribe(results => {
      this.cmsId = results.contents[0]._id;
      this.post.like = results.contents[0].likelist.length;
      this.post.comments = [];
      this.post.commentSize = results.contents[0].comments.length;
      for(var i=0 ; i < results.contents[0].comments.length ; i++){
        results.contents[0].comments[i].date = moment(results.contents[0].comments[i].date).fromNow();
        if(results.contents[0].comments[i].name == this.values.customerName){
          results.contents[0].comments[i].isMine = true;
        }
        else
          results.contents[0].comments[i].isMine = false;
        console.log(results.contents[0].comments[i]);
        this.post.comments.push(results.contents[0].comments[i]);
      }
      var likeChk = results.contents[0].likelist.indexOf(this.values.customerName);
      if(likeChk == -1){this.likebtn = true;}
      else{this.likebtn = false;}
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
        this.loadPost();
        this.comment = '';
      });
    }
  }

  slideChanged(ev){
    this.cardBegin = false;
  }



}
