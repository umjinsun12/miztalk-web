import { ShoppingProductPage } from './../shopping-product/shopping-product';
import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Service } from '../../services/shopping-services/service';
import { Values } from '../../services/shopping-services/values';

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

    constructor(public nav: NavController, public service: Service, public values: Values) {
        this.items = [];
        this.options = [];
        this.service.getProducts();
        this.service.mainCategories[0].icon = "ios-contact-outline";
        this.service.mainCategories[1].icon = "ios-color-wand-outline";
        this.service.mainCategories[2].icon = "ios-desktop-outline";
        this.service.mainCategories[3].icon = "ios-leaf-outline";
        console.log(this.service.mainCategories);
    }


    getCategory(id, slug, name) {
        this.items.id = id;
        this.items.slug = slug;
        this.items.name = name;
        this.items.categories = this.service.categories;
        this.nav.push(ShoppingProductPage, this.items);
    }
    getCart() {
        //this.nav.push(CartPage);
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
      console.log("adsfsdf");
        this.nav.push(ShoppingProductPage, id);
    }
}
