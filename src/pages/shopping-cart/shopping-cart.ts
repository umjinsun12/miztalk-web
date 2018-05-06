import { Functions } from './../../services/shopping-services/functions';
import { Values } from './../../services/shopping-services/values';
import { CartService } from './../../services/shopping-services/cart-service';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ShoppingCartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  templateUrl: 'shopping-cart.html',
})
export class ShoppingCartPage {

  cart: any;
  status: any;
  obj: any;
  quantity: number;
  update: any;
  options: any;
  number: any;
  addProduct: boolean = true;
  coupon: any;
  a: any;
  disableSubmit: boolean = false;
  buttonCoupon: boolean = false;
  disableSubmitCoupon: boolean = false;
  chosen_shipping: any;
  shipping: any;
  Apply: any;
  Checkout: any;
  constructor(
    public nav: NavController, 
    public service: CartService, 
    public values: Values, 
    public params: NavParams, 
    public functions: Functions) {
      this.Apply = "적용";
      this.Checkout = "주문하기";
      this.quantity = 1;
      this.options = [];
      this.obj = params.data;
      this.service.loadCart()
          .then((results) => this.handleCartInit(results));
  }
  handleCartInit(results) {
      console.log(results);
      this.cart = results;
      this.shipping = results.zone_shipping;
      this.chosen_shipping = results.chosen_shipping;
  }
  handleCart(results) {
      this.cart = results;
  }
  delete(key) {
      this.service.deleteItem(key)
          .then((results) => this.handleCart(results));
  }
  checkout() {
      this.disableSubmit = true;
      this.Checkout = "잠시만 기다려 주세요";
      this.service.checkout()
          .then((results) => this.handleBilling(results));
  }
  handleBilling(results) {
      this.disableSubmit = false;
      this.Checkout = "주문하기";
      //this.nav.push(BillingAddressForm, results);
  }
  deleteFromCart(id, key) {
      if(Object.keys(this.cart.cart_contents).length == 1){
          if(this.cart.cart_contents[key].quantity == 1){
              this.cart.cart_contents = {};
              console.log(this.cart);
          };
      }
      this.service.deleteFromCart(id, key)
          .then((results) => this.handleCart(results));
          
  }
  addToCart(id, key) {
      this.service.addToCart(id, key)
          .then((results) => this.handleCart(results));
  }
  updateCart(results) {
      this.service.loadCart()
          .then((results) => this.handleCart(results));
  }
  handleAddToCart(results) {
      this.service.loadCart()
          .then((results) => this.handleCart(results));
  }
  submitCoupon() {
      if (this.cart.coupon != undefined) {
          this.disableSubmitCoupon = true;
          this.Apply = "적용";
          this.service.submitCoupon(this.cart.coupon)
              .then((results) => this.handleCoupon(results));
      }
  }
  removeCoupon() {
      this.service.removeCoupon(this.cart.applied_coupons)
          .then((results) => this.handleCoupon(results));
  }
  handleCoupon(results) {
      console.log(results);
      this.disableSubmitCoupon = false;
      this.Apply = "적용";
      this.functions.showAlert("STATUS", results._body);
      this.service.loadCart()
          .then((results) => this.handleCart(results));
  }
  handleResults(a) {
      if (a.message.status == 'success') {
          this.functions.showAlert(a.message.status, a.message.text);
      }
      else {
          this.functions.showAlert(a.message.status, a.message.text);
      }
  }
  updateShipping(method) {
      this.chosen_shipping = method;
      this.service.updateShipping(method)
          .then((results) => this.handleShipping(results));
  }
  handleShipping(results) {
      this.cart = results;
  }
}
