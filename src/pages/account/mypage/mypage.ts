import { Component } from '@angular/core';
import { NavController, ViewController, IonicPage } from 'ionic-angular';
import { Service } from '../../../services/shopping-services/service';
import { Config } from '../../../services/shopping-services/config';
import { Values } from '../../../services/shopping-services/values';
import { AppRate } from '@ionic-native/app-rate';
import { SocialSharing } from '@ionic-native/social-sharing';
import { EmailComposer } from '@ionic-native/email-composer';
import { Address } from '../address/address';
import { MyInformation } from '../my-information/my-information';
import { Orders } from '../orders/orders';
import { WishlistPage } from '../wishlist/wishlist';
import { AccountLogin } from '../login/login';
import { AccountRegister } from '../register/register';
import {PointDetailPage} from '../../point-detail/point-detail'
//import { Post } from '../../post/post';
/**
 * Generated class for the MypagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  templateUrl: 'mypage.html',
})
export class MypagePage {

  tabBarElement: any;
    showtab: boolean = false;
    constructor(public viewCtrl: ViewController, private appRate: AppRate, private socialSharing: SocialSharing, public nav: NavController, public service: Service, public values: Values, private emailComposer: EmailComposer, public config: Config) {
        
        //if(document.querySelector(".tabbar"))
        //this.tabBarElement = document.querySelector(".tabbar")['style'].display = 'none';
        //this.showtab = false;
    }
    hidetabs() {
        this.showtab = false;
        if (document.querySelector(".tabbar")) this.tabBarElement = document.querySelector(".tabbar")['style'].display = 'none';
    }
    showtabs() {
        this.showtab = true;
        if (document.querySelector(".tabbar")) this.tabBarElement = document.querySelector(".tabbar")['style'].display = 'flex';
    }
    Address() {
        this.nav.push(Address);
    }
    orders() {
        this.nav.push(Orders);
    }
    wishlist() {
        this.values.hideTabbar = false;
        this.nav.push(WishlistPage);
    }
    myInfo() {
        this.nav.push(MyInformation);
    }
    logout() {
        this.service.logout();
        if (!this.values.hideCloseButton) {
            this.nav.pop();
        }
    }
    login() {
        this.values.cartLoadEnable = false;
        this.nav.push(AccountLogin);
    }
    sinuUp() {
        this.nav.push(AccountRegister);
    }
    rateApp() {
        this.appRate.preferences.storeAppURL = {
            ios: this.config.appRateIosAppId,
            android: this.config.appRateAndroidLink,
            windows: 'ms-windows-store://review/?ProductId=' + this.config.appRateWindowsId
        };
        this.appRate.promptForRating(true);
    }
    ionViewWillEnter() {
        console.log('mypage :  ' + this.values.customerName);
    }

    showPointDetail(){
        if(this.values.isLoggedIn)
          this.nav.push(PointDetailPage);
      }
    shareApp() {
        var options = {
            message: this.config.shareAppMessage,
            subject: this.config.shareAppSubject,
            files: ['', ''],
            url: this.config.shareAppURL,
            chooserTitle: this.config.shareAppChooserTitle
        }
        this.socialSharing.shareWithOptions(options);
    }
    contact() {
        let email = {
            to: this.config.supportEmail,
            subject: '',
            body: '',
            isHtml: true
        };
        this.emailComposer.open(email);
    }
    post(id) {
        //this.nav.push(Post, id);
    }
    dismiss() {
        this.nav.pop();
    }

}
