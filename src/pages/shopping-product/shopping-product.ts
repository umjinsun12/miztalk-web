import { Functions } from '../../services/shopping-services/functions';
import { Values } from '../../services/shopping-services/values';
import { ProductService } from '../../services/shopping-services/product-service';
import { Component, ViewChild } from '@angular/core';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { md5 } from './md5';
import {
  NavController,
  NavParams,
  FabContainer,
  LoadingController,
  PopoverController,
  ViewController,
  ToastController,
  IonicPage
} from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { PopoverPage} from '../about-popover/about-popover'
import { SocialSharing } from '@ionic-native/social-sharing';
import { DomSanitizer } from '@angular/platform-browser';
import { WordpressService } from '../../services/wordpress.service';
import { CmsService } from '../../services/cms-service.service';
import * as moment from 'moment';
import { ImagePicker } from '@ionic-native/image-picker';
import { ClayfulService } from './../../services/shopping-services/clayful-service';
import { ShoppingCartPage } from './../shopping-cart/shopping-cart';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Config } from '../../services/shopping-services/config';
import { stringify } from '@angular/compiler/src/util';

@IonicPage({
  name: 'shopping-product',
  segment: 'shop/:id',
  defaultHistory : ['page-shopping']
})
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
    reviews: any = [];
    shipping: any;
    
    seletedOption: any;
    selectOptionProduct: any = [];
    showOption: boolean = false;
    totalOptionPrice: number = 0;


    enableCart: boolean;
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
    disableSubmit : boolean = false;
    clayfulProduct : any;

    fileimgs : any = [];


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
        public sanitizer : DomSanitizer, 
        public wordpressService: WordpressService,
        public cmsService: CmsService,
        private camera: Camera,
        public toastCtrl: ToastController,
        public config: Config,
        public clayfulService : ClayfulService) {
        this.id = params.data;
        this.options = [];
        this.quantity = 1;
        this.form.rating = 5;
        this.AddToCart = "Add To Cart";
        if(document.querySelector(".tabbar"))
        this.tabBarElement = document.querySelector(".tabbar")['style'];
        
        this.clayfulService.getProduct(this.id).subscribe(results => {            
            this.clayfulProduct = JSON.parse(results.data);
            console.log(this.clayfulProduct);
            if(this.clayfulProduct.options.length == 0){
                var obj = this.clayfulProduct.variants[0];
                obj.quantity = 1;
                this.selectOptionProduct.push(obj);
                this.calculateTotal();
            }
        })
    }

    getVariationProducts() {
        this.service.getVariationProducts(this.product.id).then((results) => {
          console.log(this.variations);
            this.variations = results
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
    addCart(id) {
        if(this.showOption == true){
            if (this.selectOptionProduct.length == 0) {
                this.functions.showAlert('에러', '옵션을 선택하세요')
            }
            else{
                if(this.values.isLoggedIn){
                    for(let product of this.selectOptionProduct){
                        this.clayfulService.addCartLogin(this.clayfulProduct._id, product._id, product.quantity, this.clayfulProduct.shipping.methods[0]._id)
                        .then(result => {
                            console.log(result);
                            this.functions.showAlert('알림','상품이 장바구니에 추가되었습니다.');
                        });
                        this.values.count +=1;
                    }
                }else{
                    for(let product of this.selectOptionProduct){
                        this.clayfulService.addCartNonLogin(this.clayfulProduct._id,product._id, product.quantity, this.clayfulProduct.shipping.methods[0]._id);
                        this.values.count +=1;
                    }
                    this.functions.showAlert('알림', '상품이 장바구니에 추가되었습니다.');
                }
            }
        }
        else{
            this.disableAddButton = true;
        }
    }


    buyNow(id) {
        if(this.showOption == true){
            if (this.selectOptionProduct.length == 0) {
                this.functions.showAlert('에러', '옵션을 선택하세요')
            }
            else {
                if(this.values.isLoggedIn){
                    for(let product of this.selectOptionProduct){
                        this.clayfulService.addCartLogin(this.clayfulProduct._id, product._id, product.quantity, this.clayfulProduct.shipping.methods[0]._id)
                        .then(result => {
                            this.nav.push(ShoppingCartPage);
                        });
                        this.values.count +=1;
                    }
                }else{
                    for(let product of this.selectOptionProduct){
                        this.clayfulService.addCartNonLogin(this.clayfulProduct._id,product._id, product.quantity, this.clayfulProduct.shipping.methods[0]._id);
                        this.values.count += 1;
                    }
                    this.nav.push(ShoppingCartPage);
                }
            }
        }
        else{
            this.showOption = true;
        }
    }
    removeItem(id){
        for(var i= 0 ; i < this.selectOptionProduct.length ; i++){
            if(this.selectOptionProduct[i]._id == id){
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
        for(var i= 0 ; i < this.clayfulProduct.variants.length ; i++){
            if(this.clayfulProduct.variants[i]._id == this.options){
                var flag = 0;
                for(var j = 0 ; j < this.selectOptionProduct.length ; j++){
                    if(this.selectOptionProduct[j]._id == this.options)
                        flag = 1;
                }
                if(!flag){
                    var obj = this.clayfulProduct.variants[i];
                    obj.quantity = 1;
                    this.selectOptionProduct.push(obj);
                }
                break;
            }
        }
        this.options[0] = [];
        this.calculateTotal();
    }

    deleteOptionQuantity(id){
        for(var i= 0 ; i < this.selectOptionProduct.length ; i++){
            if(this.selectOptionProduct[i]._id == id){
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
            if(this.selectOptionProduct[i]._id == id){
                this.selectOptionProduct[i].quantity = parseInt(this.selectOptionProduct[i].quantity) + 1;
                this.calculateTotal();
            }
        }
    }

    calculateTotal(){
        this.totalOptionPrice = 0;
        for(var i= 0 ; i < this.selectOptionProduct.length ; i++){
            this.totalOptionPrice += parseInt(this.selectOptionProduct[i].price.sale.raw) * parseInt(this.selectOptionProduct[i].quantity);
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
        this.cmsService.getReviews(1 , this.clayfulProduct._id ).subscribe((results) =>this.handleReviewList(results));
    }

    handleReviewList(results){
        for(let comment of results.contents){
            comment.date = moment(comment.date).fromNow();
            if(this.values.customerName == comment.writer)
                comment.isMine = true;
            else
                comment.isMine = false;
            for(var i= 0 ; i < comment.image.length ; i++){
                comment.image[i] = this.config.cmsurl + '/posts/image/' + comment.image[i].split(':')[0];
            }
            this.reviews.push(comment);
        }
    }

    removeComment(id){
        this.cmsService.removePost(id).then(result => {
            this.reviews = [];
            this.getReviews();
            this.functions.showAlert('성공', '리뷰가 삭제되었습니다.');
        });
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
            //this.service.addToWishlist(id).then((results) => this.update(results));
          this.clayfulService.addWishList(id);
        } else {
            this.functions.showAlert("에러", "마이페이지에서 로그인을 먼저 해주세요.");
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
        this.clayfulService.deleteWishList(id);
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


    share(product_id) {
      console.log(product_id);
      this.functions.showAlert("알림", "링크가 복사 되었습니다.");
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
    submitComment() {
        this.form.id = this.id;
        if (this.validate()) {
            this.buttonSubmitLogin = true;
            let fileblobs = []
            for(let file of this.fileimgs){
                fileblobs.push(this.cmsService.dataURItoBlob(file));
            }
            
            this.cmsService.createReview(this.product.id , this.form.rating, this.form.comment, this.values.token, fileblobs).then(data => {
                console.log(data);
                this.buttonSubmitLogin = false;
                this.form.comment = '';
                this.fileimgs = [];
                this.showAddReview = false;
                this.reviews = [];
                this.getReviews();
                this.functions.showAlert("성공", "리뷰를 등록해주셔서 감사합니다.!");
            });
        }
    }

    getImage() {
        const options: CameraOptions = {
          quality: 40,
          destinationType: this.camera.DestinationType.DATA_URL,
          sourceType:this.camera.PictureSourceType.PHOTOLIBRARY
        }
    
        if(this.fileimgs.length >= 3){
          this.functions.showAlert('에러', '이미지는 최대 3장 업로드 가능합니다.')
        }
        else{
          this.camera.getPicture(options).then((imageData) => {
            this.fileimgs.push('data:image/jpeg;base64,' + imageData);
          }, (err) => {
            console.log(err);
            this.presentToast(err);
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
        if(!this.values.isLoggedIn)
            this.functions.showAlert('에러', '마이페이지에서 로그인을 먼저 해주세요.');
        else if (this.showAddReview) this.showAddReview = false;
        else this.showAddReview = true;
    }

    presentToast(msg) {
        let toast = this.toastCtrl.create({
          message: msg,
          duration: 3000,
          position: 'bottom'
        });
      
        toast.onDidDismiss(() => {
          console.log('Dismissed toast');
        });
      
        toast.present();
      }
      
}
