import { ClayfulService } from './../../../services/shopping-services/clayful-service';
import { Config } from '../../../services/shopping-services/config';
import { Service } from '../../../services/shopping-services/service';
import { Functions } from '../../../services/shopping-services/functions';
import { Values } from '../../../services/shopping-services/values';
import { Component } from '@angular/core';
import { NavController, ToastController,LoadingController} from 'ionic-angular';
import {AccountRegister} from '../register/register';
import {TabsPage} from '../../tabs/tabs';
import {AccountForgotten} from '../forgotten/forgotten';
import { Naver } from "ionic-plugin-naver";

import { AuthService } from "angular2-social-login";

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
    payloading: any;

    constructor(public nav: NavController, public service: Service, public functions: Functions, public fb: AuthService,public config: Config, public values: Values, public toast :ToastController, public naver: Naver, public loadingCtrl:LoadingController, public clayfulService:ClayfulService) {
        this.loginData = [];
        this.LogIn = "LogIn";
        this.payloading = this.loadingCtrl.create();
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
    goregister(){
      let param = {
        token : 'test',
        sns : 'facebook'
      };
      this.facebookSpinner = false;
      this.nav.push(AccountRegister, param);
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
       this.payloading.present();

       this.clayfulService.loginSns('facebook').then((response) => {
           window.location.href = String(response);
       }).catch(reject => {
            this.payloading.dismiss();
           console.log(reject);
           this.facebookSpinner = false;
       });
    }
    naverLogin(){
        this.payloading.present();
        this.clayfulService.loginSns('naver').then((response) => {
            window.location.href = String(response);
        }).catch(reject => {
             this.payloading.dismiss();
            console.log(reject);
            this.facebookSpinner = false;
        });
    }
    kakaoLogin(){
      this.payloading.present();
      this.payloading.present();
        this.clayfulService.loginSns('kakao').then((response) => {
            window.location.href = String(response);
        }).catch(reject => {
             this.payloading.dismiss();
            console.log(reject);
            this.facebookSpinner = false;
        });
    }


    doKakaoLogin(){
        return new Promise((resolve, reject) => {
            KakaoTalk.login(
                userProfile =>{
                    resolve(userProfile.id);
                },
                err => {
                    reject(err);
                }
            )
        });
    }

    doKakaoAccess(){
        return new Promise((resolve, reject) => {
            KakaoTalk.getAccessToken(
                accessToken =>{
                    resolve(accessToken);
                },
                err => {
                    reject(err);
                }
            );
        });
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
