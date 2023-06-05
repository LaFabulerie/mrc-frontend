import { NgModule } from '@angular/core';
import { ClientRoutingModule } from './client-routing.module';
import { SharedModule } from '../common/shared.module';
import { DoorComponent } from './door/door.component';
import { PlanComponent } from './plan/plan.component';
import { RoomComponent } from './room/room.component';
import { ItemComponent } from './item/item.component';
import { DigitalUseComponent } from './digital-use/digital-use.component';
import { HomeComponent } from './home/home.component';
import { WelcomeVideoDialogComponent } from './components/welcome-video-dialog/welcome-video-dialog.component';
import { DisclaimerDialogComponent } from './components/disclaimer-dialog/disclaimer-dialog.component';


@NgModule({
  declarations: [
    DoorComponent,
    PlanComponent,
    RoomComponent,
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
