import { Functions } from './../../services/shopping-services/functions';
import { Values } from './../../services/shopping-services/values';
import { ProductService } from './../../services/shopping-services/product-service';
import { Component, ViewChild } from '@angular/core';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { md5 } from './md5';
import { NavController, NavParams, FabContainer, LoadingController, PopoverController, ViewController} from 'ionic-angular';
import { ShoppingCartPage } from '../shopping-cart/shopping-cart';
import { ModalController } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { PopoverPage} from '../about-popover/about-popover'
import { SocialSharing } from '@ionic-native/social-sharing';
import { DomSanitizer } from '@angular/platform-browser';
import { WordpressService } from '../../services/wordpress.service';
import { CmsService } from '../../services/cms-service.service';
//import { Caimport { ModalController } from 'ionic-angular';rtPage } from '../cart/cart';


@Component({
  templateUrl: 'shopping-product.html',
})
export class ShoppingProductPage {
    @ViewChild(Slides) slides: Slides;
    product: any;
    id: any;
    status: any;
    options: any;
    opt: any;
    message: any;
    wishlist: any;
    quantity: any;
    reviews: any;
    shipping: any;
    
    seletedOption: any;
    selectOptionProduct: any = [];
    showOption: boolean = false;
    totalOptionPrice: number = 0;

    reviewForm: any;
    nickname: any;
    details: any;
    AddToCart: any;
    wishlistIcon: boolean = false;
    showSpecification: boolean = false;
    moreDescription: boolean = true;
    related: any;
    crossSell: any;
    upsell:any;
    items: any;
    disableBuyNow: boolean = false;
    disableAddButton: boolean = false;
    tabBarElement: any;
    showOverview: boolean = true;
    showRelated : boolean = false;
    showReviews : boolean = false;
    showShipping : boolean = false;
    segment = 'overview';
    form: any = {};
    buttonSubmitLogin: boolean = false;
    showAddReview:  boolean = false;
    count: any;
    count5: number = 0;
    count4: number = 0;
    count3: number = 0;
    count2: number = 0;
    count1: number = 0;
    count5Percentage: string = '0' + '%';
    count4Percentage: string = '0' + '%';
    count3Percentage: string = '0' + '%';
    count2Percentage: string = '0' + '%';
    count1Percentage: string = '0' + '%';
    variations: any;
    isNecessary: boolean = false;
    necessaryCnt: number = 0;
    necessaryList : any = [];
    reviewList : any = [];


    constructor(
        public viewCtrl: ViewController, 
        private photoViewer: PhotoViewer, 
        public popoverCtrl: PopoverController, 
        public nav: NavController, 
        public service: ProductService, 
        params: NavParams, 
        public functions: Functions, 
        public values: Values, 
        private socialSharing: SocialSharing, 
        public loadingCtrl: LoadingController, 
        public modalCtrl: ModalController, 
        public dom : DomSanitizer, 
        public wordpressService: WordpressService,
        public cmsService: CmsService) {
        this.id = params.data;
        this.options = [];
        this.quantity = 1;
        this.AddToCart = "Add To Cart";
        if(document.querySelector(".tabbar"))
        this.tabBarElement = document.querySelector(".tabbar")['style'];
        this.service.getProduct(this.id)
            .then((results) => this.handleProductResults(results));
        this.cmsService.getReviews(1 ,this.id)
            .subscribe((results) =>this.handleReviewList(results));
    }

    handleReviewList(results){

    }

