import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Service } from '../../../services/shopping-services/service';
import { NgDaumAddressModule } from 'ng2-daum-address';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public service : Service) {
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
