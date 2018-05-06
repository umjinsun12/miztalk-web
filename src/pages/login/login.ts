import { MenuPage } from './../menu/menu';
import { Values } from './../../services/shopping-services/values';
import { Functions } from './../../services/shopping-services/functions';
import { Service } from './../../services/shopping-services/service';
import { Component } from '@angular/core';
import { IonicPage, NavController} from 'ionic-angular';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginData: any;
    loadLogin: any;
    status: any;
    error: any;
    nonce: any;
    public disableSubmit: boolean = false;
    buttonText: any;
    constructor(public nav: NavController, public service: Service, public functions: Functions, public values: Values) {
        this.loginData = [];
        this.buttonText = "Login";
        this.service.getNonce()
            .then((results) => this.nonce = results);
    }
    login(a) {
        if (this.validateForm()) {
            this.disableSubmit = true;
            this.buttonText = "로그인 중...";
            this.service.login(a, this.nonce.checkout_login)
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
        this.buttonText = "로그인";

        
        if (!results.errors) {
            this.functions.showAlert('성공', '로그인에 성공했습니다.');
            this.nav.setRoot(MenuPage);
        }
        else if (results.errors) {
            this.functions.showAlert('에러', '아이디 혹은 비밀번호가 잘못되었습니다.');
        }
    }
    forgotten(loginData) {
        //this.nav.push(AccountForgotten);
    }

}
