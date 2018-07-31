import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CheckoutService } from '../../../services/shopping-services/checkout-service';
import { Functions } from '../../../services/shopping-services/functions';
import { Values } from '../../../services/shopping-services/values';
import { TabsPage } from '../../tabs/tabs';
import {CartService} from "../../../services/shopping-services/cart-service";
@Component({
    templateUrl: 'order-summary.html'
})
export class OrderSummary {
    orderSummary: any;
    status: any;
    payment: any;
    id: any;
    tabBarElement: any;

    constructor(public nav: NavController, public service: CheckoutService, public params: NavParams, public functions: Functions, public values: Values, public cartService:CartService) {
        this.id = params.data;
        if(document.querySelector(".tabbar"))
        this.tabBarElement = document.querySelector(".tabbar")['style'];
        this.service.getOrderSummary(this.id)
            .then((results) => {
                this.orderSummary = results[0];
                console.log(this.orderSummary);
            });

        for(let key in this.values.cartItem){
          this.delete(key);
        }
    }
    Continue() {
        this.values.count = 0;
        this.nav.popAll();
    }
    ionViewWillEnter(){
        if(document.querySelector(".tabbar"))
        this.tabBarElement.display = 'none';
    }
    ionViewWillLeave(){
        if(document.querySelector(".tabbar"))
        this.tabBarElement.display = 'flex';
    }
    delete(key) {
      console.log(key);
      this.cartService.deleteItem(key).then((results) => {
        console.log(results);
      });
    }
}
