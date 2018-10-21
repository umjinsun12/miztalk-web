import { Config } from './config';
import { Values } from './values';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import * as Clayful from 'clayful';


@Injectable()
export class ClayfulService {

    postoptions: any = {};

    constructor(private http: Http, private config : Config, private values: Values, ) {
        Clayful.config({
            client: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6ImM2NWRhYTNiYWM1MjZmOTRlOWY2YmZmYzYyMTc1ZGZiODU4NTRhMzllZGIwYjljOGZmNzllZWMwZGQwNGQzM2IiLCJyb2xlIjoiY2xpZW50IiwiaWF0IjoxNTM5ODc2MTE0LCJzdG9yZSI6IktBMlJGRUtIVFhWUS5LNjdGN0tHRk4yRzQiLCJzdWIiOiI5SzRGWlpaUFdHV1YifQ.ScJFSxSrWjZl5WqLeCSXD9FyETebcnEGCDaVTA4_pcI',
            debugLanguage: 'ko'
        });
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

}