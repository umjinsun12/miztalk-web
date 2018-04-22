import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import {HomeDetailPage} from './home-detail';
import {CacheImgModule} from '../../services/img-util'

@NgModule({
    declarations: [HomeDetailPage],
    imports:[
        CacheImgModule,
        IonicPageModule.forChild(HomeDetailPage),
    ],
    exports: [CacheImgModule]
})
export class HomeDetailPageModule {}