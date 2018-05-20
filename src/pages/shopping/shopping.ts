import { Service } from './../../services/shopping-services/service';
import { Functions } from './../../services/shopping-services/functions';
import { ShoppingProductPage } from './../shopping-product/shopping-product';
import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Values } from '../../services/shopping-services/values';
import { ShoppingCartPage } from '../shopping-cart/shopping-cart';

/**
 * Generated class for the ShoppingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-shopping',
  templateUrl: 'shopping.html',
})
export class ShoppingPage {

    status: any;
    items: any;
    product: any;
    options: any;
    id: any;
    variationID: any;
    time: any;
    has_more_items: boolean = true;

    constructor(
        public nav: NavController, 
        public service: Service, 
        public values: Values,
        public functions: Functions) {
        this.items = [];
        this.options = [];
        this.service.getProducts().then((results) => this.handleProductResults(results));
    }


    getCategory(id, slug, name) {
        this.items.id = id;
        this.items.slug = slug;
        this.items.name = name;
        this.items.categories = this.service.categories;
        this.nav.push(ShoppingProductPage, this.items);
    }
    getCart() {
        this.nav.push(ShoppingCartPage);
    }
    getSearch() {
        //this.nav.push(SearchPage);
    }
    mySlideOptions = {
        initialSlide: 1,
        loop: true,
        autoplay: 5800,
        pager: false
    }

    handleProductResults(results) {
        this.product = results;
    }

    getId() {
        var i;
        if (this.options.length >= 1)
            var resa = this.options[0].split(":");
        if (this.options.length >= 2)
            var resb = this.options[1].split(":");
        if (this.options.length >= 1)
            for (i = 0; i < this.product.product.variations.length; i++) {
                if (this.product.product.variations[i].attributes[0].option == resa[1]) {
                    if (this.options.length == 1) {
                        break;
                    }
                    else if (this.product.product.variations[i].attributes[1].option == resb[1]) {
                        break;
                    }
                }
        }
    }

    doInfinite(infiniteScroll) {
        this.service.loadMore().then((results) => this.handleMore(results, infiniteScroll));
    }
    handleMore(results, infiniteScroll) {
        if (!results) {
            this.has_more_items = false;
        }
        infiniteScroll.complete();
    }
    getProduct(id) {
        this.nav.push(ShoppingProductPage, id);
    }

    addToWishlist(id){
        if(this.values.isLoggedIn){
        this.values.wishlistId[id] = true;
         this.service.addToWishlist(id)
        .then((results) => this.update(results, id));
        }
        else{
            this.functions.showAlert("에러", "로그인이 필요한 서비스입니다.");
        }
    }

    update(results, id){
        if(results.success == "Success"){
            //this.functions.showAlert(a.success, a.message);
        this.values.wishlistId[id] = true;
        }
        else {

        }
     }

    removeFromWishlist(id){
    this.values.wishlistId[id] = false;
    this.service.deleteItem(id)
    .then((results) => this.updateWish(results, id));
 
    }

    updateWish(results, id){

        if(results.status == "success"){

            this.values.wishlistId[id] = false;
        
        }

    }



}
