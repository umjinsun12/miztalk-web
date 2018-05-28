import { AccountLogin } from './../account/login/login';
import { Values } from './../../services/shopping-services/values';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Functions } from './../../services/shopping-services/functions'
import { TabsPage } from '../tabs/tabs';
import { HomePage } from '../home/home';
import { Service } from '../../services/shopping-services/service';

/**
 * Generated class for the MypagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mypage',
  templateUrl: 'mypage.html',
})
export class MypagePage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public values : Values,
    public functions : Functions,
    public service: Service) {
  }

  ionViewDidLoad() {
    
  }

  isActive(){
    
  }

  ionViewWillEnter(){
    console.log(this.values.isLoggedIn);
    if(!this.values.isLoggedIn){
      this.functions.showAlert("에러", "로그인이 필요한 서비스입니다.");
      this.navCtrl.push(AccountLogin);
    }
  }

  logout(){
    console.log("asdfasdf");
    this.service.logout();
  }

}
