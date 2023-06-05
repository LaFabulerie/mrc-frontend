import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { appInitializer } from './common/app.initializer';
import { JwtInterceptor } from './common/jwt.interceptor';
import { ErrorInterceptor } from './common/error.interceptor';

import { AuthService } from './services/auth.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { ComponentsModule } from './components/components.module';

import { TranslateModule } from '@ngx-translate/core';

import { AdminModule } from './admin/admin.module';
import { ClientModule } from './client/client.module';

import { MqttModule } from 'ngx-mqtt';

import { environment } from 'src/environments/environment';


let clientExtraModules = [];

if(environment.mqttBrokenHost) {
  clientExtraModules.push(
    MqttModule.forRoot({
      hostname: environment.mqttBrokenHost,
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
    ComponentsModule,
    AdminModule,
    ClientModule,

    TranslateModule.forRoot(),

    ...clientExtraModules,
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AuthService] },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
