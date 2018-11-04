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
            client: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6Ijg5NzBjNjUwNDM0ZTFmZWI1ZjJiOTk2NGRmZWE2MTI2ZGVhZmZiY2FhYWUwZGFlODQ1ZGY1ODUwYjgyNmI2YWYiLCJyb2xlIjoiY2xpZW50IiwiaWF0IjoxNTQwNzI2MDM0LCJzdG9yZSI6IktBMlJGRUtIVFhWUS4yUzRLQkRSTkhEM0UiLCJzdWIiOiJBQ0hHMzJNMkdGRDYifQ.zwcwlKliypKYUxvRiIuMdEDDK5-R01Ms917GTyyv-dQ',
            debugLanguage: 'ko'
        });
        this.Cart = Clayful.Cart;
        this.Order = Clayful.Order;
    }

    loginSns(vendor){
          return new Promise((resolve, reject) => {
            this.http.get(this.config.cmsurl + '/clayful/loginSns?vendor=' + vendor).map(res => res.json())
              .subscribe(response => {
                if(response.status == "error")
                  reject(response.status);
                else
                  resolve(response.redirect);
              });
          });
    }

    memberLogin(id, token){
        var param = {
            "id" : id,
            "token" : token
        };
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
            phone : phone
        };
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
        };

        return new Promise((resolve,reject) => {
                this.http.post(this.config.cmsurl + '/clayful/addCartItem',
                  {payload: payload, options:options}).map(res => res.json())
                  .subscribe(result => {
                    resolve(result.data);
                  });
        });
    }


    deleteCartItemLogin(itemId){
        var options = {
            customer : this.values.clayful_token
        };
        return new Promise((resolve, reject) =>{
          this.http.post(this.config.cmsurl + '/clayful/deleteCartItem',
            {itemId:itemId, options : options}).map(res => res.json())
            .subscribe(result => {
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
        };
        this.values.clayful_cart.push(payload);
    }

    getCartLogin(){
        var options = {
            customer : this.values.clayful_token
        };
        var payload = {
          address:{
            shipping : {
              country : "KR",
              city : "서울특별시",
              address1 : "서울특별시 강동구",
              postcode : "05397"
            }
          },
        };
        return new Promise((resolve, reject) =>{
            this.http.post(this.config.cmsurl + '/clayful/getCart',
              {payload : payload, options : options}).map(res => res.json())
              .subscribe(result => {
                if(result.status == "error"){
                  reject(result);
                }else{
                  resolve(result.cart);
                }
              });
        });
    }

    getCartNonLogin(){
        console.log(this.values.clayful_cart);
        var payload = {
          address:{
            shipping : {
              country : "KR",
              city : "서울특별시",
              address1 : "서울특별시 강동구",
              postcode : "05397"
            }
          },
            items : []
        };
        for(var i= 0 ; i < this.values.clayful_cart.length ; i++){
            var item = {
                _id : this.values.clayful_cart[i].product,
                product : this.values.clayful_cart[i].product,
                variant : this.values.clayful_cart[i].variant,
                quantity : this.values.clayful_cart[i].quantity,
                shippingMethod : this.values.clayful_cart[i].shippingMethod
            };
            payload.items.push(item);
        }
        return new Promise((resolve, reject) => {
            this.http.post(this.config.cmsurl + '/clayful/getAsNonRegisteredForMe', {payload : payload}).map(res => res.json())
              .subscribe(result => {
                resolve(result.data.cart);
              });
        });
    }

    checkoutOrderLogin(payload, productList, userPoint){
        return new Promise((resolve, reject) => {
            var param = {
                payload : JSON.stringify(payload),
                id : this.values.clayful_id,
                productList : JSON.stringify(productList),
                userPoint : userPoint
            };
            this.http.post(this.config.cmsurl + '/clayful/checkoutLogin', param).map(res => res.json()).subscribe(result => {
                if(result.status == "error")
                    reject(result);
                else
                    resolve(result);
            });
        });
    }

    checkoutOrderNonLogin(payload){
        return new Promise((resolve, reject) => {
            this.Cart.checkoutAsNonRegisteredForMe('order', payload, (err, result) => {
                if(err)
                    reject(err);
                else
                    resolve(result.data.order);
            });

        });
    }

    getOrderLogin(id){
        var options = {
            customer: this.values.clayful_token
        };

        return new Promise((resolve, reject) => {
            this.http.post(this.config.cmsurl + '/clayful/getOrder', {id : id, options: options}).map(res => res.json())
              .subscribe(result => {
                if(result){
                  reject(result);
                }
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

    idgenerate(product_id){
      var id = 0;
      console.log(product_id);


      return id;
    }
}
