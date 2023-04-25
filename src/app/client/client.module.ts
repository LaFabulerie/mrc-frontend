import { NgModule } from '@angular/core';
import { ClientRoutingModule } from './client-routing.module';
import { SharedModule } from '../common/shared.module';
import { HomeComponent } from './home/home.component';
import { PlanComponent } from './plan/plan.component';
import { RoomComponent } from './room/room.component';
import { ItemComponent } from './item/item.component';
import { DigitalUseComponent } from './digital-use/digital-use.component';


@NgModule({
  declarations: [
    HomeComponent,
    PlanComponent,
    RoomComponent,
    ItemComponent,
    DigitalUseComponent,
  ],
  imports: [
    SharedModule,
    ClientRoutingModule
  ]
})
export class ClientModule { }
