import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PlanComponent } from './plan/plan.component';
import { RoomComponent } from './room/room.component';
import { ItemComponent } from './item/item.component';
import { DigitalUseComponent } from './digital-use/digital-use.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'plan', component: PlanComponent},
  { path: 'room', component: RoomComponent},
  { path: 'item', component: ItemComponent},
  { path: 'use', component: DigitalUseComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
