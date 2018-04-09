import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tab1Root: any = 'HomePage';
  tab2Root: any = 'CommunityPage';
  tab3Root: any = 'EventPage';
  tab4Root: any = 'ShoppingPage';
  tab5Root: any = 'MypagePage';
  myIndex: number;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
     this.myIndex = navParams.data.tabIndex || 0;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

}
