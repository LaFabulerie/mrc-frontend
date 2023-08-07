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
import { environment } from 'src/environments/environment';
import { ModeSelectorComponent } from './mode-selector/mode-selector.component';

const routes: Routes = [
  { path: '', component: HomeComponent, children: [
    { path: 'door', component: DoorComponent },
    { path: 'map', component: MapComponent},
    { path: 'room', children: [
      { path: 'salle-de-bain/:uuid', component: BathroomComponent},
      { path: 'chambre/:uuid', component: BedroomComponent},
      { path: 'bureau/:uuid', component: OfficeComponent},
      { path: 'garage/:uuid', component: GarageComponent},
      { path: 'cuisine/:uuid', component: KitchenComponent},
      { path: 'salon/:uuid', component: LivingRoomComponent},
    ]},
    { path: 'item/:uuid', component: ItemComponent},
    { path: 'use/:uuid', component: DigitalUseComponent},
    { path: 'basket', component: BasketComponent},
  ]},
];

if(environment.mode === 'standalone'){
  routes[0].children?.unshift(
    { path: '', redirectTo: 'mode', pathMatch: 'full'},
    { path: 'mode', component: ModeSelectorComponent},
  );
} else {
  routes[0].children?.unshift(
    { path: '', redirectTo: 'door', pathMatch: 'full'},
  );
}

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