    handleProductResults(results) {
        this.product = results;
        this.necessaryCnt = 0;
        this.isNecessary = false;
        console.log(this.product);
        this.product.description = this.product.description.replace(/<p>/g,'').replace(/<\/p>/g, '').replace(/&nbsp;/g,'');
        this.product.description = this.dom.bypassSecurityTrustHtml(this.product.description);
        console.log(this.product.description);
        if ((this.product.type == 'variable') && this.product.variations.length) 
            this.getVariationProducts();
        else{
            var text = '{';
                var i;
                for (i = 0; i < this.options.length; i++) {
                    var res = this.options[i].split(":");
                    for (var j = 0; j < res.length; j = j + 2) {
                        text += '"' + res[j] + '":"' + res[j + 1] + '",';
                    }
                }
                text += '"product_id":"' + this.product.id + '",';
                text += '"quantity":"' + this.quantity + '"}';
                var obj = JSON.parse(text);
                console.log(this.product);
                console.log(obj);
                obj.price = this.product.sale_price;
                obj.name = this.product.name;
                this.selectOptionProduct.push(obj);
                this.totalOptionPrice=this.product.sale_price;
        }
        this.getReviews();
        this.getRelatedProducts();
        this.getUpsellProducts();
        this.getCrossSellProducts();
        
        console.log(this.options[0]);
    }
    getVariationProducts() {
        this.service.getVariationProducts(this.product.id).then((results) => {
            this.variations = results
            console.log(this.variations);
        });
    }
    getProduct(id) {
        this.nav.push(ShoppingProductPage, id);
    }
    addToCart(id) {
        if (this.product.type == 'variable' && this.options.length == 0) {
            this.functions.showAlert('에러', '옵션을 선택하세요')
        } else {
            this.disableAddButton = true;
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
            console.log(this.product);
            this.service.addToCart(obj).then((results) => this.updateCart());
        }
    }
    buyNow(id) {
        if(this.showOption == true){
            if (this.product.type == 'variable' && this.options.length == 0) {
                this.functions.showAlert('에러', '옵션을 선택하세요')
            } 
            else if(!this.isNecessary && this.product.attributes.length >= 2){
                this.functions.showAlert('에러', '필수 옵션을 모두 선택하세요')
            }
            else {
                var cnt = 0;
                for(var i= 0 ; i < this.selectOptionProduct.length ; i++){
                    this.service.addToCart(this.selectOptionProduct[i]).then((results) => {
                        cnt += 1;
                        if(cnt == this.selectOptionProduct.length)
                            this.updateBuynowResults(cnt);
                    })
                }
            }
        }
        else{
            this.showOption = true;
        }
    }
    removeItem(id){
        for(var i= 0 ; i < this.selectOptionProduct.length ; i++){
            if(this.selectOptionProduct[i].variation_id == id){
                this.selectOptionProduct.splice(i, 1);
                this.calculateTotal();
            }
        }
    }
    changeProduct() {
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
        for (let item in this.variations) {
            if (this.variations[item].id == obj.variation_id) {
                this.product.in_stock = this.variations[item].in_stock;
                this.product.price = this.variations[item].price;
            }
        }
    }

    chooseOption(){
        var text = '{';
        var i;
        for (i = 0; i < this.options.length; i++) {
                var res = this.options[i].split(":");
                for (var j = 0; j < res.length; j = j + 2) {
                    text += '"' + res[j] + '":"' + res[j + 1] + '",';
                }
        }
        text += '"product_id":"' + this.product.id + '",';
        text += '"quantity":"' + this.quantity + '"}';
        var obj = JSON.parse(text);
        var flag = 0;
        for(i=0 ; i < this.selectOptionProduct.length ; i++)
        {
            if(obj.variation_id === this.selectOptionProduct[i].variation_id)
                flag = 1;
        }
        for (let item in this.variations) {
            if (this.variations[item].id == obj.variation_id) {
                this.product.in_stock = this.variations[item].in_stock;
                this.product.price = this.variations[item].price;
                if(flag == 0){
                    obj.price = this.variations[item].price;
                    obj.name = this.variations[item].attributes[0].option;
                    this.totalOptionPrice += parseInt(obj.price);
                    this.selectOptionProduct.push(obj);
                }
            }
        }
        console.log(this.selectOptionProduct);
        if(this.product.attributes.length < 2)
            this.options[0] = [];
        else{
            console.log(this.options);
            if(this.product.attributes.length == this.options.length){
                this.isNecessary = true;
            }
        }
    }

