import { EventDetailPage } from './../event-detail/event-detail';
import { ShoppingProductPage } from './../shopping-product/shopping-product';
import { ShoppingCartPage } from './../shopping-cart/shopping-cart';
import { Functions } from '../../services/shopping-services/functions';
import { Values } from '../../services/shopping-services/values';
import { CategoryService } from '../../services/shopping-services/category-service';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, PopoverController, ViewController, IonicPage, Platform, AlertController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { Content } from 'ionic-angular';
import { Service} from '../../services/shopping-services/service'
import { WishlistPage } from '../account/wishlist/wishlist'
import { PopoverPage } from '../about-popover/about-popover';
import { ShoppingSearchPage } from '../shopping-search/shopping-search';
import { ShoppingProductsPage } from '../shopping-products/shopping-products';
import { ClayfulService } from './../../services/shopping-services/clayful-service';

/**
 * 
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

    @ViewChild("contentRef") contentHandle: Content;
    products: any;
    moreProducts: any;
    count: any;
    offset: any;
    category: any;
    has_more_items: boolean = true;
    listview: boolean = false;
    noProducts: boolean = false;
    status: any;
    options: any;
    pop: any;
    categories: any;
    subCategories: any;
    items: any;
    quantity: any;
    filter: any;
    q: any;
    shouldShowCancel: boolean = true;
    sort: number = 0;
    categoryName: any;
    loading: boolean = false;
    data: any;
    pos: number = 1;
    public alertShown:boolean = false;

    private tabBarHeight;
    private topOrBottom:string;
    private contentBox;
    related: any;

    clayfulProducts: any;

    constructor(public modalCtrl: ModalController, private viewCtrl: ViewController, public nav: NavController, public popoverCtrl: PopoverController, public service: CategoryService, params: NavParams, public values: Values, public functions: Functions, public clayfulService : ClayfulService,
        public homeservice: Service,
        public platform : Platform,
        public alertCtrl: AlertController) {
        this.data = {};
        this.filter = {};
        this.q = "";
        this.filter.page = this.values.product_order[this.pos];
        this.count = 10;
        this.offset = 0;
        this.values.filter = {};
        this.options = [];
        this.subCategories = [];
        this.items = [];
        this.quantity = "1";
        this.categoryName = params.data.name;
        if (params.data.categories) {
            this.categories = params.data.categories;
            for (var i = 0; i < this.categories.length; i++) {
                    this.subCategories.push(this.categories[i]);
            }
        }
        if (params.data.attributeSlug) {
            this.filter.attribute = params.data.attributeSlug;
        }
        if (params.data.attributeId) {
            this.filter.attribute_term = params.data.attributeId;
        }
        this.clayfulService.getProductList(1).subscribe(results => {
            this.clayfulProducts = [];
            results.contents.forEach(element => {
                this.clayfulProducts.push(JSON.parse(element.data));
            });
        });
    }


    ionViewDidEnter(){
        this.contentBox = document.querySelector(".scroll-content")['style'];
        this.tabBarHeight = this.contentBox.marginBottom;
        this.platform.registerBackButtonAction(() => {
          if (this.alertShown==false) {
            this.presentConfirm();
          }
        }, 0)
      }
    
      ionViewWillLeave() {
        this.platform.registerBackButtonAction(() => {
            this.nav.pop();
        });
    }
    
      presentConfirm() {
        let alert = this.alertCtrl.create({
          title: '종료',
          message: '미즈톡을 종료하시겠습니까?',
          buttons: [
            {
              text: '취소',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
                this.alertShown=false;
              }
            },
            {
              text: '확인',
              handler: () => {
                console.log('Yes clicked');
                this.platform.exitApp();
              }
            }
          ]
        });
         alert.present().then(()=>{
          this.alertShown=true;
        });
      }

    handleProducts(results) {
        console.log(results);
        this.shuffle(results);
        this.products = results;
        this.viewCtrl.showBackButton(true);
    }
    getBannerConent(postType:number,postId:number){
        let passData = {name:'', id:0};
        passData.id = postId;
    
        if(postType == 0)
          this.nav.push(ShoppingProductPage, postId);
        else if(postType == 1){
          passData.name = "이벤트";
          this.nav.push(EventDetailPage, passData);
        }
        else if(postType == 4){
          passData.name = "기획전";
          this.nav.push(ShoppingProductsPage, passData);
        }
      }

    getCategory(id, slug, name) {
        this.items.id = id;
        this.items.slug = slug;
        this.items.name = name;
        this.items.categories = this.categories;
        this.nav.push(ShoppingProductPage, this.items);
    }

    shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    parseText(id, count, offset, obj2) {
        var text = '{';
        text += '"category' + '":"' + id + '"}';
        var obj1 = JSON.parse(text);
        var obj3 = {};
        for (var attrname in obj1) {
            obj3[attrname] = obj1[attrname];
        }
        for (attrname in obj2) {
            obj3[attrname] = obj2[attrname];
        }
        return obj3;
    }
    goCategory(id, name){
        let item = {
            id : "",
            name : "",
            categories : []
        };
        item.categories.push(id);
        item.id = id;
        item.name = name;
        this.nav.push(ShoppingProductsPage,item);
    }
    getProducts(id) {
        this.nav.push(ShoppingProductPage, id);
    }
    getProduct(id) {
        this.nav.push(ShoppingProductPage, id);
    }
    getCart() {
        this.values.hideTabbar = false;
        this.nav.push(ShoppingCartPage);
    }
    getSearch() {
        this.nav.push(ShoppingSearchPage);
    }

    doInfinite(infiniteScroll) {
        this.pos += 1;
        this.filter.page = this.values.product_order[this.pos];
        this.clayfulService.getProductList(this.pos).subscribe(results => {
            if(results.contents.length == 0)
                this.has_more_items = false;
            else{
                results.contents.forEach(element => {
                    this.clayfulProducts.push(JSON.parse(element.data));
                });
                infiniteScroll.complete();
            }
        });
    }
    handleMore(results, infiniteScroll) {
        if (results != undefined) {
            this.shuffle(results);
            for (var i = 0; i < results.length; i++) {
                this.products.push(results[i]);
            };
        }
        if (results.length == 0) {
            this.has_more_items = false;
        }
        infiniteScroll.complete();
    }g

    doRefresh(refresher){
        this.has_more_items = true;
        this.pos = 1;
        this.clayfulService.getProductList(1).subscribe(results => {
            this.clayfulProducts = [];
            results.contents.forEach(element => {
                this.clayfulProducts.push(JSON.parse(element.data));
            });        
            refresher.complete();
        });
    }

    setListView() {
        this.values.listview = true;
    }
    setGridView() {
        this.values.listview = false;
    }
    deleteFromCart(id) {
        this.service.deleteFromCart(id).then((results) => this.status = results);
    }
    updateToCart(id) {
        this.service.updateToCart(id).then((results) => this.status = results);
    }
    addToCart(id, type) {
        if (type == 'variable') {
            this.nav.push(ShoppingProductPage, id);
        } else {
            var text = '{';
            var i;
            for (i = 0; i < this.options.length; i++) {
                var res = this.options[i].split(":");
                text += '"' + res[0] + '":"' + res[1] + '",';
            }
            text += '"product_id":"' + id + '",';
            text += '"quantity":"' + this.quantity + '"}';
            var obj = JSON.parse(text);
            this.service.addToCart(obj).then((results) => this.updateCart(results));
        }
    }
    updateCart(result) {
        console.log(result);
    }
    onInput($event) {
        this.loading = true;
        this.filter = "";
        this.filter = {};
        this.filter.page = 1;
        this.filter.search = $event.srcElement.value;
        //this.filter.order = "DESC";
        this.service.search(this.filter).then((results) => this.handleSearchResults(results));
    }
    handleSearchResults(results) {
        this.loading = false;
        this.products = results;
    }
    onCancel($event) {
        console.log('cancelled');
    }
    addToWishlist(id) {
        if (this.values.isLoggedIn) {
            this.values.wishlistId[id] = true;
            this.service.addToWishlist(id).then((results) => this.update(results, id));
        } else {
            this.functions.showAlert("에러", "마이페이지에서 로그인을 먼저 해주세요.");
        }
    }
    update(results, id) {
        if (results.success == "Success") {
            this.values.wishlistId[id] = true;
        } else {}
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
    getWishlist() {
        this.nav.push(WishlistPage);
    }
    getFilter() {
        console.log("Filter");
    }
    handleFilterResults(results) {
        this.products = results;
    }
    getSort() {
        /*let modal = this.modalCtrl.create(Sort, this.filter);
        modal.onDidDismiss(data => {
            if (this.values.applyFilter) {
                this.filter = this.values.filter;
                this.has_more_items = true;
                this.filter.page = 1;
                this.filter.opts = undefined;
                this.filter.component = undefined;
                this.service.load(this.filter).then((results) => this.handleFilterResults(results));
            }
        });
        modal.present();*/
        console.log("Sort");
    }
    scrollingFun(e) {
        if (e.scrollTop > this.contentHandle.getContentDimensions().contentHeight) {
            if (document.querySelector(".tabbar")) document.querySelector(".tabbar")['style'].display = 'flex';
            if (this.topOrBottom == "top") {
                this.contentBox.marginTop = 0;
            } else if (this.topOrBottom == "bottom") {
                this.contentBox.marginBottom = 0;
            }
        } else {
            if (document.querySelector(".tabbar")) document.querySelector(".tabbar")['style'].display = 'flex';
            if (this.topOrBottom == "top") {
                this.contentBox.marginTop = this.tabBarHeight;
            } else if (this.topOrBottom == "bottom") {
                this.contentBox.marginBottom = this.tabBarHeight;
            }
        } //if else
    }
    
    ionViewDidLeave() {
        this.related = "";
    }
    presentPopover(event: Event) {
        let popover = this.popoverCtrl.create(PopoverPage);
        popover.present({
            ev: event
        });
        console.log("popover");
    }



}
