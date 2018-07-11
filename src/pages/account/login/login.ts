import { Config } from './../../../services/shopping-services/config';
import { Service } from './../../../services/shopping-services/service';
import { Functions } from './../../../services/shopping-services/functions';
import { Values } from './../../../services/shopping-services/values';
import { Component } from '@angular/core';
import { NavController, ToastController} from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import {AccountRegister} from '../register/register';
import {TabsPage} from '../../tabs/tabs';
import {AccountForgotten} from '../forgotten/forgotten'

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

    constructor(public nav: NavController, public service: Service, public functions: Functions, public config: Config, public values: Values, public fb: Facebook, public toast :ToastController) {
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
       this.fb.login(['public_profile', 'user_friends', 'email']).then((response) => {
            this.service.sendToken(response.authResponse.accessToken).then((results) => {
                this.facebookSpinner = false;
                this.nav.setRoot(TabsPage);
                this.functions.showAlert('success', 'Logged in successfully');
            });
        }).catch((error) => {
            console.log(error)
            this.facebookSpinner = false;
            this.functions.showAlert('Error', error);
        });
    }
    naverLogin(){

    }
    kakaoLogin(){
        console.log("kakaotest");

        KakaoTalk.login(
            function (result) {
              console.log('Successful login!');
              console.log(result);
              this.presentToast(result);
            },
            function (message) {
              console.log('Error logging in');
              console.log(message);
              this.presentToast(message);
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
