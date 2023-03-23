import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './common/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { SettingsComponent } from './pages/settings/settings.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard], children: [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'settings', component: SettingsComponent },
  ]},
  { path: 'auth', loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule) },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
