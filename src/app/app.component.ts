import { Service } from '../services/shopping-services/service';

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

  constructor(public platform: Platform, statusBar: StatusBar,splashScreen: SplashScreen,public service: Service, public alertCtrl: AlertController,  public config: Config) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      statusBar.styleDefault();
      splashScreen.hide();
      this.service.load().then((results) => {});

    });
  }

    
}

