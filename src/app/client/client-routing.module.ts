import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoorComponent } from './door/door.component';
import { PlanComponent } from './plan/plan.component';
import { RoomComponent } from './room/room.component';
import { ItemComponent } from './item/item.component';
import { DigitalUseComponent } from './digital-use/digital-use.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent, children: [
    { path: '', redirectTo: 'door', pathMatch: 'full'},
    { path: 'door', component: DoorComponent },
    { path: 'plan', component: PlanComponent},
    { path: 'room', component: RoomComponent},
    { path: 'item', component: ItemComponent},
    { path: 'use', component: DigitalUseComponent},
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
