import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {ShoppingProductPage} from "./shopping-product";

@NgModule({
  declarations: [
    ShoppingProductPage,
  ],
  imports: [
    IonicPageModule.forChild(ShoppingProductPage),
  ],
})
export class ShoppingPageModule {}
