import { AccountLogin } from './../pages/account/login/login';
import { Storage } from '@ionic/storage';
import { CommunityWritePage } from './../pages/community-write/community-write';
import { TabsPage } from './../pages/tabs/tabs';
import { CommunityDetailPage } from './../pages/community-detail/community-detail';
import { HomeDetailPage } from './../pages/home-detail/home-detail';
import { NativeStorage } from '@ionic-native/native-storage';
import { IonicStorageModule } from '@ionic/storage';
import { OneSignal } from '@ionic-native/onesignal';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { KeysPipe } from '../services/pipe/pipe';


import { WordpressService } from '../services/wordpress.service';
import { AuthenticationService } from '../services/authentication.service';


import { MyApp } from './app.component';
import { MenuPage } from './../pages/menu/menu';


import { Facebook } from '@ionic-native/facebook';

// shopping service
import { WishlistService } from './../services/shopping-services/wishlist-service';
import { Values } from './../services/shopping-services/values';
import { Service } from './../services/shopping-services/service';
import { SearchService } from './../services/shopping-services/search-service';
import { ProductService } from './../services/shopping-services/product-service';
import { Functions } from './../services/shopping-services/functions';
import { Config } from './../services/shopping-services/config';
import { CheckoutService } from './../services/shopping-services/checkout-service';
import { CategoryService } from './../services/shopping-services/category-service';
import { CartService } from './../services/shopping-services/cart-service';
import { ShoppingProductPage } from '../pages/shopping-product/shopping-product';
import { ShoppingCartPage } from '../pages/shopping-cart/shopping-cart';
import { EventDetailPage } from '../pages/event-detail/event-detail';
import { CardnewsService } from '../services/shopping-services/cardnews-service';

import { PhotoViewer} from '@ionic-native/photo-viewer';
import { SocialSharing } from '@ionic-native/social-sharing';

import { BillingAddressForm} from '../pages/checkout/billing-address-form/billing-address-form';
import {OrderSummary} from '../pages/checkout/order-summary/order-summary'

import { InAppBrowser } from '@ionic-native/in-app-browser';

import { AppRate } from '@ionic-native/app-rate';
import { EmailComposer } from '@ionic-native/email-composer';
import { MypagePage } from '../pages/account/mypage/mypage';
import { MyInformation } from '../pages/account/my-information/my-information';
import { Address } from '../pages/account/address/address';
import { EditAddressForm } from '../pages/account/edit-address-form/edit-address-form';
import { AccountForgotten } from '../pages/account/forgotten/forgotten';
import { OrderDetails } from '../pages/account/order-details/order-details';
import { Orders } from '../pages/account/orders/orders';
import { AccountRegister } from '../pages/account/register/register';
import { WishlistPage } from '../pages/account/wishlist/wishlist';

import {EventAnouncePage} from '../pages/event-anounce/event-anounce'



@NgModule({
  declarations: [
    EventDetailPage,
    CommunityDetailPage,
    MyApp,
    MenuPage,
    ShoppingProductPage,
    HomeDetailPage,
    CommunityWritePage,
    ShoppingCartPage,
    AccountLogin,
    KeysPipe,
    BillingAddressForm,
    OrderSummary,
    MyInformation,
    Address,
    EditAddressForm,
    AccountForgotten,
    OrderDetails,
    Orders,
    AccountRegister,
    WishlistPage,
    EventAnouncePage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp,{
      tabsPlacement: 'bottom',
      backButtonText: '',
      backButtonIcon: 'ios-arrow-back',
      iconMode: 'md',
      scrollPadding: false,
      scrollAssist: false
    }),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    EventDetailPage,
    ShoppingCartPage,
    CommunityWritePage,
    CommunityDetailPage,
    HomeDetailPage,
    ShoppingProductPage,
    MyApp,
    MenuPage,
    AccountLogin,
    BillingAddressForm,
    OrderSummary,
    MyInformation,
    Address,
    EditAddressForm,
    AccountForgotten,
    OrderDetails,
    Orders,
    AccountRegister,
    WishlistPage,
    EventAnouncePage
  ],
  providers: [
    NativeStorage,
    OneSignal,
    CartService,
    WishlistService,
    CategoryService,
    CheckoutService,
    Config,
    Functions,
    ProductService,
    SearchService,
    Service,
    Values,
    StatusBar,
    SplashScreen,
    WordpressService,
    AuthenticationService,
    CardnewsService,
    Facebook,
    PhotoViewer,
    SocialSharing,
    InAppBrowser,
    AppRate,
    EmailComposer,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}