    deleteOptionQuantity(id){
        for(var i= 0 ; i < this.selectOptionProduct.length ; i++){
            if(this.selectOptionProduct[i].variation_id == id){
                if(this.selectOptionProduct[i].quantity == 1)
                    this.selectOptionProduct[i].quantity = 1;
                else{
                    this.selectOptionProduct[i].quantity = parseInt(this.selectOptionProduct[i].quantity) - 1;
                    this.calculateTotal();
                }
            }
        }
    }

    kakaoqna(){
        window.open('http://pf.kakao.com/_eiieC', '_system', 'location=no');
    }
    addOptionQuantity(id){
        for(var i= 0 ; i < this.selectOptionProduct.length ; i++){
            if(this.selectOptionProduct[i].variation_id == id){
                this.selectOptionProduct[i].quantity = parseInt(this.selectOptionProduct[i].quantity) + 1;
                this.calculateTotal();
            }
        }
    }

    calculateTotal(){
        this.totalOptionPrice = 0;
        for(var i= 0 ; i < this.selectOptionProduct.length ; i++){
            this.totalOptionPrice += parseInt(this.selectOptionProduct[i].price) * parseInt(this.selectOptionProduct[i].quantity);
        } 
    }

    closeOption(){
        this.showOption = false;
    }


    addQuantity(){
        this.quantity = this.quantity + 1;
    }
    deleteQuantity(){
        if(this.quantity == 1)
            this.quantity = 1;
        else
            this.quantity = this.quantity - 1;
    }


