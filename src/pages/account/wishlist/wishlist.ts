import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { WishlistService } from '../../../services/shopping-services/wishlist-service';
import { Values } from '../../../services/shopping-services/values';
import { Functions } from '../../../services/shopping-services/functions';
import { ShoppingCartPage } from '../../shopping-cart/shopping-cart';
import { ShoppingProductPage } from '../../shopping-product/shopping-product';
import { TabsPage } from '../../tabs/tabs';
import {ClayfulService} from "../../../services/shopping-services/clayful-service";

@Component({
    templateUrl: 'wishlist.html'
})
export class WishlistPage {

    wishlist: any = [];
    error: any;
    tabBarElement: any;
    
    constructor(public viewCtrl: ViewController, public nav: NavController, public values: Values, public params: NavParams, public functions: Functions, public service: WishlistService, public clayfulService : ClayfulService) {
      if(document.querySelector(".tabbar"))
      this.tabBarElement = document.querySelector(".tabbar")['style'];
      //this.clayfulService.getWishList().then(results => this.handleWishList(results));
    }

    handleWishList(results){
      this.wishlist = [];
      for(var i=0 ; i < results.length ; i++){
        this.clayfulService.getProduct(results[i]).subscribe(item => {
          this.wishlist.push(JSON.parse(item.data));
          console.log(this.wishlist);
        });
      }
    }

  ionViewDidEnter(){
    this.clayfulService.getWishList().then(results => this.handleWishList(results));
  }

    removeFromWishlist(id) {
      this.values.wishlistId[id] = false;
      this.clayfulService.deleteWishList(id);
      this.clayfulService.getWishList().then(results => this.handleWishList(results));
    }
    updateWish(results, id) {
        if (results.status == "success") {
            this.service.loadWishlist().then((results) => this.wishlist = results);
            this.values.wishlistId.splice(id, 1);
        }
    }
    getCart() {
        this.nav.push(ShoppingCartPage);
    }

    addToCartFromWishlist(id, type) {
        if (type == 'variable') {
            this.nav.push(ShoppingProductPage, id);
        } else {
            this.service.addToCart(id).then((results) => this.updateCart(results, id));
        }
    }
    updateCart(results, id) {
        if (results.error) {
            this.functions.showAlert("ERROR", "error");
        } else {
            this.service.deleteItem(id).then((results) => this.updateWishlist(results));
        }
    }
    updateWishlist(results) {
        this.service.loadWishlist().then((results) => this.wishlist = results);
        this.functions.showAlert("SUCCESS", "Item has been added to cart");
    }
    getProduct(id) {
        this.nav.push(ShoppingProductPage, id);
    }
    gohome() {
        this.nav.pop();
    }
    ionViewWillEnter() {
        if (this.values.hideTabbar) {
            if (document.querySelector(".tabbar")) this.tabBarElement.display = 'none';
        }
    }
    ionViewWillLeave() {
        if (this.values.hideTabbar) {
            if (document.querySelector(".tabbar")) this.tabBarElement.display = 'flex';
        }
    }
}
