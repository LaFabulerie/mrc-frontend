import { Component, OnInit } from '@angular/core';
import { RemoteControlService } from 'src/app/services/control.service';
import { HighlightableComponent } from '../components/highlightable/highlightable.component';

@Component({
  selector: 'app-door',
  templateUrl: './door.component.svg',
  styleUrls: ['./door.component.scss']
})
export class DoorComponent extends HighlightableComponent implements OnInit{

  normalFillColor = "#8da6ff";
  activeFillColor = "#f5b351";
  currentFillColor = "";

  constructor(
    private control: RemoteControlService,
  ) {
    super();
    this.controlSetup();
  }

  private  controlSetup() {
    this.currentFillColor = this.normalFillColor;
    this.control.showMapButton = false;
    this.control.showBackButton = false;
    this.control.showListButton = false;
    this.control.showExitButton = false;
    this.control.bgColor = '#FFFFFF';
    this.control.navBarEnabled = false;
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

  goToMap(){
    this.control.navigate(['map']);
  }

}