    updateBuynowResults(a) {
        this.disableBuyNow = false;
        this.nav.push(ShoppingCartPage);
    }
    updateCart() {
        this.disableAddButton = false;
        this.AddToCart = "Add To Cart";
    }
    getCart() {
        this.values.hideTabbar = true;
        this.nav.push(ShoppingCartPage);
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
        this.count = this.product.rating_count;
        for (let item in this.reviews) {
            this.reviews[item].avatar = md5(this.reviews[item].email);
        }
        this.reviews.forEach(review => {
            if (review.rating == 5) {
                this.count5 = this.count5 + 1;
            }
            if (review.rating == 4) {
                this.count4 = this.count4 + 1;
            }
            if (review.rating == 3) {
                this.count3 = this.count3 + 1;
            }
            if (review.rating == 2) {
                this.count2 = this.count2 + 1;
            }
            if (review.rating == 1) {
                this.count1 = this.count1 + 1;
            }
        });
        this.count5Percentage = ((this.count5 / this.count) * 100) + '%';
        this.count4Percentage = ((this.count4 / this.count) * 100) + '%';
        this.count3Percentage = ((this.count3 / this.count) * 100) + '%';
        this.count2Percentage = this.count2 + '%';
        this.count1Percentage = this.count1 + '%';
    }
    addToWishlist(id) {
        if (this.values.isLoggedIn) {
            this.values.wishlistId[id] = true;
            this.service.addToWishlist(id).then((results) => this.update(results));
        } else {
            this.functions.showAlert("Warning", "You must login to add product to wishlist");
        }
    }
    update(a) {
        if (a.success == "Success") {
            this.values.wishlistId[this.product.id] = true;
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
    showSpecs() {
        if (this.showSpecification) {
            this.showSpecification = false;
        } else {
            this.showSpecification = true;
        }
    }
    showMore() {
        this.moreDescription = true;
    }
    showLess() {
        this.moreDescription = false;
    }
    getRelatedProducts() {
        if (this.product.related_ids != 0) {
            this.service.getRelatedProducts(this.product.related_ids).then((results) => this.related = results);
        }
    }
    getRelatedProduct(id) {
        this.nav.push(ShoppingProductPage, id);
    }
    getUpsellProducts() {
        if (this.product.upsell_ids != 0) {
            this.service.getRelatedProducts(this.product.upsell_ids).then((results) => this.upsell = results);
        }
    }
    getCrossSellProducts() {
        if (this.product.cross_sell_ids != 0) {
            this.service.getRelatedProducts(this.product.cross_sell_ids).then((results) => this.crossSell = results);
        }
    }
    share(product, network: string, fab: FabContainer) {
        var options = {
            message: 'Hey check this product', // not supported on some apps (Facebook, Instagram)
            subject: product.title, // fi. for email
            files: ['', ''], // an array of filenames either locally or remotely
            url: product.permalink,
            chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
        }
        let loading = this.loadingCtrl.create({
            content: `Posting to ${network}`,
            duration: (Math.random() * 1000) + 500
        });
        loading.onWillDismiss(() => {
            fab.close();
        });
        loading.present();
        this.socialSharing.shareWithOptions(options);
    }
    showMoreReviews() {
        this.showRelated = false;
        this.showOverview = false;
        this.showReviews = true;
        this.segment = 'reviews';
    }
    viewPhoto(index) {
        this.slides.slideTo(index + 1, 500);
    }
    zoomPhoto(src) {
        this.photoViewer.show(src, this.product.name);
    }
    presentPopover(event: Event) {
        let popover = this.popoverCtrl.create(PopoverPage);
        popover.present({
            ev: event
        });
    }
    ionViewDidLoad() {
        if (document.querySelector(".tabbar")) this.tabBarElement.display = 'none';
    }
    ionViewWillLeave() {
        if (document.querySelector(".tabbar")) this.tabBarElement.display = 'flex';
    }
    similar() {
        this.showRelated = true;
        this.showOverview = false;
        this.showShipping = false;
        this.showReviews = false;
        this.segment = 'related';
    }
    updateSchedule(event) {
        if (event._value == 'overview') {
            this.showOverview = true;
            this.showRelated = false;
            this.showShipping = false;
            this.showReviews = false;
        } else if (event._value == 'related') {
            this.showOverview = false;
            this.showRelated = true;
            this.showShipping = false;
            this.showReviews = false;
        } else if (event._value == 'reviews') {
            this.showOverview = false;
            this.showRelated = false;
            this.showShipping = false;
            this.showReviews = true;
        } else if (event._value == 'shipping') {
            this.showOverview = false;
            this.showRelated = false;
            this.showShipping = true;
            this.showReviews = false;
        }
    }
    yourRating(rating) {
        this.form.rating = rating;
    }
    submitComment(files) {
        this.form.id = this.id;
        if (this.validate()) {
            this.buttonSubmitLogin = true;

            this.cmsService.createReview(this.product.id, this.form.comment, this.values.token, files).then(data => {
                console.log(data);
                this.buttonSubmitLogin = false;
                this.functions.showAlert("성공", "리뷰를 등록해주셔서 감사합니다.! 리뷰는 승인 후에 게시됩니다.");
            });
            this.service.submitComment(this.form).then((results) => {
                this.status = results;
                this.buttonSubmitLogin = false;
                console.log(this.status);
                this.functions.showAlert("성공", "리뷰를 등록해주셔서 감사합니다.! 리뷰는 승인 후에 게시됩니다.");
            });
        }
    }
    validate() {
        if (!this.values.isLoggedIn) {
            if (this.form.author == undefined || this.form.author == "") {
                this.functions.showAlert("에러", "이름을 입력해 주세요");
                return false
            }
            if (this.form.email == undefined || this.form.email == "") {
                this.functions.showAlert("에러", "이메일을 입력해 주세요");
                return false
            }
        }
        if (this.form.comment == undefined || this.form.comment == "") {
            this.functions.showAlert("에러", "댓글을 입력해 주세요");
            return false
        } else return true;
    }
    showSubmitReview() {
        if (this.showAddReview) this.showAddReview = false;
        else this.showAddReview = true;
    }
}
