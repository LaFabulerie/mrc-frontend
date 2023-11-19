import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { appInitializer } from './common/app.initializer';
import { AuthInterceptor } from './common/auth.interceptor';
import { ErrorInterceptor } from './common/error.interceptor';

import { AuthService } from './services/auth.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';

import { TranslateModule } from '@ngx-translate/core';

import { AdminModule } from './admin/admin.module';
import { ClientModule } from './client/client.module';

import { MqttModule } from 'ngx-mqtt';

import { environment } from 'src/environments/environment';


let clientExtraModules = [];

if(environment.isStandalone) {
  const mqttHost = new URL(environment.serverHost).hostname;
  clientExtraModules.push(
    MqttModule.forRoot({
      hostname: mqttHost,
      port: 9001,
      path: '/mqtt',
    })
  );
}



@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    AuthModule,
    AdminModule,
    ClientModule,

    TranslateModule.forRoot(),

    ...clientExtraModules,
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AuthService] },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
