import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { RemoteControlService } from 'src/app/services/control.service';

@Component({
  selector: 'app-door',
  templateUrl: './door.component.svg',
  styleUrls: ['./door.component.scss']
})
export class DoorComponent implements OnInit{

  navigationMode: string|undefined = undefined;
  user?: User;

  normalFillColor = "#8da6ff";
  activeFillColor = "#f5b351";
  currentFillColor = "";

  constructor(
    private control: RemoteControlService,
    private dialogService: DialogService,
    private router: Router,
    private auth: AuthService,
  ) {
    this.currentFillColor = this.normalFillColor;
    control.disableNavigation();

    this.user = this.auth.userValue;

    this.control.navitationMode$.subscribe((v) => {
      console.log("DOOR navigationMode", v)
      if(v) {
        this.navigationMode = v
      }
    });
  }

  ngOnInit(): void {
    this.control.navigateToMap$.subscribe(v => {
      if(!v) return;
      this.router.navigateByUrl('/map');
    })
  }

  openWelcomeVideoDialog() {
    // this.dialogService.open(WelcomeVideoDialogComponent, {
    //   closeOnEscape: false,
    //   closable: false,
    // });
  }

  gotToMap(){
    this.router.navigateByUrl('/map');
  }

}
