import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { User } from 'src/app/models/user';
import { RemoteControlService } from 'src/app/services/control.service';

@Component({
  selector: 'app-door',
  templateUrl: './door.component.svg',
  styleUrls: ['./door.component.scss']
})
export class DoorComponent implements OnInit{

  normalFillColor = "#8da6ff";
  activeFillColor = "#f5b351";
  currentFillColor = "";

  constructor(
    private control: RemoteControlService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.currentFillColor = this.normalFillColor;
    this.control.showControls = false;
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
