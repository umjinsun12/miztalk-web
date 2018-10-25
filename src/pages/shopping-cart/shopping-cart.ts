import { BillingAddressForm } from './../checkout/billing-address-form/billing-address-form';
import { ClayfulService } from './../../services/shopping-services/clayful-service';
import { Functions } from '../../services/shopping-services/functions';
import { Values } from '../../services/shopping-services/values';
import { CartService } from '../../services/shopping-services/cart-service';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController, AlertController } from 'ionic-angular';
import { ShoppingProductPage } from '../shopping-product/shopping-product';
import { ShoppingPage } from '../shopping/shopping';



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

    cart: any = {};
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
    enableCoupon: boolean = false;
    tabBarElement: any;
    allpointchk: boolean = false;

    constructor(public alertCtrl: AlertController,public viewCtrl: ViewController, public nav: NavController, public service: CartService, public values: Values, public params: NavParams, public functions: Functions, private toastCtrl: ToastController, public clayfulService: ClayfulService) {
        this.Apply = "적용";
        this.Checkout = "Checkout";
        this.quantity = 1;
        this.coupon = 0;
        if(document.querySelector(".tabbar"))
        this.tabBarElement = document.querySelector(".tabbar")['style'];
        this.options = [];
        this.obj = params.data;
        this.cart = {
            items : []
        }
        if(this.values.isLoggedIn){
            this.clayfulService.getCartLogin().then(result => this.handleCartInit(result));
        }else{
            this.values.count = this.values.clayful_cart.length;
            console.log(this.values.clayful_cart);
            this.cart.items = this.values.clayful_cart;
        }
    }
    handleCartInit(results) {
        this.cart = results;
        this.values.count = this.cart.items.length;
        console.log(this.cart);
    }
    handleCart(results) {
        this.cart = results;
        console.log(this.cart);
    }
    delete(id) {
        this.clayfulService.deleteCartItemLogin(id).then(result => {
            this.clayfulService.getCartLogin().then(result => this.handleCart(result));
        });
    }
    checkout() {
        this.disableSubmit = true;
        this.Checkout = "Please Wait";

        this.values.clayful_checkout = this.cart;
        console.log("cart 체크아웃 직전");
        console.log(this.values.clayful_checkout);

        if(this.values.isLoggedIn == false){
            let alert = this.alertCtrl.create({
                title: '안내',
                message: '비회원 구매시 구매 포인트 적립 및 이벤트 쿠폰 제공 등 각종 할인혜택에서 제외됩니다.',
                buttons: [
                  {
                    text: '취소',
                    role: 'cancel',
                    handler: () => {
                      console.log('Cancel clicked');
                      this.disableSubmit = false;
                    }
                  },
                  {
                    text: '확인',
                    handler: () => {
                        this.nav.push(BillingAddressForm);
                    }
                  }
                ]
              });
    
            alert.present().then(()=>{
            });
        }
        else{
            this.nav.push(BillingAddressForm);   
        }
    }

    cartClear(){
      var cnt = 0;
      for(var i=0 ; i < this.cart.items.length ; i++){
          this.clayfulService.deleteCartItemLogin(this.cart.items[i]._id).then(result => {
            cnt++;
            if(cnt >= this.cart.items.length){
                this.cart = {
                    items : []
                };
            }
        });
      }
    }
    
    deleteFromCart(id, key) {
        this.service.deleteFromCart(id, key).then((results) => this.handleCart(results));
    }
    addToCart(id, key) {
        this.service.addToCart(id, key).then((results) => this.handleCart(results));
    }
    updateCart(results) {
        this.service.loadCart().then((results) => this.handleCart(results));
    }
    allpoint(){
        if(this.allpointchk){
            console.log("chkeeasdf!!!");
            console.log(this.values.point);
            console.log(this.cart.cart_totals);
            if(parseInt(this.values.point) >= parseInt(this.cart.cart_totals.total)){
                this.cart.coupon = this.cart.cart_totals.total;
            }else{
                this.cart.coupon = this.values.point;
            }
        }
        else{
            this.allpointchk = false;
            this.cart.coupon = 0;
        }
    }

    submitCoupon() {
        if(this.disableSubmitCoupon == true){
            this.disableSubmitCoupon = false;
            this.Apply = "적용";
            this.cart.cart_totals.total = parseInt(this.cart.cart_totals.total) + parseInt(this.cart.coupon);
        }
        else if (this.cart.coupon != undefined) {
            if(this.cart.coupon <= this.values.point){
                if(this.cart.cart_totals.total - this.cart.coupon >= 0){
                    this.disableSubmitCoupon = true;
                    this.Apply = "취소";
                    this.cart.cart_totals.total = parseInt(this.cart.cart_totals.total) - parseInt(this.cart.coupon);
                }else{
                    console.log(this.cart.coupon);
                    console.log(this.cart.cart_totals.total);
                    this.functions.showAlert("오류", "상품 가격보다 많은 포인트를 입력하였습니다.")
                }
            }
            else{
                this.functions.showAlert("오류", "사용 가능 포인트보다 많은 포인트를 입력하였습니다.");
            }
        }
    }
    handleCoupon(results) {
        this.disableSubmitCoupon = false;
        this.Apply = "Apply";
        this.enableCoupon = false;
        this.cart.coupon = "";
        this.functions.showAlert("STATUS", results._body);
        this.service.loadCart().then((results) => this.handleCart(results));
    }
    removeCoupon() {
        this.service.removeCoupon(this.cart.applied_coupons).then((results) => this.handleRemoveCoupon(results));
    }
    handleRemoveCoupon(results) {
        this.functions.showAlert(results.status, results.message);
        this.service.loadCart().then((results) => this.handleCart(results));
    }
    enableCouponOffer() {
        if (this.enableCoupon) {
            this.enableCoupon = false;
        } else {
            this.enableCoupon = true;
        }
    }
    handleResults(a) {
        if (a.message.status == 'success') {
            this.functions.showAlert(a.message.status, a.message.text);
        } else {
            this.functions.showAlert(a.message.status, a.message.text);
        }
    }
    updateShipping(method) {
        this.chosen_shipping = method;
        this.service.updateShipping(method).then((results) => this.handleShipping(results));
    }
    handleShipping(results) {
        this.cart = results;
    }
    gohome() {
        this.nav.setRoot(ShoppingPage);
    }
    getProduct(id) {
        this.nav.push(ShoppingProductPage, id);
    }
    wishlist() {
        //this.nav.push(WishlistPage);
    }
    addToWishlist(id) {
        if (this.values.isLoggedIn) {
            this.service.addToWishlist(id).then((results) => this.updateWishlist(results));
        } else {
            this.presentToastLoginAlert();
        }
    }
    updateWishlist(a) {
        if (a.success == "Success") {
            this.presentToast();
            this.values.wishlistId[this.cart.cart_contents.product_id] = true;
        } else {
            this.functions.showAlert("error", "error");
        }
    }
    presentToast() {
        let toast = this.toastCtrl.create({
            message: 'Item added to wishlist',
            duration: 2000,
            position: 'top'
        });
        toast.present();
    }
    presentToastLoginAlert() {
        let toast = this.toastCtrl.create({
            message: 'You must login to add product to wishlist',
            duration: 2000,
            position: 'top'
        });
        toast.present();
    }
    ionViewWillEnter() {
        if (document.querySelector(".tabbar")) this.tabBarElement.display = 'none';
    }
    ionViewWillLeave() {
            if(document.querySelector(".tabbar"))
            this.tabBarElement.display = 'flex';
    }

    presentConfirm() {
        let alert = this.alertCtrl.create({
          title: '안내',
          message: '비회원 구매시 구매 포인트 적립 및 이벤트 쿠폰 제공 등 각종 할인혜택에서 제외됩니다.',
          buttons: [
            {
              text: '취소',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            },
            {
              text: '확인',
              handler: () => {
                console.log('Yes clicked');
              }
            }
          ]
        });

         
        
      }

}
