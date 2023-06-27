import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoorComponent } from './door/door.component';
import { MapComponent } from './map/map.component';
import { ItemComponent } from './item/item.component';
import { DigitalUseComponent } from './digital-use/digital-use.component';
import { HomeComponent } from './home/home.component';
import { BathroomComponent } from './rooms/bathroom/bathroom.component';
import { BasketComponent } from './basket/basket.component';
import { BedroomComponent } from './rooms/bedroom/bedroom.component';

const routes: Routes = [
  { path: '', component: HomeComponent, children: [
    { path: '', redirectTo: 'door', pathMatch: 'full'},
    { path: 'door', component: DoorComponent },
    { path: 'map', component: MapComponent},
    { path: 'room', children: [
      { path: 'bathroom/:uuid', component: BathroomComponent},
      { path: 'bedroom/:uuid', component: BedroomComponent},
    ]},
    { path: 'item/:uuid', component: ItemComponent},
    { path: 'use/:uuid', component: DigitalUseComponent},
    { path: 'basket', component: BasketComponent},
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
