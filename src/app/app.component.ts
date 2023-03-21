import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { User } from 'src/models/user';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  user?: User | null;

  constructor(
    private primengConfig: PrimeNGConfig,
    private authService: AuthService
  ) {
    this.authService.user.subscribe((x) => (this.user = x));
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  logout() {
    this.authService.logout();
  }
}
