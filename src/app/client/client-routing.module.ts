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
import { OfficeComponent } from './rooms/office/office.component';
import { GarageComponent } from './rooms/garage/garage.component';
import { KitchenComponent } from './rooms/kitchen/kitchen.component';
import { LivingRoomComponent } from './rooms/living-room/living-room.component';
import { ModeSelectorComponent } from './mode-selector/mode-selector.component';
import {navigationModeGuard} from "../common/navigation-mode.guard";
import {GardenComponent} from "./rooms/garden/garden.component";
import { FeedbackComponent } from './feedback/feedback.component';

const routes: Routes = [
  { path: '', component: HomeComponent, children: [
    { path: '', redirectTo: 'mode', pathMatch: 'full'},
    { path: 'mode', component: ModeSelectorComponent},
    { path: 'door', component: DoorComponent, canActivate: [navigationModeGuard] },
    { path: 'door/:scope', component: DoorComponent, canActivate: [navigationModeGuard] },
    { path: 'map', component: MapComponent, canActivate: [navigationModeGuard]},
    { path: 'map/:scope', component: MapComponent, canActivate: [navigationModeGuard]},
    { path: 'feedback', component: FeedbackComponent, canActivate: [navigationModeGuard]},
    { path: 'room', children: [
      { path: 'salle-de-bain/:uuid', component: BathroomComponent},
      { path: 'chambre/:uuid', component: BedroomComponent},
      { path: 'bureau/:uuid', component: OfficeComponent},
      { path: 'garage/:uuid', component: GarageComponent},
      { path: 'cuisine/:uuid', component: KitchenComponent},
      { path: 'salon/:uuid', component: LivingRoomComponent},
      { path: 'jardin/:uuid', component: GardenComponent},
      { path: 'salle-de-bain/:scope/:uuid', component: BathroomComponent},
      { path: 'chambre/:scope/:uuid', component: BedroomComponent},
      { path: 'bureau/:scope/:uuid', component: OfficeComponent},
      { path: 'garage/:scope/:uuid', component: GarageComponent},
      { path: 'cuisine/:scope/:uuid', component: KitchenComponent},
      { path: 'salon/:scope/:uuid', component: LivingRoomComponent},
      { path: 'jardin/:scope/:uuid', component: GardenComponent},
    ], canActivate: [navigationModeGuard]},
    { path: 'item/:scope/:uuid', component: ItemComponent, canActivate: [navigationModeGuard]},
    { path: 'item/:uuid', component: ItemComponent, canActivate: [navigationModeGuard]},
    { path: 'use/:uuid', component: DigitalUseComponent, canActivate: [navigationModeGuard]},
    { path: 'use/:scope/:uuid', component: DigitalUseComponent, canActivate: [navigationModeGuard]},
    { path: 'basket', component: BasketComponent, canActivate: [navigationModeGuard]},
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
