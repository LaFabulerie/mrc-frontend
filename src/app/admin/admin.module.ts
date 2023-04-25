import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../common/shared.module';
import { CatalogComponent } from './catalog/catalog.component';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { ComponentsModule } from '../components/components.module';


@NgModule({
  declarations: [
    CatalogComponent,
    HomeComponent,
    SettingsComponent,
  ],
  imports: [
    SharedModule,
    ComponentsModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
