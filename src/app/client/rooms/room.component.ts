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
  styleUrls: ['./room.component.scss']
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
      this.coreService.getRoom(uuid, {
        fields: ["video", 'main_color']
      }).subscribe(room => {
        this.control.currentItem = null;
        this.mainColor = room.mainColor;
        this.control.bgColor = this.mainColor;
        this.loading = false;
        if(room.video) {
          this.control.openDialog(VideoDialogComponent, {
            videoURL: `${environment.apiHost}${room.video}`
          });
        }
      })
    });
  }


  goToItem(uuid: string){
    this.coreService.getItem(uuid, {
      fields: ['light_ctrl', 'light_pin']
    }).subscribe(item => {
      this.control.navigate(['item', uuid], item);
    });
  }

}
