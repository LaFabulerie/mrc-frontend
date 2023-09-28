import { Component, OnInit } from '@angular/core';
import { Room } from 'src/app/models/core';
import { RemoteControlService } from 'src/app/services/control.service';
import { TurningTableDialogComponent } from '../components/turning-table-dialog/turning-table-dialog.component';
import { environment } from 'src/environments/environment';
import { HighlightableComponent } from '../components/highlightable/highlightable.component';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.svg',
  styleUrls: ['./map.component.scss']
})
export class MapComponent extends HighlightableComponent implements OnInit{

  rooms: Room[] = [];
  showBathroom: boolean = false;
  showBedroom: boolean = false;

  constructor(
    private control: RemoteControlService,
    private coreService: CoreService,
  ) {
    super();
    this.controlSetup();
  }

  private controlSetup() {
    this.control.navBarEnabled = true;
    this.control.showMapButton = false;
    this.control.showBackButton = false;
    this.control.showListButton = true;
    this.control.showExitButton = true;
  }

  ngOnInit(): void {
    this.control.navigationMode$.subscribe(v => this.controlSetup());

    this.control.openDialog("VideoDialogComponent", {
      videoURL: `${environment.mediaHost}/static/videos/welcome_mrc.mp4`
    });
  }

  goToRoom(roomName: string, uuid: string){
    if(environment.executionMode === 'standalone' && roomName != 'jardin'){
      this.control.openDialog("TurningTableDialogComponent", {
        next: ['room', roomName, uuid]
      });
    } else {
      this.control.navigate(['room', roomName, uuid]);
    }

  }
}
