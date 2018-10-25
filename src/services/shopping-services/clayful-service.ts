import { Config } from './config';
import { Values } from './values';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import * as Clayful from 'clayful';


@Injectable()
export class ClayfulService {

    postoptions: any = {};
    Cart : any;
    Order : any;

    constructor(private http: Http, private config : Config, private values: Values) {
        Clayful.config({
            client: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6ImM2NWRhYTNiYWM1MjZmOTRlOWY2YmZmYzYyMTc1ZGZiODU4NTRhMzllZGIwYjljOGZmNzllZWMwZGQwNGQzM2IiLCJyb2xlIjoiY2xpZW50IiwiaWF0IjoxNTM5ODc2MTE0LCJzdG9yZSI6IktBMlJGRUtIVFhWUS5LNjdGN0tHRk4yRzQiLCJzdWIiOiI5SzRGWlpaUFdHV1YifQ.ScJFSxSrWjZl5WqLeCSXD9FyETebcnEGCDaVTA4_pcI',
            debugLanguage: 'ko'
        });
        this.Cart = Clayful.Cart;
        this.Order = Clayful.Order;
    }

    loginSns(vendor){
        const Customer = Clayful.Customer;
        return new Promise((resolve, reject) => {
            Customer.authenticateBy3rdParty(vendor, function(err, result){
                if(err)
                    reject(err);
                else
                    resolve(result.data.redirect);
            });
        });
    }

    memberLogin(id, token){
        var param = {
            "id" : id,
            "token" : token
        }
        return this.http.post(this.config.cmsurl + '/clayful/_memberLogin', param).map(res => res.json());
    }



    memberChk(id, token){
        return new Promise((resolve, reject)=>{
            var param = {
                "id" : id,
                "token" : token
            }
            console.log(param);
            this.http.post(this.config.cmsurl + '/clayful/memberCheck', param).map(res => res.json())
            .subscribe((response) => {
                if(response.status == "error")
                    reject(response.msg)
                else
                    resolve(response.msg)
            });
        });
    }

    nicknameChk(user_name){
        return new Promise((resolve, reject) => {
            var param = {
                name : user_name
            }
            this.http.post(this.config.cmsurl + '/clayful/nicknameCheck',param).map(res => res.json())
            .subscribe((response) => {
                if(response.status == "error")
                    reject(response.msg);
                else
                    resolve(response.msg);
            });
        });
    }

    memberReg(name, id, token, phone, marketing){
        var param = {
            name : name,
            id : id,
            token : token,
            phone : phone,
            marketing : marketing
        }
        return this.http.post(this.config.cmsurl + '/clayful/_memberReg',param).map(res => res.json());
    }

    getProduct(id){
        return this.http.get(this.config.cmsurl + '/clayful/getProduct?id='+ id).map(res => res.json());
    }
    getProductList(page){
        return this.http.get(this.config.cmsurl + '/clayful/productList?page='+page).map(res => res.json());
    }
    getProductListCategory(page, category){
        return this.http.get(this.config.cmsurl + '/clayful/productList?page='+page + '&category=' + category).map(res => res.json());
    }

    addCartLogin(productId, variantId, quantity, shippingMethod){
        var options = {
            customer : this.values.clayful_token
        };
        var payload = {
            product : productId,
            variant : variantId,
            quantity : quantity,
            shippingMethod : shippingMethod
        }

        return new Promise((resolve,reject) => {
                this.Cart.addItemForMe(payload, options, (err, result) => {
                    if(err)
                        reject(err);
                    else
                        resolve(result.data);
                });
        });
    }
    deleteCartItemLogin(itemId){
        var options = {
            customer : this.values.clayful_token
        }
        return new Promise((resolve, reject) => {
            this.Cart.deleteItemForMe(itemId, options, (err, result) => {
                if(err)
                    reject(err);
                else
                    resolve(result.data);
            });
        });
    }
    
    addCartNonLogin(productId, variantId, quantity, shippingMethod){
        var payload = {
            product : productId,
            variant : variantId,
            quantity : quantity,
            shippingMethod : shippingMethod
        }
        this.values.clayful_cart.push(payload);
    }

    getCartLogin(){
        var options = {
            customer : this.values.clayful_token
        };
        var payload = {
            /*address : {
                shipping : {
                    city : "서울특별시",
                    address1 : "강남구"
                },
                billing :{
                    city : "서울특별시",
                    address1 : "강남구"
                }
            },*/
        }
        return new Promise((resolve, reject) =>{
            this.Cart.getForMe(payload, options, (err, result) => {
                if(err)
                    reject(err);
                else{
                    resolve(result.data.cart);
                }
            });
        });
    }

    getCartNonLogin(){
        var payload = {

        }
        return new Promise((resolve, reject) => {
            //this.Cart.get
        });
    }

    checkoutOrderLogin(payload, productList, userPoint){
        return new Promise((resolve, reject) => {
            var param = {
                payload : JSON.stringify(payload),
                id : this.values.clayful_id,
                productList : JSON.stringify(productList),
                userPoint : userPoint
            }
            this.http.post(this.config.cmsurl + '/clayful/checkoutLogin', param).map(res => res.json()).subscribe(result => {
                if(result.status == "error")
                    reject(result);
                else
                    resolve(result);
            });
        });
    }

    getOrderLogin(id){
        var options = {
            customer: this.values.clayful_token
        };

        return new Promise((resolve, reject) => {
            this.Order.getForMe(id, options, function(err, result) {
                if (err) {
                    reject(err.code);
                }
                var headers = result.headers;
                var data = result.data;
                resolve(data);
            });
        });
    }

    getUserPoint(userid){
        return new Promise((resolve, reject) => {
            this.http.get(this.config.cmsurl + '/clayful/getPoint?id=' + userid).map(res => res.json()).subscribe(result => {
                if(result.status == "error")
                    reject(result);
                else
                    resolve(result.msg);
            });
        });
    }

}