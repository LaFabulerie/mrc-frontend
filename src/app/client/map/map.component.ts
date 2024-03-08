import { Component, OnInit } from '@angular/core';
import { Room } from 'src/app/models/core';
import { ActivatedRoute } from '@angular/router';
import { RemoteControlService } from 'src/app/services/control.service';
import { environment } from 'src/environments/environment';
import { HighlightableComponent } from '../components/highlightable/highlightable.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.svg',
  styleUrls: ['./map.component.scss']
})
export class MapComponent extends HighlightableComponent implements OnInit{

  rooms: Room[] = [];

  constructor(
    private control: RemoteControlService,
    private route: ActivatedRoute,
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

    for(let i = 0; i < localStorage.length; i++){
      let key = localStorage.key(i);
      if(key?.startsWith('video-room-')){
        localStorage.removeItem(key);
      }
    }

    let videoAlreadyViewed = localStorage.getItem(`video-intro`) !== null
    if(!videoAlreadyViewed) {
      localStorage.setItem(`video-intro`, 'true');
      this.control.openDialog("VideoDialogComponent", {
        videoURL: `${environment.serverHost}/static/videos/intro.mp4`
      });
    }
  }

  goToRoom(roomName: string, uuid: string){
    const scope = this.route.snapshot.params['scope'];
    if(!environment.houseless && roomName != 'jardin'){
      this.control.openDialog("TurningTableDialogComponent", {
        next: scope ? ['room', roomName, scope, uuid] : ['room', roomName, uuid]
      });
    } else {
      this.control.navigate(scope? ['room', roomName, scope, uuid] : ['room', roomName, uuid]);
    }

  }
}
