import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Service } from '../../../services/shopping-services/service';

/**
 * Generated class for the AddressSearchFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  templateUrl: 'address-search-form.html'
})
export class AddressSearchFormPage {

  callback : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public service : Service) {
    window.addEventListener("message", function($data){
        if(navParams.get('data') == true){
          if($data.data.isInput == true){
            var cc = navParams.get('callback');
            navParams.data = false;
            cc($data.data).then(() => {navCtrl.pop()});
          }
        }
    },false);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddressSearchFormPage');
  }

  daumAddressOptions =  {
    class: ['btn', 'btn-primary'],
    type : 'layer',
    target : 'layer'
  };
  
  setDaumAddressApi(data){
    // 여기로 주소값이 반환
    console.log(data);
  }


}
