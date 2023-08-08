import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogComponent } from './catalog/catalog.component';
import { SettingsComponent } from './settings/settings.component';
import { HomeComponent } from './home/home.component';
import { DebugComponent } from './debug/debug.component';

const routes: Routes = [
  { path: '', component: HomeComponent, children: [
    { path: 'catalogue', component: CatalogComponent },
    { path: 'configuration', component: SettingsComponent },
    { path: 'debug', component: DebugComponent },
  ]},
  { path: '', redirectTo: 'catalogue', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
