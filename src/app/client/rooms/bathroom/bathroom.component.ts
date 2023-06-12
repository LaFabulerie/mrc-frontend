import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RemoteControlService } from 'src/app/services/control.service';

@Component({
  selector: 'app-bathroom',
  templateUrl: './bathroom.component.svg',
  styleUrls: ['./bathroom.component.scss']
})
export class BathroomComponent implements OnInit{

  constructor(
    private control: RemoteControlService,
    private router: Router,
  ) {
  }

  private controlSetup() {
    this.control.showControls = true;
    this.control.showLogo = false;
    this.control.title = 'Salle de bain';
    this.control.currentBackUrl = '/map';
    this.control.navigationBgColor = 'bg-transparent'

  }

  ngOnInit(): void {
    this.control.navigationMode$.subscribe(v => this.controlSetup());
  }

  goToItem(uuid: string){
    const url = ['item', uuid]
    const state = { back: this.router.url }
    this.control.navigateTo(url, state);
    this.router.navigate(url, {state: state});
  }

}
