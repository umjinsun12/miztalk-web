import { NgModule } from '@angular/core';
import { IonicPageModule, IonicModule } from 'ionic-angular';
import { AccountLogin } from './login';

@NgModule({
  declarations: [
    AccountLogin
    
  ],
  imports: [
    IonicPageModule.forChild(AccountLogin),
  ],
})
export class AccountLoginModule {}
