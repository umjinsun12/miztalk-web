import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';

import { WordpressService } from '../services/wordpress.service';
import { AuthenticationService } from '../services/authentication.service';


import { MyApp } from './app.component';
import { MenuPage } from './../pages/menu/menu';


@NgModule({
  declarations: [
    MyApp,
    MenuPage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp,{tabsPlacement: 'bottom'})
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MenuPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    WordpressService,
    AuthenticationService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
