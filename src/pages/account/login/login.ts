import { Config } from './../../../services/shopping-services/config';
import { Service } from './../../../services/shopping-services/service';
import { Functions } from './../../../services/shopping-services/functions';
import { Values } from './../../../services/shopping-services/values';
import { Component } from '@angular/core';
import { NavController, ToastController} from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import {AccountRegister} from '../register/register';
import {TabsPage} from '../../tabs/tabs';
import {AccountForgotten} from '../forgotten/forgotten';
import { Naver } from "ionic-plugin-naver";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var KakaoTalk: any;

@Component({
  templateUrl: 'login.html',
})
export class AccountLogin {

    loginData: any;
    loadLogin: any;
    status: any;
    error: any;
    public disableSubmit: boolean = false;
    LogIn: any;
    errors: any;
    loginStatus: any;
    showPasswordEnable: boolean = false;
    facebookSpinner: boolean = false;
    googleSpinner: boolean = false;
    gres: any;

    constructor(public nav: NavController, public service: Service, public functions: Functions, public config: Config, public values: Values, public fb: Facebook, public toast :ToastController, public naver: Naver) {
        this.loginData = [];
        this.LogIn = "LogIn";
    }
    login() {
        if (this.validateForm()) {
            this.disableSubmit = true;
            this.LogIn = "Logging In";
            this.service.login(this.loginData)
                .then((results) => this.handleResults(results));
        }
    }
    validateForm() {
        if (this.loginData.username == undefined || this.loginData.username == "") {
            return false
        }
        if (this.loginData.password == undefined || this.loginData.password == "") {
            return false
        }
        else {
            return true
        }
    }
    handleResults(results) {
        this.disableSubmit = false;
        this.LogIn = "LogIn";
        if (!results.errors && results.data) {
            this.functions.showAlert('로그인', '로그인하셨습니다.');
            if(this.values.cartLoadEnable){
                //this.nav.setRoot(CartPage);
            }
            else{
            this.nav.setRoot(TabsPage);
            }
        }
        else if (results.errors) {
            this.functions.showAlert('에러', '계정이나 비밀번호가 맞지 않습니다.');
        }
    }
    forgotten() {
        this.nav.push(AccountForgotten);
    }

  dismiss() {
    this.nav.pop();
  }

  showPassword(){
    this.showPasswordEnable = true; 
  }
  hidePassword(){
    this.showPasswordEnable = false; 
  }
  facebookLogin() {
       this.facebookSpinner = true;
       this.nav.push(AccountRegister);
       /*
       this.fb.login(['public_profile', 'user_friends', 'email']).then((response) => {
            this.service.facebookLoginChk(response.authResponse.accessToken).then((results) =>{
                console.log(results);
                this.facebookSpinner = false;
                this.nav.push(AccountRegister, response.authResponse.accessToken);
                //this.nav.setRoot(TabsPage);
                //this.functions.showAlert('성공', '로그인 되었습니다.');
            });
        }).catch((error) => {
            console.log(error)
            this.facebookSpinner = false;
            this.functions.showAlert('에러', error);
        });*/
    }
    naverLogin(){
        this.naver.login()
        .then(
            response => {
                console.log(response)
            }) // 성공
        .catch(
            error => {
                console.error(error)}
            ); // 실패
    }
    kakaoLogin(){
        console.log("kakaotest");

        KakaoTalk.login(
            function (result) {
              console.log('Successful login!');
              console.log(result);
            },
            function (message) {
              console.log('Error logging in');
              console.log(message);
            }
        );
    }
 
    signup(){
        this.nav.push(AccountRegister);
    }

    presentToast(msg) {
        let toast = this.toast.create({
          message: msg,
          duration: 3000,
          position: 'bottom'
        });
      
        toast.onDidDismiss(() => {
          console.log('Dismissed toast');
        });
      
        toast.present();
      }


}
