import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from 'ionic-angular';
import { Values } from './values';



declare class IamportPayment {
    private success;
    private status;
    private response;
    constructor(response: any);
    isSuccess(): boolean;
    getStatus(): string;
    getResponse(): object;
}

@Injectable()
export class InicisService {
    constructor(private alert: AlertController, private loadingController: LoadingController, private values: Values) {
    }

    payment(){
        return new Promise((resolve,reject)=>{

        });
    }
}