import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../common/shared.module';
import { CatalogComponent } from './catalog/catalog.component';
import { SettingsComponent } from './settings/settings.component';
import { ComponentsModule } from '../components/components.module';
import { HomeComponent } from './home/home.component';
import { DebugComponent } from './debug/debug.component';


@NgModule({
  declarations: [
    HomeComponent,
    CatalogComponent,
    SettingsComponent,
    DebugComponent,
  ],
  imports: [
    SharedModule,
    ComponentsModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
