import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { RemoteControlService } from 'src/app/services/control.service';

@Component({
  selector: 'app-door',
  templateUrl: './home.component.html',
})
export class HomeComponent{

  user?: User;

  navigationModes: any[] = [
    { label: 'Maître', value: 'master' },
    { label: 'Libre', value: 'free' },
  ];

  navigationMode: any;

  constructor(
    private authService: AuthService,
    private control: RemoteControlService,
    private router: Router,
  ) {
    this.authService.user$.subscribe((x) => {
      this.user = x;
      this.navigationMode = 'free';
    });

    this.control.navitationMode$.subscribe((v) => {
      if(!v) return
      this.navigationMode = v;
    });

    this.control.navigateToDoor$.subscribe(v => {
      if(!v) return;
      this.router.navigateByUrl('/door');
    });
  }

  switchNavigationMode(){
    this.control.switchNavigationMode(this.navigationMode);
  }

  goToDoor(){
    if(this.navigationMode == "master"){
      this.control.navigate('door', new Date().toISOString());
    } else {
      this.router.navigateByUrl('/door');
    }
  }







}
