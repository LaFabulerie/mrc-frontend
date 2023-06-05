import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoorComponent } from './door/door.component';
import { MapComponent } from './map/map.component';
import { ItemComponent } from './item/item.component';
import { DigitalUseComponent } from './digital-use/digital-use.component';
import { HomeComponent } from './home/home.component';
import { BathroomComponent } from './rooms/bathroom/bathroom.component';

const routes: Routes = [
  { path: '', component: HomeComponent, children: [
    { path: '', redirectTo: 'door', pathMatch: 'full'},
    { path: 'door', component: DoorComponent },
    { path: 'map', component: MapComponent},
    { path: 'room', children: [
      { path: 'bathroom', component: BathroomComponent},
    ]},
    { path: 'item/:uuid', component: ItemComponent},
    { path: 'use/:uuid', component: DigitalUseComponent},
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
