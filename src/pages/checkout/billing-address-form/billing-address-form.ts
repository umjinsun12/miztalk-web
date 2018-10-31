import { ClayfulService } from './../../../services/shopping-services/clayful-service';
import { Component, ViewChild, ElementRef} from '@angular/core';
import { Values } from '../../../services/shopping-services/values';
import { Functions } from '../../../services/shopping-services/functions';
import { Service } from '../../../services/shopping-services/service'
import { CheckoutService } from '../../../services/shopping-services/checkout-service';
import { NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { OrderSummary } from '../../checkout/order-summary/order-summary';
import { FormGroup,  FormBuilder, Validators }	from '@angular/forms';
import { AddressSearchFormPage } from '../address-search-form/address-search-form';

import { IamportService } from 'iamport-ionic-inicis3';

import {TabsPage} from '../../tabs/tabs';
import {CmsService} from "../../../services/cms-service.service";
import {TermsPage} from "../../account/terms/terms";

declare var IMP;




/**
 * Generated class for the BillingAddressFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  templateUrl: 'billing-address-form.html'
})
export class BillingAddressForm {
  @ViewChild('addrDetail') inputAddrDetail: ElementRef;
  billingAddressForm: any;
  billing: any;
  regions: any;
  status: any;
  errorMessage: any;
  address: any;
  form: any;
  states: any;
  OrderReview: any;
  loginData: any;
  id: any;
  couponStatus: any;
  buttonSubmit: boolean = false;
  buttonSubmitLogin: boolean = false;
  buttonSubmitCoupon: boolean = false;
  PlaceOrder: any;
  buttonText1: any;
  LogIn: any;
  mydate: any;
  time: any;
  date: any;
  selectedDate: any;
  shipping: any;
  order: any;
  buttonText : any;
  enableBillingAddress: boolean = true;
  enableShippingMethods: boolean = true;
  enableShippingForm : boolean = false;
  enableLogin: boolean = false;
  enableAddressSearch: boolean = false;
  chosen_shipping: any;
  showPasswordEnable: boolean = false;
  enablePaymentMethods : boolean = true;
  showAddress: boolean = true;
  tabBarElement: any;
  payloading:any;

  pointVerify: boolean = false;

  cart:any;

  addrForm: FormGroup = this.builder.group({
    zip: ['', [Validators.required]],
    addr: ['', [Validators.required]],
    addrDetail: [''],
  });

  
  
  constructor(
      private viewCtrl: ViewController, 
      public iab: InAppBrowser, 
      public nav: NavController, 
      public service: CheckoutService, 
      params: NavParams, 
      public functions: Functions, 
      public values: Values, 
      public addressservice : Service,
      private builder: FormBuilder,
      public iamport: IamportService,
      public loadingCtrl: LoadingController,
      public cmsService : CmsService,
      public clayfulService : ClayfulService) {

      this.PlaceOrder = "Place Order";
      this.buttonText1 = "Apply";
      this.LogIn = "LogIn";
      this.loginData = [];
      this.form = params.data;
      this.fillShippingForm();
      console.log(this.form);
      this.billing = {};
      if(document.querySelector(".tabbar"))
      this.tabBarElement = document.querySelector(".tabbar")['style'];
      this.billing.save_in_address_book = true;
      this.form.shipping = true;
      this.shipping = {};
      this.shipping.save_in_address_book = true;
      this.cart = this.values.clayful_checkout;
      console.log("checkout cart");
      console.log(this.cart);

      if(this.values.isLoggedIn){
          if(this.form.billing_country == "" || this.form.billing_country == undefined || this.form.billing_state =="" || this.form.billing_state == undefined || this.form.billing_postcode == "" || this.form.billing_postcode == undefined){
              this.enableBillingAddress = true;
              this.enableLogin = false;
          }
          else {
          this.showAddress = true;
          this.enableLogin = false;
          this.enableShippingMethods = true;
          this.enablePaymentMethods = true;
          this.form.biterms = true;
          }
      }
      else if(!this.values.isLoggedIn){
          this.enableLogin = false; // 로그인 처리
      }
  }
  fillShippingForm() {
      this.form.shipping_first_name = this.form.billing_first_name;
      this.form.shipping_last_name = this.form.billing_last_name;
      this.form.shipping_address_1 = this.form.billing_address_1;
      this.form.shipping_address_2 = this.form.billing_address_2;
      this.form.shipping_city = this.form.billing_city;
      this.form.shipping_country = this.form.billing_country;
      this.form.shipping_state = this.form.billing_state;
      this.form.shipping_postcode = this.form.billing_postcode;
  }

  checkout() {
      if (this.validateAddress()) {
          this.buttonSubmit = true;
          this.PlaceOrder = "Placing Order";
          console.log(this.form.payment_method);
          if (this.form.shipping) {
              this.form.shipping_first_name = this.form.billing_first_name;
              this.form.shipping_last_name = this.form.billing_last_name;
              this.form.shipping_company = this.form.billing_company;
              this.form.shipping_address_1 = this.form.billing_address_1;
              this.form.shipping_address_2 = this.form.billing_address_2;
              this.form.shipping_city = this.form.billing_city;
              this.form.shipping_country = this.form.billing_country;
              this.form.shipping_state = this.form.billing_state;
              this.form.shipping_postcode = this.form.billing_postcode;
          }

          //주문자 성함 this.form.billing_last_name
          //주문자 번호 this.form.billing_first_name
          //수령자 성함 this.form.shipping_last_name
          //수령자 번호 this.form.shipping_fitst_name
          //우편 번호 this.form.billing_postcode
          //주소 this.form.billing_address_1
          //상세주소 this.form.billing_address_2
          //배송시 요청사항 this.form.billing_company
        //결제 방법 this.form.payment_method
        //포인트 this.form.user_point
            this.payloading = this.loadingCtrl.create();
            this.payloading.present();

            console.log(this.form.payment_method);
            if(this.values.isLoggedIn){
                var payload = {
                    currency: "KRW",
                    paymentMethod: 'clayful-iamport',
                    address: {
                        shipping: {
                            name : {
                                full : this.form.shipping_last_name
                            },
                            country : "KR",
                            city: this.form.billing_address_1,
                            state: this.form.billing_address_1,
                            postcode : this.form.billing_postcode,
                            address1 : this.form.billing_address_1,
                            address2 : this.form.billing_address_2,
                            mobile : this.form.shipping_fitst_name
                        },
                        billing: {
                            name: {
                                full : this.form.billing_last_name
                            },
                            country : "KR",
                            city: this.form.billing_address_1,
                            state: this.form.billing_address_1,
                            postcode : this.form.billing_postcode,
                            address1 : this.form.billing_address_1,
                            address2 : this.form.billing_address_2,
                            mobile : this.form.billing_first_name
                        }
                    },
                    request : this.form.billing_company
                }

                var productList = [];
                for(var i=0 ; i < this.cart.items.length ; i++){
                    productList.push({
                        id : this.cart.items[i]._id,
                        price : this.cart.items[i].price.sale.raw
                    });
                }
                var userPoint = 1000;
                this.clayfulService.checkoutOrderLogin(payload, productList, userPoint)
                .then(result => this.handlePayment(result))
                .catch(err => {
                    if(err.msg == "none_point")
                        this.functions.showAlert("에러", "포인트가 부족합니다.");
                    else if(err.msg == "none_user")
                        this.functions.showAlert("에러", "회원이 아닙니다.");
                    else
                        this.functions.showAlert("에러", "주문을 다시 진행해주세요.");
                    this.payloading.dismiss();
                    this.buttonSubmit = false;
                });
            }
            else{
                var payloadNon = {
                    currency: "KRW",
                    paymentMethod: 'clayful-iamport',
                    items : [],
                    customer:{
                        name: {
                            full: this.form.shipping_last_name
                        },
                        mobile: this.form.shipping_fitst_name,
                        phone: this.form.shipping_fitst_name,
                        country: "KR",
                        currency: "KRW"
                    },
                    address: {
                        shipping: {
                            name : {
                                full : this.form.shipping_last_name
                            },
                            country : "KR",
                            city: this.form.billing_address_1,
                            state: this.form.billing_address_1,
                            postcode : this.form.billing_postcode,
                            address1 : this.form.billing_address_1,
                            address2 : this.form.billing_address_2,
                            mobile : this.form.shipping_fitst_name
                        },
                        billing: {
                            name: {
                                full : this.form.billing_last_name
                            },
                            country : "KR",
                            city: this.form.billing_address_1,
                            state: this.form.billing_address_1,
                            postcode : this.form.billing_postcode,
                            address1 : this.form.billing_address_1,
                            address2 : this.form.billing_address_2,
                            mobile : this.form.billing_first_name
                        }
                    },
                    request : this.form.billing_company
                }
                for(var k= 0 ;k < this.cart.items.length ; k++){
                    var item = {
                        _id : this.cart.items[k].product._id,
                        product : this.cart.items[k].product._id,
                        variant : this.cart.items[k].variant._id,
                        quantity : this.cart.items[k].quantity.raw,
                        shippingMethod : this.cart.items[k].shippingMethod._id
                    }
                    payloadNon.items.push(item);
                }

                this.clayfulService.checkoutOrderNonLogin(payloadNon).then(results => this.handlePayment(results));
            }
      }

  }
  handlePayment(result) {
      console.log(result);
      this.cart.items;
    var product_name = null;
    if(this.cart.items.length >= 2){
        product_name = this.cart.items[0].product.name + ' 외 ' + String(parseInt(this.cart.items.length) - 1) + '개';
    }else{
        product_name = this.cart.items[0].product.name;
    }

    const param = {
        pg : 'html5_inicis',
        pay_method : this.form.payment_method,
        merchant_uid : result._id,
        name : product_name,
        amount : result.total.amount,
        buyer_email : result.customer.email,
        buyer_name : result.customer.name.full,
        buyer_tel : result.customer.mobile,
        buyer_addr : this.form.billing_address_1,
        buyer_postcode : this.form.billing_postcode,
        m_redirect_url : this.values.miztalk_url + "?order=" + result._id
      };

      IMP.request_pay(param, function(rsp){
        if ( rsp.success ) {
            window.open(this.values.miztalk_url + "?order=" + result._id);
        } else {
            window.open(this.values.miztalk_url + "?order=err");
        }
      });
  }
  checkoutStripe() {
      this.buttonSubmit = true;
      this.PlaceOrder = "Placing Order";
      this.service.getStripeToken(this.form).then((results) => this.handleStripeToken(results));
  }
  handleStripeToken(results) {
      if (results.error) {
          this.buttonSubmit = false;
          this.PlaceOrder = "Place Order";
          this.functions.showAlert("ERROR", results.error.message);
      } else {
          this.service.stripePlaceOrder(this.form, results).then((results) => this.handleBilling(results));
          this.buttonSubmit = false;
      }
  }

  biterms(){
    this.nav.push(TermsPage);
  }

  handlePoint(results){
    if (results.result == "success") {
      var str = results.redirect;
      var pos1 = str.lastIndexOf("order-received/");
      var pos2 = str.lastIndexOf("?key=wc_order");
      var pos3 = pos2 - (pos1 + 15);
      var order_id = str.substr(pos1 + 15, pos3);
      this.payloading.dismiss();
      this.nav.push(OrderSummary, order_id);
    } else if (results.result == "failure") {
      this.functions.showAlert("ERROR", results.messages);
    }
    this.buttonSubmit = false;
    this.PlaceOrder = "Place Order";
  }

  handleBilling(results) {
      if (results.result == "success") {
          var str = results.redirect;
          var pos1 = str.lastIndexOf("order-received/");
          var pos2 = str.lastIndexOf("?key=wc_order");
          var pos3 = pos2 - (pos1 + 15);
          var order_id = str.substr(pos1 + 15, pos3);
          this.cmsService.receiveSmsAcount(this.form.billing_first_name, this.OrderReview.totals.total).subscribe(result => {
            this.payloading.dismiss();
            this.nav.push(OrderSummary, order_id);
          });
      } else if (results.result == "failure") {
          this.functions.showAlert("ERROR", results.messages);
      }
      this.buttonSubmit = false;
      this.PlaceOrder = "Place Order";
  }
  login() {
      if (this.validateForm()) {
          this.buttonSubmitLogin = true;
          this.loginData.checkout_login = this.form.checkout_login;
          this.LogIn = "Please Wait";
          this.service.login(this.loginData).then((results) => this.handleResults(results));
      }
  }
  validateForm() {
      if (this.loginData.username == undefined || this.loginData.username == "") {
          return false
      }
      if (this.loginData.password == undefined || this.loginData.password == "") {
          return false
      } else {
          return true
      }
  }
  handleResults(a) {
      this.buttonSubmitLogin = false;
      this.LogIn = "LogIn";
      //this.form.shipping = true;
      if (a.user_logged) {
          this.form = a;
          this.states = this.form.state[this.form.billing_country];
          this.values.isLoggedIn = a.user_logged;
          this.values.customerName = a.billing_first_name;
          this.values.customerId = a.user_id;
          this.values.logoutUrl = a.logout_url;
          this.showAddress = true;
          this.enableLogin = false;
          this.enableShippingMethods = true;
          this.enablePaymentMethods = true;
          this.fillShippingForm();
      } else {
          this.functions.showAlert("Error", 'Login unsuccessful. try again');
      }
  }
  terms() {
      //this.nav.push(TermsCondition, this.form.terms_content);
  }

  ordererequal(){
      if(this.form.orderchk == true){
        this.form.shipping_last_name = this.form.billing_last_name;
        this.form.shipping_fitst_name = this.form.billing_first_name;
      }
      else{
        this.form.shipping_last_name = "";
        this.form.shipping_fitst_name = "";
      }
  }

  showPassword() {
      this.showPasswordEnable = true;
  }
  hidePassword() {
      this.showPasswordEnable = false;
  }
  forgotten() {
      //this.nav.push(AccountForgotten);
  }
  continueAsGuest() {
      this.enableBillingAddress = true;
      this.enableLogin = false;
      this.viewCtrl.showBackButton(true);
  }
  showShippingForm() {
      if (this.validateBillingForm()) {
          if (this.form.shipping) {
              this.form.shipping_first_name = this.form.billing_first_name;
              this.form.shipping_last_name = this.form.billing_last_name;
              this.form.shipping_address_1 = this.form.billing_address_1;
              this.form.shipping_address_2 = this.form.billing_address_2;
              this.form.shipping_city = this.form.billing_city;
              this.form.shipping_country = this.form.billing_country;
              this.form.shipping_state = this.form.billing_state;
              this.form.shipping_postcode = this.form.billing_postcode;
              this.showAddress = true;
              this.enableShippingMethods = true;
              this.enablePaymentMethods = true;
              this.enableBillingAddress = false;
              this.viewCtrl.showBackButton(true);
          } else if (!this.form.shipping) {
              if (this.values.isLoggedIn) {
                  this.showAddress = true;
              } else {
                  this.enableShippingForm = true;
                  this.viewCtrl.showBackButton(false);
              }
              this.enableBillingAddress = false;
          }
      }
  }
  showShippingMethods() {
      if (this.validateShippingForm()) {
          this.enableShippingForm = false;
          this.enableBillingAddress = false;
          this.showAddress = true;
          this.enableShippingMethods = true;
          this.enablePaymentMethods = true;
          this.viewCtrl.showBackButton(true);
      }
  }
  validateBillingForm() {
      if (this.form.billing_first_name == undefined || this.form.billing_first_name == "") {
          this.functions.showAlert("에러", "휴대폰 번호를 입력해 주세요");
          return false
      }
      return true
  }
  validateShippingForm() {
      if (this.form.shipping_first_name == undefined || this.form.shipping_first_name == "") {
          this.functions.showAlert("에러", "휴대폰 번호를 입력해 주세요");
          return false
      }
      else {
          return true
      }
  }
  editBillingForm() {
      this.enableBillingAddress = true;
      this.showAddress = false;
      this.enableShippingForm = false;
      this.enableShippingMethods = false;
      this.enablePaymentMethods = false;
      this.viewCtrl.showBackButton(false);
  }
  editShippingForm() {
      this.enableShippingForm = true;
      this.showAddress = false;
      this.enableBillingAddress = false;
      this.enableShippingMethods = false;
      this.enablePaymentMethods = false;
      this.viewCtrl.showBackButton(false);
  }
  backToBillingForm() {
      this.enableBillingAddress = true;
      this.enableShippingForm = false;
      this.viewCtrl.showBackButton(true);
  }
  backToAddressPage() {
      this.enableShippingForm = false;
      this.enableBillingAddress = false;
      this.showAddress = true;
      this.enableShippingMethods = true;
      this.enablePaymentMethods = true;
      this.viewCtrl.showBackButton(true);
  }
  validateAddress() {
      if (this.form.show_terms && !this.form.terms) {
          this.functions.showAlert("에러", "쇼핑 이용약관에 동의해야 합니다.");
          return false;
      }
      if (!this.values.isLoggedIn && !this.form.biterms){
          this.functions.showAlert("에러", "비회원 개인정보내역 수집에 동의하셔야 합니다.");
          return false;
      }
      if (this.form.billing_first_name == undefined || this.form.billing_first_name == "") {
          this.functions.showAlert("에러", "휴대폰 번호를 입력해 주세요");
          //return false            
      }
      if (this.form.billing_address_1 == undefined || this.form.billing_address_1 == "") {
          this.functions.showAlert("에러", "주소를 입력해 주세요");
          //return false
      }
      else {
          return true
      }
  }

  daumAddressOptions =  {
    class: ['btn', 'btn-primary'],
    type : 'layer',
    target : 'layer',
    debug : true
  };
  
  setDaumAddressApi(data){
    this.addrForm.patchValue({
        zip: data.zip,
        addr: data.addr
      });
      this.form.billing_postcode = data.zip;
      this.form.billing_address_1 = data.addr;
      //this.inputAddrDetail.nativeElement.setFocus();
    console.log(data);
  }

  callDaumAddress(){
    this.nav.push(AddressSearchFormPage, {
        data : true,
        callback : (data) => {
            return new Promise((resolve, reject) => {
                console.log(data);
                this.form.billing_postcode = data.zonecode;
                this.form.billing_address_1 = data.address;
                resolve();
            })
        }
    });
  }

  pointInsert(){
      if(this.form.user_point==0 || this.form.user_point== undefined){
          this.functions.showAlert("알림", "포인트를 입력해주세요");
      }
      else if(this.form.user_point > this.values.point){
          this.functions.showAlert("알림", "이용가능 포인트가 부족합니다.");
      }
      else if(this.form.user_point % 100 > 0){
          this.functions.showAlert("알림","포인트는 100원 단위로 입력만 가능합니다. 다시한번 적용 버튼을 눌러주세요.");
          this.form.user_point = this.form.user_point - this.form.user_point % 100;
      }else{
          this.functions.showAlert("알림", "포인트가 적용되었습니다.")
          this.pointVerify = true;
      }
  }
  pointCancle(){
    this.form.user_point = 0;
    this.pointVerify = false;
  }

  onChangeTime(){
      console.log('changed');
  }
  test(){
    this.form.billing_postcode = "test";
    this.form.billing_address_1 = "test";
  }

  ionViewWillEnter() {
      if (document.querySelector(".tabbar")) this.tabBarElement.display = 'none';
  }
}
