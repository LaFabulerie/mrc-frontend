import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { SigninComponent } from './signin/signin.component';

import { SignupComponent } from './signup/signup.component';
import { SharedModule } from 'src/app/common/shared.module';
import { MessageService } from 'primeng/api';
import { EmailCheckComponent } from './email-check/email-check.component';
import { ForgotPwdComponent } from './forgot-pwd/forgot-pwd.component';
import { ResetPwdComponent } from './reset-pwd/reset-pwd.component';

@NgModule({
  declarations: [
    SigninComponent,
    SignupComponent,
    EmailCheckComponent,
    ForgotPwdComponent,
    ResetPwdComponent
  ],
  imports: [
    SharedModule,
    AuthRoutingModule,

  ],
  providers: [
    MessageService
  ],
})
export class AuthModule { }
