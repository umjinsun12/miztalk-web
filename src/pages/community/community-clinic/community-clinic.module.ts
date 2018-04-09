import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommunityClinicPage } from './community-clinic';

@NgModule({
  declarations: [
    CommunityClinicPage,
  ],
  imports: [
    IonicPageModule.forChild(CommunityClinicPage),
  ],
})
export class CommunityClinicPageModule {}
