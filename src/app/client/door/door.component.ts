import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    private route: ActivatedRoute,
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

  goToMap(){
    const scope = this.route.snapshot.params['scope'];
    this.control.navigate(scope ? ['map', scope ? scope : ''] : ['map']);
  }

}
