import { NgModule } from '@angular/core';
import { ClientRoutingModule } from './client-routing.module';
import { SharedModule } from '../common/shared.module';
import { DoorComponent } from './door/door.component';
import { MapComponent } from './map/map.component';
import { ItemComponent } from './item/item.component';
import { DigitalUseComponent } from './digital-use/digital-use.component';
import { HomeComponent } from './home/home.component';
import { WelcomeVideoDialogComponent } from './components/welcome-video-dialog/welcome-video-dialog.component';
import { DisclaimerDialogComponent } from './components/disclaimer-dialog/disclaimer-dialog.component';


@NgModule({
  declarations: [
    DoorComponent,
    MapComponent,
    ItemComponent,
    DigitalUseComponent,
    HomeComponent,
    WelcomeVideoDialogComponent,
    DisclaimerDialogComponent,
  ],
  imports: [
    SharedModule,
    ClientRoutingModule
  ]
})
export class ClientModule { }
