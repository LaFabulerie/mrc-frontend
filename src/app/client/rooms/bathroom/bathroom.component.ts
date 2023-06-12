import { Component, OnInit } from '@angular/core';
import { RemoteControlService } from 'src/app/services/control.service';

@Component({
  selector: 'app-bathroom',
  templateUrl: './bathroom.component.svg',
  styleUrls: ['./bathroom.component.scss']
})
export class BathroomComponent implements OnInit{

  constructor(
    private control: RemoteControlService,
  ) {
  }

  private controlSetup() {
    this.control.showControls = true;
    this.control.showLogo = false;
    this.control.title = 'Salle de bain';
    this.control.navigationBgColor = 'bg-transparent'

  }

  ngOnInit(): void {
    this.control.navigationMode$.subscribe(v => this.controlSetup());
  }

  goToItem(uuid: string){
    this.control.navigate(['item', uuid]);
  }

}
