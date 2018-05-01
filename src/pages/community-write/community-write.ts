import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Service } from '../../services/shopping-services/service';

/**
 * Generated class for the CommunityWritePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-community-write',
  templateUrl: 'community-write.html',
})
export class CommunityWritePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public service: Service) {
  }

  ionViewDidLoad() {
    this.service.submitPost();
  }

}
