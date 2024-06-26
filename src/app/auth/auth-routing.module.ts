import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPwdComponent } from './forgot-pwd/forgot-pwd.component';
import { ResetPwdComponent } from './reset-pwd/reset-pwd.component';
import { SigninComponent,  } from './signin/signin.component';
import { EmailCheckComponent } from './email-check/email-check.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { path: '', children: [
    { path: '', redirectTo: 'signin', pathMatch: 'full'},
    { path: 'signin', component : SigninComponent },
    // { path: 'signup', component : SignupComponent },
    // { path: 'verify-email/:key', component : EmailCheckComponent},
    { path: 'forgot-password', component : ForgotPwdComponent},
    { path: 'reset-password/:uid/:token', component : ResetPwdComponent},
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
