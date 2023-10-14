import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from './services/auth.service';
import { RemoteControlService } from './services/control.service';
import { TranslateService } from '@ngx-translate/core';
import { User } from './models/user';
import { Title } from '@angular/platform-browser';
import {environment} from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [
    Title
  ]
})
export class AppComponent implements OnInit {
  user?: User | null;
  navigationMode: string|null = null;

  constructor(
    private primengConfig: PrimeNGConfig,
    private authService: AuthService,
    private translateService: TranslateService,
    private control: RemoteControlService,
  ) {
    this.authService.user$.subscribe((x) => (this.user = x));
    if(!environment.production) {
      this.control.navigationMode$.subscribe((m) => (this.navigationMode = m));
    }
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.translateService.setDefaultLang('fr');
  }
}
