import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './pages/auth/auth.module';

import {StyleClassModule} from 'primeng/styleclass';

import { appInitializer } from './common/app.initializer';
import { AuthService } from './services/auth.service';
import { JwtInterceptor } from './common/jwt.interceptor';
import { ErrorInterceptor } from './common/error.interceptor';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { HomeComponent } from './pages/home/home.component';
import { ComponentsModule } from './components/components.module';
import { TreeModule } from 'primeng/tree';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SettingsComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    StyleClassModule,
    AuthModule,
    ComponentsModule,
    TreeModule,

  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AuthService] },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
