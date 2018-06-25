import { Values } from './../../services/shopping-services/values';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Service } from '../../services/shopping-services/service';
import { Functions } from './../../services/shopping-services/functions';

/**
 * Generated class for the CommunityWritePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-community-write',
  templateUrl: 'community-write.html',
})
export class CommunityWritePage {

  categories:any;
  selectCategory:any = 0;
  content : any;
  title: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public service: Service, 
    public values: Values,
    public functions : Functions,
    public loadingCtrl: LoadingController) {
    this.categories = [
      {
        name: "메인",
        id: 23,
        value : "main"
      },
      {
        name: "부부클리닉",
        id: 25,
        value : "clinic"
      },
      {
        name: "자랑하기",
        id: 24,
        value : "boast"
      },
      {
        name: "중고장터",
        id: 26,
        value : "usedmarket"
      }
    ]
  }

  ionViewDidLoad() {
    
  }

  doWrite(){
    console.log(this.categories[this.selectCategory]);
    console.log(this.content);
    console.log(this.title);
    if(this.title == undefined)
      this.functions.showAlert("에러", "제목을 적어 주세요");
    else if(this.content == undefined)
      this.functions.showAlert("에러", "내용을 입력해 주세요");
    else{
      let loading = this.loadingCtrl.create({
        content: "글을 업로드 중입니다"
      });
      loading.present();
      this.service.submitPost(this.title, this.content, this.categories[this.selectCategory].id).then((results) => {
        this.functions.showAlert("성공", "글쓰기 성공!");
        loading.dismiss();
        this.navCtrl.pop();
      });
    }
    
  }

}
