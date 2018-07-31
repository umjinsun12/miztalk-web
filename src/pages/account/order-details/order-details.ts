import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Service } from '../../../services/shopping-services/service';
import { Values } from '../../../services/shopping-services/values';

@Component({
    templateUrl: 'order-details.html',
})
export class OrderDetails {
    orderDetails: any;
    id: any;
    constructor(public nav: NavController, public service: Service, params: NavParams, public values: Values) {
        this.id = params.data;
        this.service.getOrder(this.id)
            .then((results) => this.orderDetails = results);
    }
}
