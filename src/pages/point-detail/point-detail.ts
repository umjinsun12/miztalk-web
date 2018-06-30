import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Values } from './../../services/shopping-services/values';
import { Service} from './../../services/shopping-services/service';

/**
 * Generated class for the PointDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  templateUrl: 'point-detail.html',
})
export class PointDetailPage {

  pointData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public values: Values, public service: Service) {
    this.pointData = {
      total_count : 0,
      results : []
    }
    this.service.getPointlogs().then(data => {
      this.pointData = data;
      this.pointData.results.forEach(element => {
        element.desc = element.desc.replace(/(<([^>]+)>)/ig,"");
      });
      console.log(this.pointData);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PointDetailPage');
  }

}
