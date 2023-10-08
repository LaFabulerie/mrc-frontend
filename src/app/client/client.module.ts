import { NgModule } from '@angular/core';
import { ClientRoutingModule } from './client-routing.module';
import { SharedModule } from '../common/shared.module';
import { DoorComponent } from './door/door.component';
import { MapComponent } from './map/map.component';
import { ItemComponent } from './item/item.component';
import { DigitalUseComponent } from './digital-use/digital-use.component';
import { HomeComponent } from './home/home.component';
import { VideoDialogComponent } from './components/video-dialog/video-dialog.component';
import { TurningTableDialogComponent } from './components/turning-table-dialog/turning-table-dialog.component';
import { BasketComponent } from './basket/basket.component';
import { OfficeComponent } from './rooms/office/office.component';
import { GarageComponent } from './rooms/garage/garage.component';
import { KitchenComponent } from './rooms/kitchen/kitchen.component';
import { ExitDialogComponent } from './components/exit-dialog/exit-dialog.component';
import { LivingRoomComponent } from './rooms/living-room/living-room.component';
import { HighlightableComponent } from './components/highlightable/highlightable.component';
import { ModeSelectorComponent } from './mode-selector/mode-selector.component';
import { GardenComponent } from './rooms/garden/garden.component';
import { FeedbackComponent } from './feedback/feedback.component';


@NgModule({
  declarations: [
    DoorComponent,
    MapComponent,
    ItemComponent,
    DigitalUseComponent,
    HomeComponent,
    VideoDialogComponent,
    TurningTableDialogComponent,
    BasketComponent,
    OfficeComponent,
    GarageComponent,
    KitchenComponent,
    ExitDialogComponent,
    LivingRoomComponent,
    HighlightableComponent,
    ModeSelectorComponent,
    GardenComponent,
    FeedbackComponent,
  ],
  imports: [
    SharedModule,
    ClientRoutingModule
  ]
})
export class ClientModule { }
