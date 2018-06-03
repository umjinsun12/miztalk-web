import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventAnouncePage } from './event-anounce';

@NgModule({
  declarations: [
    EventAnouncePage,
  ],
  imports: [
    IonicPageModule.forChild(EventAnouncePage),
  ],
})
export class EventAnouncePageModule {}
