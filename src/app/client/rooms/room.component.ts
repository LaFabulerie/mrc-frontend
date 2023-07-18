import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RemoteControlService } from 'src/app/services/control.service';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-room',
  template: `<p>Room</p>`,
  styleUrls: ['./room.component.scss']
})
export class BaseRoomComponent implements OnInit, AfterViewInit{

  _currentHighLight: string = '';
  loading: boolean = true;

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

  }

  set currentHighLight(value: string) {
    console.log(value)
    this._currentHighLight = value;
  }

  activate(value: string) {
    this.currentHighLight = value;
  }

  release(value: string) {
    this.currentHighLight = '';
  }

  isActive(value: string): boolean {
    console.log("isActive", this._currentHighLight, value)
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
        this.control.bgColor = room.mainColor;
        this.loading = false;
        // this.control.openDialog(VideoDialogComponent, {
        //   videoURL: room.video
        // });
      })
    });
  }


  goToItem(uuid: string){
    this.control.navigate(['item', uuid]);
  }

}
