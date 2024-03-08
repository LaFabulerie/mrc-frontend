import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RemoteControlService } from 'src/app/services/control.service';
import { CoreService } from 'src/app/services/core.service';
import { VideoDialogComponent } from '../components/video-dialog/video-dialog.component';
import { environment } from 'src/environments/environment';
import { HighlightableComponent } from '../components/highlightable/highlightable.component';

@Component({
  selector: 'app-room',
  template: `<p>Room</p>`,
})
export class BaseRoomComponent extends HighlightableComponent implements OnInit, AfterViewInit{

  loading: boolean = true;
  mainColor: string = '';

  constructor(
    private control: RemoteControlService,
    private activatedRoute: ActivatedRoute,
    private coreService: CoreService,
  ) {
    super();
  }

  private controlSetup() {
    this.control.navBarEnabled = true;
    this.control.showMapButton = true;
    this.control.showBackButton = true;
    this.control.showListButton = true;
    this.control.showExitButton = true;
    this.control.bgColor = this.mainColor;

  }


  ngOnInit(): void {
    this.control.navigationMode$.subscribe(v => this.controlSetup());
  }

  ngAfterViewInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const uuid = params['uuid'];
      this.coreService.rooms$.subscribe(rooms => {
        if(!rooms || rooms.length == 0) return;
        const room = rooms.find(room => room.uuid === uuid);

        this.control.currentItem = null;
        this.mainColor = room!.mainColor;
        this.control.bgColor = this.mainColor;
        this.loading = false;
        let videoAlreadyViewed = localStorage.getItem(`video-room-${uuid}`) !== null
        if(room!.video && !videoAlreadyViewed) {
          localStorage.setItem(`video-room-${uuid}`, 'true');
          this.control.openDialog("VideoDialogComponent", {
            videoURL: `${environment.serverHost}${room!.video}`
          });
        }
      });
    });
  }


  goToItem(uuid: string){
    const scope = this.activatedRoute.snapshot.params['scope'];
    this.coreService.items$.subscribe(items => {
      if(!items || items.length == 0) return;
      const item = items.find(item => item.uuid === uuid);
      this.control.navigate(scope ? ['item', scope, uuid] : ['item', uuid], item);
    });
  }

}
