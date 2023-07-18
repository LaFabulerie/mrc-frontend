import { NgModule } from '@angular/core';
import { ClientRoutingModule } from './client-routing.module';
import { SharedModule } from '../common/shared.module';
import { DoorComponent } from './door/door.component';
import { MapComponent } from './map/map.component';
import { ItemComponent } from './item/item.component';
import { DigitalUseComponent } from './digital-use/digital-use.component';
import { HomeComponent } from './home/home.component';
import { VideoDialogComponent } from './components/video-dialog/video-dialog.component';
import { DisclaimerDialogComponent } from './components/disclaimer-dialog/disclaimer-dialog.component';
import { BasketComponent } from './basket/basket.component';
import { OfficeComponent } from './rooms/office/office.component';
import { GarageComponent } from './rooms/garage/garage.component';
import { KitchenComponent } from './rooms/kitchen/kitchen.component';


@NgModule({
  declarations: [
    DoorComponent,
    MapComponent,
    ItemComponent,
    DigitalUseComponent,
    HomeComponent,
    VideoDialogComponent,
    DisclaimerDialogComponent,
    BasketComponent,
    OfficeComponent,
    GarageComponent,
    KitchenComponent,
  ],
  imports: [
    SharedModule,
    ClientRoutingModule
  ]
})
export class ClientModule { }
