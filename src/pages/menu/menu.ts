import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Nav } from 'ionic-angular';
import { Values } from '../../services/shopping-services/values';

/**
 * Generated class for the MenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export interface PageInterface {
  title: string;
  pageName: string;
  tabComponent?: any;
  index?: number;
  icon: string;
}
 

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  rootPage = 'TabsPage';
 
  // Reference to the app's root nav
  @ViewChild(Nav) nav: Nav;
 
  pages: PageInterface[] = [
    { title: '홈', pageName: 'TabsPage', tabComponent: 'HomePage', index: 0, icon: 'ai-tab-1-home-icon-off' },
    { title: '커뮤니티', pageName: 'TabsPage', tabComponent: 'CommunityPage', index: 1, icon: 'ai-tab-2-comu-icon-off' },
    { title: '이벤트', pageName: 'TabsPage', tabComponent: 'ShoppingPage', index: 1, icon: 'ai-tab-3-event-off' },
    { title: '쇼핑', pageName: 'TabsPage', tabComponent: 'EventPage', index: 1, icon: 'ai-tab-4-shop-icon-off' },
    { title: '마이페이지', pageName: 'TabsPage', tabComponent: 'MypagePage', index: 1, icon: 'ai-tab-5-mypage-icon-off' },
  ];
 
  constructor(
    public navCtrl: NavController,
    public values : Values) { }
 
  openPage(page: PageInterface) {
    let params = {};
 
    // The index is equal to the order of our tabs inside tabs.ts
    if (page.index) {
      params = { tabIndex: page.index };
    }
 
    // The active child nav is our Tabs Navigation
    if (this.nav.getActiveChildNav() && page.index != undefined) {
      this.nav.getActiveChildNav().select(page.index);
    } else {
      // Tabs are not active, so reset the root page 
      // In this case: moving to or from SpecialPage
      this.nav.setRoot(page.pageName, params);
    }
  }
 
  isActive(page: PageInterface) {
    // Again the Tabs Navigation
    let childNav = this.nav.getActiveChildNav();
 
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }
 
    // Fallback needed when there is no active childnav (tabs not active)
    if (this.nav.getActive() && this.nav.getActive().name === page.pageName) {
      return 'primary';
    }
    return;
  }

}
