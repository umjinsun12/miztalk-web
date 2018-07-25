import { EventDetailPage } from './../pages/event-detail/event-detail';
import { ShoppingProductsPage } from './../pages/shopping-products/shopping-products';
import { OneSignal } from '@ionic-native/onesignal';
import { ShoppingProductPage } from './../pages/shopping-product/shopping-product';
import { Service } from './../services/shopping-services/service';

import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { MenuPage } from '../pages/menu/menu';
import { AlertController } from 'ionic-angular';
import { Config } from '../services/shopping-services/config';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = MenuPage;
  public alertShown:boolean = false;
  items: any = {};

  constructor(public platform: Platform, statusBar: StatusBar,splashScreen: SplashScreen,public service: Service, private oneSignal: OneSignal, public alertCtrl: AlertController,  public config: Config) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      if (platform.is('cordova')) {
        this.oneSignal.startInit(this.config.oneSignalAppId, this.config.googleProjectId);
        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
        this.oneSignal.handleNotificationReceived().subscribe(result => {});
        this.oneSignal.handleNotificationOpened().subscribe(result => {
            if (result.notification.payload.additionalData.category) {
                this.items.id = result.notification.payload.additionalData.category;
                this.nav.push(ShoppingProductsPage, this.items);
            } else if (result.notification.payload.additionalData.product) {
                this.items.id = result.notification.payload.additionalData.product;
                this.nav.push(ShoppingProductPage, this.items.id);
            } else if (result.notification.payload.additionalData.post) {
                this.items.id = result.notification.payload.additionalData.post;
                this.nav.push(EventDetailPage, this.items);
            }
        });
        this.oneSignal.endInit();
      }

      statusBar.styleDefault();
      splashScreen.hide();
      this.service.load().then((results) => {});

    });
  }

    
}

