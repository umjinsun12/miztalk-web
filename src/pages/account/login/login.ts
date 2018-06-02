import { Config } from './../../../services/shopping-services/config';
import { MenuPage } from './../../menu/menu';
import { Service } from './../../../services/shopping-services/service';
import { Functions } from './../../../services/shopping-services/functions';
import { Values } from './../../../services/shopping-services/values';
import { Component } from '@angular/core';
import { IonicPage, NavController} from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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

    constructor(public nav: NavController, public service: Service, public functions: Functions, public config: Config, public values: Values, public fb: Facebook /*public googlePlus: GooglePlus*/) {
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
            this.functions.showAlert('success', 'You have successfully logged in');
            if(this.values.cartLoadEnable){
                //this.nav.setRoot(CartPage);
            }
            else{
            //this.nav.setRoot(TabsPage);
            }
        }
        else if (results.errors) {
            this.functions.showAlert('error', 'invalid username/password');
        }
    }
    forgotten() {
        //this.nav.push(AccountForgotten);
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
                //this.nav.setRoot(TabsPage);
                
                this.functions.showAlert('success', 'Logged in successfully');
            });
        }).catch((error) => {
            console.log(error)
            this.facebookSpinner = false;
            this.functions.showAlert('Error', error);
        });
    }
    /*
    gmailLogin() {
        this.googleSpinner = true;
        this.googlePlus.login({
            'scopes': '',
            'webClientId': this.config.webClientId,
            'offline': true
        }).then((res) => {
             this.gres = res;
             console.log(this.gres);
            this.googleSpinner = false;
            this.values.avatar = res.imageUrl;
            
            this.service.googleLogin(res).then((results) => {
                this.functions.showAlert('success', 'Logged in successfully');
                this.nav.setRoot(TabsPage);
            });
        }).catch((err) => {
            this.googleSpinner = false;
            this.error = err;
            this.functions.showAlert('Error', err);
            console.error(err);
        });
    }*/
    signup(){
        //this.nav.push(AccountRegister);
    }
}
