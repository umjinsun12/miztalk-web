import { Component } from '@angular/core';
import { App, NavController, ModalController, ViewController } from 'ionic-angular';
import { Values } from '../../services/shopping-services/values';
import { WishlistPage } from '../../pages/account/wishlist/wishlist';

@Component({
  template: `
    <ion-list style="margin:0">
    <button ion-item (click)="gotoWishlist()">My Wishlist</button>
    </ion-list>
  `
})
export class PopoverPage {

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public app: App,
    public modalCtrl: ModalController,
    public values: Values
  ) { }

  gotoWishlist() {
    this.values.hideTabbar = true;
    this.app.getRootNav().push(WishlistPage);
    this.viewCtrl.dismiss();
  }
}
