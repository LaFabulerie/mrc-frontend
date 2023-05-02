import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { RemoteControlService } from 'src/app/services/control.service';

@Component({
  selector: 'app-door',
  templateUrl: './door.component.html',
  styleUrls: ['./door.component.scss']
})
export class DoorComponent implements OnInit{

  navigationMode: string|undefined = undefined;
  user?: User;

  constructor(
    private control: RemoteControlService,
    private router: Router,
    private auth: AuthService,
  ) {
    this.user = this.auth.userValue;

    this.control.navitationMode$.subscribe((v) => {
      console.log("DOOR navigationMode", v)
      if(v) {
        this.navigationMode = v
      }
    });
  }

  ngOnInit(): void {
    this.control.navigateToPlan$.subscribe(v => {
      if(!v) return;
      this.router.navigateByUrl('/plan');
    })
  }

  gotToPlan(){
    if(this.navigationMode == "master"){
      this.control.navigate('plan', new Date().toISOString());
    } else {
      this.router.navigateByUrl('/plan');
    }
  }

}
