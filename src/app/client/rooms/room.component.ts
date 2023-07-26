import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RemoteControlService } from 'src/app/services/control.service';
import { CoreService } from 'src/app/services/core.service';
import { VideoDialogComponent } from '../components/video-dialog/video-dialog.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-room',
  template: `<p>Room</p>`,
  styleUrls: ['./room.component.scss']
})
export class BaseRoomComponent implements OnInit, AfterViewInit{

  _currentHighLight: string = '';
  loading: boolean = true;
  mainColor: string = '';

  constructor(
    private control: RemoteControlService,
    private activatedRoute: ActivatedRoute,
    private coreService: CoreService,
  ) {

  }

  private controlSetup() {
    this.control.showMapButton = true;
    this.control.showBackButton = true;
    this.control.showListButton = true;
    this.control.showExitButton = true;
    this.control.showLogo = true;
    this.control.title = '';
    this.control.bgColor = this.mainColor;

  }

  set currentHighLight(value: string) {
    this._currentHighLight = value;
  }

  activate(value: string) {
    this.currentHighLight = value;
  }

  release(value: string) {
    this.currentHighLight = '';
  }

  isActive(value: string): boolean {
    return this._currentHighLight === value;
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
    this.control.navigate(['item', uuid]);
  }

}
