import { Functions } from './../../services/shopping-services/functions';
import { Values } from './../../services/shopping-services/values';
import { ProductService } from './../../services/shopping-services/product-service';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, Slides } from 'ionic-angular';
import { ShoppingCartPage } from '../shopping-cart/shopping-cart';
//import { CartPage } from '../cart/cart';


@Component({
  templateUrl: 'shopping-product.html',
})
export class ShoppingProductPage {
  @ViewChild(Content) content: Content;
    product: any;
    id: any;
    status: any;
    options: any;
    opt: any;
    message: any;
    wishlist: any;
    quantity: any;
    reviews: any;
    reviewForm: any;
    nickname: any;
    details: any;
    AddToCart: any;
    disableSubmit: boolean = false;
    wishlistIcon: boolean = false;

    selectedSegment: string;

    @ViewChild('mySlider') slider: Slides;
    slides: any;
    activeIndex: string;
    myIndex : any;

    constructor(
      public nav: NavController, 
      public service: ProductService, 
      params: NavParams, 
      public functions: Functions, 
      public values: Values) {
      
        this.myIndex = params.data.tabIndex || 0;
        this.selectedSegment = 'info';
        this.slides = [
            {
              id: "info",
              title: "상품정보"
            },
            {
              id: "review",
              title: "상품후기"
            }
        ]

        console.log(values);
        this.id = params.data;
        this.options = [];
        this.quantity = "1";
        this.AddToCart = "AddToCart";
        this.service.getProduct(this.id)
            .then((results) => this.handleProductResults(results));
        this.getReviews();
        
    }
    handleProductResults(results) {
        this.product = results;
        console.log(results);
    }
    getProduct(id) {
        this.nav.push(ShoppingProductPage, id);
    }
    addToCart(id) {
        if (this.product.product.type == 'variable' && this.options.length == 0) {
            this.functions.showAlert('Eroor', 'Please Select Product Option...')
        } else {
            this.disableSubmit = true;
            // this.AddToCart = "Adding to cart...";
            var text = '{';
            var i;
            for (i = 0; i < this.options.length; i++) {
                var res = this.options[i].split(":");
                for (var j = 0; j < res.length; j = j + 2) {
                    text += '"' + res[j] + '":"' + res[j + 1] + '",';
                }
            }
            text += '"product_id":"' + id + '",';
            text += '"quantity":"' + this.quantity + '"}';
            var obj = JSON.parse(text);
            this.service.addToCart(obj).then((results) => this.updateCart(results));
        }
    }
    chnageProduct() {
        var text = '{';
        var i;
        for (i = 0; i < this.options.length; i++) {
            var res = this.options[i].split(":");
            for (var j = 0; j < res.length; j = j + 2) {
                text += '"' + res[j] + '":"' + res[j + 1] + '",';
            }
        }
        text += '"quantity":"' + this.quantity + '"}';
        var obj = JSON.parse(text);
        for (let item in this.product.product.variations) {
            if (this.product.product.variations[item].id == obj.variation_id) {
                this.product.product.in_stock = this.product.product.variations[item].in_stock;
                this.product.product.price = this.product.product.variations[item].price;
            }
        }
    }
    updateCart(a) {
        this.disableSubmit = false;
        this.values.count += parseInt(this.quantity);
        this.AddToCart = "AddToCart";
    }
    getCart() {
        this.nav.push(ShoppingCartPage);
    }
    buyNow(id) {
        var text = '{';
        var i;
        for (i = 0; i < this.options.length; i++) {
            var res = this.options[i].split(":");
            text += '"' + res[0] + '":"' + res[1] + '",';
        }
        text += '"product":"' + id + '",';
        text += '"qty":"' + this.quantity + '"}';
        var obj = JSON.parse(text);
        this.nav.push(ShoppingCartPage, obj);
    }
    mySlideOptions = {
        initialSlide: 1,
        loop: true,
        autoplay: 5800,
        pager: true
    }
    getReviews() {
        this.service.getReviews(this.id).then((results) => this.handleReview(results));
    }
    handleReview(a) {
        this.reviews = a;
        for (let item in this.reviews.product_reviews) {
            this.reviews.product_reviews[item].avatar = this.reviews.product_reviews[item].reviewer_email;
            console.log(this.reviews.product_reviews[item].avatar);
        }
    }
    addToWishlist(id) {
        if (this.values.isLoggedIn) {
            this.service.addToWishlist(id).then((results) => this.update(results));
        } else {
            this.functions.showAlert("Warning", "You must login to add product to wishlist");
        }
    }
    update(a) {
        if (a.success == "Success") {
            //this.functions.showAlert(a.success, a.message);
            this.values.wishlistId[this.product.product.id] = true;
        } else {
            this.functions.showAlert("error", "error");
        }
    }
    removeFromWishlist(id) {
        this.values.wishlistId[id] = false;
        this.service.deleteItem(id).then((results) => this.updateWish(results, id));
    }
    updateWish(results, id) {
        if (results.status == "success") {
            this.values.wishlistId[id] = false;
        }
    }

    onSlideChanged(slider) {
        console.log('Slide changed');
        console.log(slider.getActiveIndex());
        this.activeIndex = slider.getActiveIndex();
        if(slider.getActiveIndex()>=4)
          return;
        
        const currentSlide = this.slides[slider.getActiveIndex()];
        this.selectedSegment = currentSlide.id;
    }

    onSegmentChanged(segmentButton) {
        console.log("Segment changed to", segmentButton.value);
        const selectedIndex = this.slides.findIndex((slide) => {
          if(slide.id === segmentButton.value){
            return slide.id === segmentButton.value;
          }
        });
        this.activeIndex = selectedIndex;
        //this.slider.slideTo(selectedIndex);
    }

}
