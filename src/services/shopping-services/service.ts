import { ClayfulService } from './clayful-service';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { Config } from './config';
import { Values } from './values';
import { URLSearchParams } from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage';
import { AuthenticationService } from '../authentication.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';
import { CmsService } from '../cms-service.service';
import { HTTP } from '@ionic-native/http';

var headers = new Headers();
headers.append('Content-Type', 'application/x-www-form-urlencoded');

@Injectable() 
export class Service {
    data: any;
    url: any;
    categories: any;
    banners: any;
    orders: any;
    order: any;
    isloggedIn: any;
    status: any;
    address: any;
    products: any;
    product: any;
    cart: any;
    configuration: any;
    loader: any;
    loginStatus: any;
    mainCategories: any;
    country: any;
    user: any;
    login_nonce: any;
    dir: any = 'left';
    googleResponse: any;
    filter: any = {};
    featuredProduct: any;
    bestOffers: any;
    trending: any;
    deals : any;
    jusoResponse: any;
    headers: any;


    communityCategories: any;
    postoptions: any = {};


    constructor(private reqhttp: HTTP,private http: Http, private config: Config, private values: Values, public loadingCtrl: LoadingController, private nativeStorage: NativeStorage, private cmsService: CmsService, public storage: Storage, public clayfulService : ClayfulService) {
        this.mainCategories = [];
        this.filter.page = 1;
        this.deals = {};
    }
    load() {
        return new Promise(resolve => {
            this.http.get(this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-keys', this.config.options).map(res => res.json()).subscribe(data => {
                console.log(data);
                this.values.data = data;
                this.login_nonce = data.login_nonce;
                this.banners = data.banners;
                this.values.max_price = data.max_price;
                this.values.price.upper = data.max_price;
                if (data.user.data != undefined) {
                    this.values.isLoggedIn = data.user.data.status;
                    this.values.customerId = data.user.data.ID;
                    this.values.customerName = data.user.data.display_name;
                    this.values.avatar = data.user.avatar_url;
                    this.values.user_login = data.user.data.user_login;
                    this.values.user_pass = data.user.data.user_pass;
                    this.values.token = data.jwt.token;

                    this.nativeStorage.getItem('loginData').then(data => {
                        if (data.type == 'social') {
                            this.values.customerName = data.displayName;
                            this.values.avatar = data.avatar;
                        }
                    }, error => console.error(error));
                } else {
                    this.nativeStorage.getItem('loginData').then(data => {
                        if (data.type == 'woo') {
                            this.values.avatar = data.avatar;
                            this.login(data);
                        } else if (data.type == 'social') {
                            this.values.customerName = data.displayName;
                            this.values.avatar = data.avatar;
                            this.socialLogin(data.username);
                        }
                    }, error => console.error(error));
                }
                this.http.get(this.config.setUrl('GET', '/wp-json/wc/v2/products/categories?', {per_page : 100}), {}).map(res => res.json()).subscribe(data => {
                    this.categories = data;
                   this.mainCategories = [];
                   for (var i = 0; i < this.categories.length; i++) {
                       if (this.categories[i].parent == '0') {
                           this.mainCategories.push(this.categories[i]);
                       }
                   }
                    this.nativeStorage.getItem('loginData').then(data => this.login(data), error => console.error(error));
                    this.http.get(this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-cart', this.config.options).map(res => res.json()).subscribe(data => {
                        this.cart = data;
                        this.values.updateCart(this.cart);
                    });
                    resolve(this.categories);
                });



                this.http.get(this.config.setUrl('GET', '/wp-json/wp/v2/categories?', false), this.config.options).map(res => res.json())
                        .subscribe(data => {
                            this.communityCategories = data;
                        });

                    console.log(this.config);

                this.http.get(this.config.WORDPRESS_REST_API_URL + '/posts/1746', this.config.options).map(res=> res.json())
                        .subscribe(data => {
                            var regExp = /<img[^>]*src=[\"']?([^>\"']+)[\"']?[^>]*>/g, match;
                            var parsesrc = [];
                            while (match = regExp.exec(data.content.rendered))
                                parsesrc.push(match[1]);
                            var mainlink = data.content.rendered.match('{{[^>]*}}');
                            var parselink = mainlink[0].replace('{{','').replace('}}','').split('|');
                            this.values.maincard = [];
                            for(var i=0 ; i < parsesrc.length ; i++){
                                var parselink_type = parselink[i].split(':');
                                var parse = {
                                    src : parsesrc[i],
                                    type : parselink_type[0],
                                    link : parselink_type[1]
                                };
                                console.log(parse);
                                this.values.maincard.push(parse);
                                this.shuffle(this.values.maincard);
                            }
                        });
                this.http.get(this.config.WORDPRESS_REST_API_URL + '/posts/1756', this.config.options).map(res=> res.json())
                        .subscribe(data =>{
                            var regExp = /<img[^>]*src=[\"']?([^>\"']+)[\"']?[^>]*>/g, match;
                            var parsesrc = [];
                            while (match = regExp.exec(data.content.rendered))
                                parsesrc.push(match[1]);
                            var mainlink = data.content.rendered.match('{{[^>]*}}');
                            var parselink = mainlink[0].replace('{{','').replace('}}','').split('|');
                            this.values.mainad = [];
                            for(var i=0 ; i < parsesrc.length ; i++){
                                var parselink_type = parselink[i].split(':');
                                var parse = {
                                    src : parsesrc[i],
                                    type : parselink_type[0],
                                    link : parselink_type[1]
                                };
                                this.values.mainad.push(parse);
                                this.shuffle(this.values.mainad);
                            }
                        });

                this.http.get(this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-product_count', this.config.options).map(res => res.json())
                        .subscribe(data => {
                           this.values.product_total = data.publish;
                           this.values.product_page_num = Math.ceil(data.publish/10);
                           for(var i= 1 ; i <= this.values.product_page_num ; i++){
                               this.values.product_order.push(i);
                           }
                           this.shuffle(this.values.product_order);
                           console.log(this.values.product_order);
                });

                var params = new URLSearchParams();
                params.append("postid", "106");
                this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-like', params, this.config.options).map(res=> res.json()).subscribe(data => {
                    console.log(data);
                });
            });
        });
    }
    getNonce() {
        return new Promise(resolve => {
            this.http.get(this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-nonce', this.config.options).map(res => res.json()).subscribe(data => {
                resolve(data);
            });
        });
    }

    login(loginData) {
        var params = new URLSearchParams();
        params.append("username", loginData.username);
        params.append("password", loginData.password);
        params.append("_wpnonce", this.login_nonce);
        params.append("login", 'Login');
        params.append("redirect", this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-userdata');
        return new Promise(resolve => {
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-login', params, this.config.options).map(res => res.json()).subscribe(data => {
                if (!data.errors && data.data) {
                    this.values.isLoggedIn = data.data.status;
                    this.values.customerName = data.data.display_name;
                    this.values.customerId = data.data.ID;
                    this.values.avatar = data.data.avatar_url;
                    params = new URLSearchParams();
                    params.append("customer_id", this.values.customerId.toString());

                    this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-get_wishlist', params, this.config.options).map(res => res.json()).subscribe(data => {
                        for (let item in data) {
                            this.values.wishlistId[data[item].id] = data[item].id;
                        }
                    });

                    this.nativeStorage.setItem('loginData', {
                        username: loginData.username,
                        password: loginData.password,
                        avatar: data.data.avatar_url,
                        type: 'woo'
                    }).then(data => console.log('Login Details Stored'), error => console.error(error));
                }
                resolve(data);
            }, err => {
                resolve(JSON.parse(err._body));
                console.log(err._body)
            });
        });
    }
    encodeUrl(href) {
        return href.replace(/&amp;/g, '&')
    }
    encodeUrl_Auth(href){
        return href.replace(' ','+');
    }


    logout() {
        return new Promise(resolve => {
          this.storage.clear();
          this.values.isLoggedIn = false;
          this.values.customerName = "";
          this.values.point = 0;
          this.values.clayful_cart = [];
        });
    }

    passwordreset(email, nonce, url) {
        var params = new URLSearchParams();
        params.append("user_login", email);
        params.append("wc_reset_password", "true");
        params.append("_wpnonce", nonce);
        params.append("_wp_http_referer", '/my-account/lost-password/');
        return new Promise(resolve => {
            this.http.post(this.config.url + '/my-account/lost-password/', params, this.config.options).subscribe(status => {
                resolve(status);
            });
        });
    }
    passwordResetNonce() {
        return new Promise(resolve => {
            this.http.get(this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-passwordreset', this.config.options).map(res => res.json()).subscribe(data => {
                resolve(data);
            });
        });
    }
    getAddress() {
        return new Promise(resolve => {
            // this.reqhttp.clearCookies();
            // this.reqhttp.get(this.config.setUrl('GET', '/wp-json/wc/v2/customers/' + this.values.customerId + '?', false), {}, {}).then(data => {
            //     this.address = JSON.parse(data.data);
            //     resolve(this.address);
            // });
            this.http.get(this.config.setUrl('GET', '/wp-json/wc/v2/customers/' + this.values.customerId + '?', false), {}).map(res => res.json()).subscribe(data => {
                this.address = data;
                resolve(this.address);
            });
        });
    }
    saveAddress(address) {
        var params = address;
        // this.reqhttp.setHeader(this.config.url, 'Content-Type', 'application/json; charset=UTF-8');
        // this.reqhttp.setDataSerializer('json');
        // this.reqhttp.clearCookies();
        return new Promise(resolve => {
            // this.reqhttp.put(this.config.setUrl('PUT', '/wp-json/wc/v2/customers/' + this.values.customerId + '?', false), params, {}).then(data => {
            //     resolve(JSON.parse(data.data));
            // }, err => console.log(err));
            this.http.put(this.config.setUrl('PUT', '/wp-json/wc/v2/customers/' + this.values.customerId + '?', false), params, {}).map(res => res.json()).subscribe(data => {
                resolve(data);
            }, err => console.log(err));
        });
    }
    getPointlogs(){
        return new Promise(resolve =>{
            this.http.get(this.config.url + '/wp-admin/admin-ajax.php?action=mshop-point-ex-get_mypoint_logs', this.config.options).map(res => res.json()).subscribe(data =>{
                resolve(data);
            });
        });
    }

    shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    pushNotification(notification) {
        var params = new URLSearchParams();
        params.append("device_id", notification.device_id);
        params.append("platform", notification.platform);
        params.append("email", notification.email);
        params.append("city", notification.city);
        params.append("state", notification.state);
        params.append("country", notification.country);
        params.append("pincode", notification.pincode);
        return new Promise(resolve => {
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-user-subcribe-notify', params, this.config.options).map(res => res.json()).subscribe(data => {
                this.status = data;
                resolve(this.status);
            });
        });
    }
    pushNotify(deviceId, platform) {
        var params = new URLSearchParams();
        params.append("device_id", deviceId);
        params.append("platform", platform);
        return new Promise(resolve => {
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-user-subcribe-notify', params, this.config.options).map(res => res.json()).subscribe(data => {
                this.status = data;
                resolve(this.status);
            });
        });
    }

    getPoint(){
        this.http.get(this.config.url + '/wp-admin/admin-ajax.php?action=mshop-point-ex-get_mypoint', this.config.options).map(res => res.json())
                        .subscribe(data => {
                           this.values.point = data.free_point;
        });
    }


    getOrder(id) {
        return new Promise(resolve => {
            this.http.get(this.config.setUrl('GET', '/wp-json/wc/v2/orders/' + id + '?', false), this.config.optionstwo).map(res => res.json()).subscribe(data => {
                this.order = data;
                resolve(this.order);
            });
        });
    }
    getCountry() {
        return new Promise(resolve => {
            this.http.get(this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-get_country', this.config.options).map(res => res.json()).subscribe(data => {
                this.country = data;
                resolve(this.country);
            });
        });
    }
    registerCustomer(customer) {
        var params = customer;
        return new Promise(resolve => {
            this.http.post(this.config.setUrl('POST', '/wp-json/wc/v2/customers?', false), params, {withCredentials: false}).map(res => res.json()).subscribe(data => {
                this.user = data;
                resolve(this.user);
            }, err => {
                resolve(JSON.parse(err._body));
            });
        });
    }

    registerSnsCustomer(token, response,sns, phone, display_name){
        var params = new URLSearchParams();
        params.append("access_token", token);
        params.append("display_name", display_name);
        params.append("phone_num", phone);
        if(sns == 'facebook'){
            params.append("email",response);
            return new Promise(resolve => {
                this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-facebook_join', params, this.config.options).map(res => res.json()).subscribe(data => {
                    if (data.status) {
                        this.values.isLoggedIn = true;
                        this.values.customerName = data.display_name;
                        this.values.customerId = data.user_id;
                        this.values.avatar = data.avatar;
                        this.nativeStorage.setItem('loginData', {
                            username: data.display_name,
                            avatar: data.avatar,
                            type: 'social',
                            displayName: data.display_name
                        }).then(data => console.log('Data Stored'), error => console.error(error));
                        resolve(data);
                    }
                });
            });
        }
        else if(sns == 'naver'){
            params.append("email", response.email);
            return new Promise(resolve => {
                this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-naver_join', params, this.config.options).map(res => res.json()).subscribe(data => {
                    if (data.status) {
                        this.values.isLoggedIn = true;
                        this.values.customerName = data.display_name;
                        this.values.customerId = data.user_id;
                        this.values.avatar = data.avatar;
                        this.nativeStorage.setItem('loginData', {
                            username: data.display_name,
                            avatar: data.avatar,
                            type: 'social',
                            displayName: data.display_name
                        }).then(data => console.log('Data Stored'), error => console.error(error));
                        console.log('service' + this.values.customerName);
                        resolve(data);
                    }
                });
            });
        }
        else if(sns == 'kakao'){

            params.append("email",response);
            return new Promise(resolve => {
                this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-kakao_join', params, this.config.options).map(res => res.json()).subscribe(data => {
                    if (data.status) {
                        this.values.isLoggedIn = true;
                        this.values.customerName = data.display_name;
                        this.values.customerId = data.user_id;
                        this.values.avatar = data.avatar;
                        this.nativeStorage.setItem('loginData', {
                            username: data.display_name,
                            avatar: data.avatar,
                            type: 'social',
                            displayName: data.display_name
                        }).then(data => console.log('Data Stored'), error => console.error(error));
                        console.log('service' + this.values.customerName);
                        resolve(data);
                    }
                });
            })
        }
    }



    getOrders(filter) {
        return new Promise(resolve => {
            this.http.get(this.config.setUrl('GET', '/wp-json/wc/v2/orders?', filter), this.config.optionstwo).map(res => res.json()).subscribe(data => {
                this.orders = data;
                resolve(this.orders);
            });
        });
    }
    updateOrder(data, id) {
        return new Promise(resolve => {
            this.http.put(this.config.setUrl('PUT', '/wp-json/wc/v2/orders/' + id + '?', false), data, {withCredentials: true}).map(res => res.json()).subscribe(data => {
                this.status = data;
                resolve(this.status);
            }, err => {
                resolve(JSON.parse(err._body));
            });
        });
    }
    presentLoading(text) {
        this.loader = this.loadingCtrl.create({
            content: text,
        });
        this.loader.present();
    }
    dismissLoading() {
        this.loader.dismiss();
    }
    addToWishlist(id) {
        return new Promise(resolve => {
            var params = new URLSearchParams();
            params.append("product_id", id);
            params.append("customer_id", this.values.customerId.toString());
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-add_wishlist', params, this.config.options).map(res => res.json()).subscribe(data => {
                this.status = data;
                resolve(this.status);
            });
        });
    }
    deleteItem(id) {
        var params = new URLSearchParams();
        params.append("product_id", id);
        params.append("customer_id", this.values.customerId.toString());
        return new Promise(resolve => {
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-remove_wishlist', params, this.config.options).map(res => res.json()).subscribe(data => {
                resolve(data);
            });
        });
    }
    getProducts() {
        this.filter = {};
        this.filter.page = 1;
        this.filter.status = 'publish';
        this.http.get(this.config.setUrl('GET', '/wp-json/wc/v2/products/?', false), this.config.optionstwo).map(res => res.json()).subscribe(data => {
            this.products = data;
        });
    }
    getfeaturedProduct() {
        this.filter.featured = true;
        this.filter.on_sale = undefined;
        this.filter.per_page = 50;
        this.http.get(this.config.setUrl('GET', '/wp-json/wc/v2/products/?', this.filter), this.config.optionstwo).map(res => res.json()).subscribe(data => {
            this.featuredProduct = data;
        });
    }
    getTrending() {
        this.filter.on_sale = undefined;
        this.filter.featured = undefined;
        this.filter['filter[tag]'] = "trending";
        this.http.get(this.config.setUrl('GET', '/wp-json/wc/v2/products/?', this.filter), this.config.optionstwo).map(res => res.json()).subscribe(data => {
            this.trending = data;
        });
    }

    getKoreanAddress(keyword, page:1){
        return new Promise(resolve =>{
            this.http.get('http://www.juso.go.kr/addrlink/addrLinkApi.do?resultType=json&keyword=' + keyword + '&confmKey=' + this.config.jusoApikey + '&currentPage=' + page).map(res => res.json()).subscribe(data => {
                resolve(data);
            });
        });
    }


    getLocationAddress(lat, lon) {
        return new Promise(resolve => {
            this.http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lon + '&sensor=true').map(res => res.json()).subscribe(data => {
                resolve(data);
            });
        });
    }
    sendToken(token) {
        var params = new URLSearchParams();
        params.append("access_token", token);
        return new Promise(resolve => {
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-facebook_connect', params, this.config.options).map(res => res.json()).subscribe(data => {
                if (data.status) {
                    this.values.isLoggedIn = true;
                    this.values.customerName = data.last_name;
                    this.values.customerId = data.user_id;
                    this.values.avatar = data.avatar;
                    this.nativeStorage.setItem('loginData', {
                        username: data.user_login,
                        avatar: data.avatar,
                        type: 'social',
                        displayName: data.last_name
                    }).then(data => console.log('Data Stored'), error => console.error(error));
                    resolve(data);
                }
            });
        });
    }

    facebookLoginChk(token, email){
        var params = new URLSearchParams();
        params.append("access_token", token);
        params.append("email", email);
        return new Promise(resolve => {
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-facebook_loginchk', params, this.config.options).map(res => res.json()).subscribe(data => {
                if (!data.status){
                    if(data.msg == 'need_register')
                        resolve(data.msg);
                }
                else if (data.status) {
                    this.values.isLoggedIn = true;
                    this.values.customerName = data.display_name;
                    this.values.customerId = data.user_id;
                    this.values.avatar = data.avatar;
                    this.nativeStorage.setItem('loginData', {
                        username: data.user_login,
                        avatar: data.avatar,
                        type: 'social',
                        displayName: data.display_name
                    }).then(data => console.log('Data Stored'), error => console.error(error));
                    resolve(data);
                }
            });
        });
    }

    naverLoginChk(token, response){
        var params = new URLSearchParams();
        params.append("access_token", token);
        params.append("email", response.response.email);
        return new Promise(resolve => {
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-naver_loginchk', params, this.config.options).map(res => res.json()).subscribe(data => {
                if (!data.status){
                    if(data.msg == 'need_register')
                        resolve(data.msg);
                }
                else if(data.status){
                    this.values.isLoggedIn = true;
                    this.values.customerName = data.display_name;
                    this.values.customerId = data.user_id;
                    this.values.avatar = data.avatar;
                    this.nativeStorage.setItem('loginData', {
                        username: data.user_login,
                        avatar: data.avatar,
                        type: 'social',
                        displayName: data.display_name
                    }).then(data => console.log('Data Stored'), error => console.error(error));
                    resolve(data);
                }
            });
        });
    }

    kakaoLoginChk(token, email){
        var params = new URLSearchParams();
        params.append("access_token", token);
        params.append("email", email);
        return new Promise(resolve => {
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-naver_loginchk', params, this.config.options).map(res => res.json()).subscribe(data => {
                if (!data.status){
                    if(data.msg == 'need_register')
                        resolve(data.msg);
                }
                else if(data.status){
                    this.values.isLoggedIn = true;
                    this.values.customerName = data.display_name;
                    this.values.customerId = data.user_id;
                    this.values.avatar = data.avatar;
                    this.nativeStorage.setItem('loginData', {
                        username: data.user_login,
                        avatar: data.avatar,
                        type: 'social',
                        displayName: data.display_name
                    }).then(data => console.log('Data Stored'), error => console.error(error));
                    resolve(data);
                }
            });
        });
    }




    nicknameChk(nickname){
        var params = new URLSearchParams();
        params.append("display_name", nickname);
        return new Promise(resolve => {
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-check_display_name', params, this.config.options).map(res => res.json()).subscribe(data => {
                console.log(data);
                resolve(data.status);
            });
        });
    }

    googleLogin(res) {
        var params = new URLSearchParams();
        params.append("access_token", res.userId);
        params.append("email", res.email);
        params.append("first_name", res.displayName);
        params.append("last_name", res.displayName);
        return new Promise(resolve => {
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-google_connect', params, this.config.options).map(res => res.json()).subscribe(data => {
                this.googleResponse = data;
                if (data.status) {
                    this.values.isLoggedIn = true;
                    this.values.customerName = res.displayName;
                    this.values.customerId = data.user_id;
                    this.values.avatar = res.imageUrl;
                    this.nativeStorage.setItem('loginData', {
                        username: res.email,
                        avatar: res.imageUrl,
                        type: 'social',
                        displayName: res.displayName
                    }).then(data => console.log('Data Stored'), error => console.error(error));
                    resolve(data);
                }
            });
        });
    }
    socialLogin(email) {
        var params = new URLSearchParams();
        params.append("access_token", 'token');
        params.append("email", email);
        this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-google_connect', params, this.config.options).map(res => res.json()).subscribe(data => {
            this.googleResponse = data;
            if (data.status) {
                this.values.isLoggedIn = true;
                this.values.customerId = data.user_id;
            }
        });
    }
    getAttributes() {
        if (this.values.attributes) {
            return Promise.resolve(this.values.attributes);
        }
        return new Promise(resolve => {
            this.http.get(this.config.setUrl('GET', '/wp-json/wc/v2/products/attributes?', {
                per_page: 100
            }), this.config.optionstwo).map(res => res.json()).subscribe(data => {
                this.values.attributes = data;
                if (this.values.attributes.length) {
                    this.values.attributes[0].selected = true;
                    this.values.selectedFilter = this.values.attributes[0];
                    this.values.filter.attribute = this.values.attributes[0].id;
                }
                resolve(this.values.attributes);
            });
        });
    }
    attributeTerms(id) {
        if (this.values.attributeTerms[id]) {
            return Promise.resolve(this.values.attributeTerms[id]);
        }
        return new Promise(resolve => {
            this.http.get(this.config.setUrl('GET', '/wp-json/wc/v2/products/attributes/' + id + '/terms?', {
                per_page: 100
            }), this.config.optionstwo).map(res => res.json()).subscribe(data => {
                this.values.attributeTerms[id] = data;
                resolve(this.values.attributeTerms[id]);
            });
        });
    }
    addToCart(params) {
        return new Promise(resolve => {
            var searchParams = new URLSearchParams();
            for (let param in params) {
                searchParams.set(param, params[param]);
            }
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-add_to_cart', searchParams, this.config.options).map(res => res.json()).subscribe(data => {
                this.status = data.cart;
                this.values.cartNonce = data.cart_nonce;
                this.values.updateCartTwo(this.status);
                resolve(this.status);
            });
        });
    }
    getbestOffers() {
        this.values.loadDeals = true;
        for (let item in this.mainCategories) {
            this.filter = {};
            this.filter.on_sale = true;
            this.filter.category = this.mainCategories[item].id;
            this.filter.featured = undefined;
            this.http.get(this.config.setUrl('GET', '/wp-json/wc/v2/products/?', this.filter), this.config.optionstwo).map(res => res.json()).subscribe(data => {
                this.deals[this.mainCategories[item].name] = data;
                if (this.deals[this.mainCategories[item].name]) this.values.loadDeals = false;
            });
        }
    }
    getPage(id: any) {
        var params = new URLSearchParams();
        params.append("page_id", id);
        return new Promise(resolve => {
            this.http.post(this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-page_content', params, this.config.options).map(res => res.json()).subscribe(data => {
                resolve(data);
            });
        });
    }


    submitPost(posttitle, postcontent, postcategoryid){
        var params = {
            title : posttitle,
            content : postcontent,
            categories : postcategoryid,
            status : 'publish',
        };
        var headers = new Headers({
         'Content-Type' :'application/json; charset=UTF-8',
         'Authorization' : 'Bearer ' + this.values.token
        });
        this.postoptions.headers = headers;
        this.postoptions.withCredentials = true;
 
        console.log(this.postoptions);
        return new Promise(resolve => {
             this.http.post(this.config.url + '/wp-json/wp/v2/posts' , params, this.postoptions).subscribe(data =>{
                 resolve(data);
             });
        });
    }

}
