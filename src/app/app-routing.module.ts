import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './common/auth.guard';
import { environment } from 'src/environments/environment';


const routes: Routes = [
  { path: '', loadChildren: () => import('./client/client.module').then(m => m.ClientModule)},
];

if(environment.executionMode === 'standalone') {
  routes.push(
    { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule), canActivate: [AuthGuard] },
    { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  );
}

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
