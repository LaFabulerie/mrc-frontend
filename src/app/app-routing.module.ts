import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './common/auth.guard';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { HomeComponent } from './pages/home/home.component';
import { AdminSettingsComponent } from './pages/admin-settings/admin-settings.component';
import { environment } from 'src/environments/environment';
import { ClientSettingsComponent } from './pages/client-settings/client-settings.component';


const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard], children: [
    { path: 'catalogue', component: CatalogComponent },
    { path: 'configuration', component: environment.mode === 'client' ? ClientSettingsComponent : AdminSettingsComponent },
  ]},
  { path: 'auth', loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule) },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
