import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommunityMainPage } from './community-main';

@NgModule({
  declarations: [
    CommunityMainPage,
  ],
  imports: [
    IonicPageModule.forChild(CommunityMainPage),
  ],
})
export class CommunityMainPageModule {}
