import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  products:any = []

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.products = [
      {
        name: "계란요리 레시피",
        categories: [{name: "간단한 레시피"}],
        images: [{src: "../assets/imgs/reci1.png"}]
      },
      {
        name: "윤식당 닭강정 만들기",
        categories: [{name: "간단한 레시피"}],
        images: [{src: "../../assets/imgs/reci2.png"}]
      },
      {
        name: "스마트폰 중독과 예방",
        categories: [{name: "비너스 육아팁"}],
        price: 33,
        images: [{src: "../../assets/imgs/reci3.png"}]
      },
      {
        name: "은우엄마 뚝딱뚝딱",
        categories: [{name: "간단한 레시피"}],
        images: [{src: "../../assets/imgs/reci4.png"}]
      },
      {
        name: "계란요리 레시피",
        categories: [{name: "간단한 레시피"}],
        images: [{src: "../assets/imgs/reci1.png"}]
      },
      {
        name: "윤식당 닭강정 만들기",
        categories: [{name: "간단한 레시피"}],
        images: [{src: "../../assets/imgs/reci2.png"}]
      },
      {
        name: "스마트폰 중독과 예방",
        categories: [{name: "비너스 육아팁"}],
        price: 33,
        images: [{src: "../../assets/imgs/reci3.png"}]
      },
      {
        name: "은우엄마 뚝딱뚝딱",
        categories: [{name: "간단한 레시피"}],
        images: [{src: "../../assets/imgs/reci4.png"}]
      }
    ]
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

}
