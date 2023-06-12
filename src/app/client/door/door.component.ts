import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    this.controlSetup();
  }

  private  controlSetup() {
    this.currentFillColor = this.normalFillColor;
    this.control.showControls = false;
    this.control.title = '';
    this.control.bgColor = 'surface-ground';
  }

  ngOnInit(): void {
    this.control.navigationMode$.subscribe(v => this.controlSetup());
  }

  openWelcomeVideoDialog() {
    // this.dialogService.open(WelcomeVideoDialogComponent, {
    //   closeOnEscape: false,
    //   closable: false,
    // });
  }

  gotToMap(){
    const url = ['map']
    this.control.navigateTo(url, {});
    this.router.navigate(url);
  }

}
