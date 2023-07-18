import { Component } from '@angular/core';
import { RemoteControlService } from 'src/app/services/control.service';

@Component({
  selector: 'app-bedroom',
  templateUrl: './bedroom.component.svg',
  styleUrls: ['./bedroom.component.scss']
})
export class BedroomComponent {
  constructor(
    private control: RemoteControlService,
  ) {
  }

  private controlSetup() {
    this.control.showMapButton = true;
    this.control.showBackButton = true;
    this.control.showListButton = true;
    this.control.showExitButton = true;
    this.control.showLogo = true;
    this.control.title = '';

  }

  ngOnInit(): void {
    this.control.navigationMode$.subscribe(v => this.controlSetup());
  }

  goToItem(uuid: string){
    this.control.navigate(['item', uuid]);
  }
}
