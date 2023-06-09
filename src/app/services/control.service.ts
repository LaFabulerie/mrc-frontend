import { Injectable, Injector } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RemoteControlService {

  private showControlsSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public showControls$: Observable<boolean> = this.showControlsSubject.asObservable();

  private logoVisibleSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public logoVisible$: Observable<boolean> = this.logoVisibleSubject.asObservable();

  private transparentNavigationSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public transparentNavigation$: Observable<boolean> = this.transparentNavigationSubject.asObservable();

  private navigationModeSubject: BehaviorSubject<string|undefined> = new BehaviorSubject<string|undefined>(undefined);
  public navitationMode$: Observable<string|undefined> = this.navigationModeSubject.asObservable();

  private navigateToMapSubject: Subject<string> = new Subject<string>();
  public navigateToMap$: Observable<string> = this.navigateToMapSubject.asObservable();

  private navigateToDoorSubject: Subject<string> = new Subject<string>();
  public navigateToDoor$: Observable<string|undefined> = this.navigateToDoorSubject.asObservable();

  private navigateToRoomSubject: Subject<string> = new Subject<string>();
  public navigateToRoom$: Observable<string|undefined> = this.navigateToRoomSubject.asObservable();

  private navigateToItemSubject: Subject<string> = new Subject<string>();
  public navigateToItem$: Observable<string|undefined> = this.navigateToItemSubject.asObservable();

  private navigateToDigitalUseSubject: Subject<string> = new Subject<string>();
  public navigateToDigitalUse$: Observable<string|undefined> = this.navigateToDigitalUseSubject.asObservable();

  private currentBackUrlSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public currentBackUrl$: Observable<string> = this.currentBackUrlSubject.asObservable();


  set showControls(value: boolean) {
    this.showControlsSubject.next(value);
  }

  set currentBackUrl(value: string) {
    this.currentBackUrlSubject.next(value);
  }

  set transparentNavigation(value: boolean) {
    this.transparentNavigationSubject.next(value);
  }

  set showLogo(value: boolean){
    this.logoVisibleSubject.next(value);
  }

  private _mqtt : MqttService | undefined

  constructor(
    private injector: Injector

  ) {

    if(environment.mqttBrokenHost) {
      this._mqtt = <MqttService>this.injector.get(MqttService);
      this._mqtt.observe('mrc/mode').subscribe((message: IMqttMessage) => {
        console.log('NAVIGATION MODE', message.payload.toString());
        this.navigationModeSubject.next(message.payload.toString());
      });
      this._mqtt.observe('mrc/room').subscribe((message: IMqttMessage) => {
        console.log('ROOM', message.payload.toString());
        this.navigateToRoomSubject.next(message.payload.toString());
      });
      this._mqtt.observe('mrc/item').subscribe((message: IMqttMessage) => {
        console.log('ITEM', message.payload.toString());
        this.navigateToRoomSubject.next(message.payload.toString());
      });
      this._mqtt.observe('mrc/map').subscribe((message: IMqttMessage) => {
        console.log('MAP', message.payload.toString());
        this.navigateToMapSubject.next(message.payload.toString());
      });
      this._mqtt.observe('mrc/door').subscribe((message: IMqttMessage) => {
        console.log('DOOR', message.payload.toString());
        this.navigateToDoorSubject.next(message.payload.toString());
      });
      this._mqtt.observe('mrc/use').subscribe((message: IMqttMessage) => {
        console.log('USE', message.payload.toString());
        this.navigateToDigitalUseSubject.next(message.payload.toString());
      });
    }

  }


  switchNavigationMode(mode:string) {
    if(this._mqtt) {
      this._mqtt.unsafePublish(`mrc/mode`, mode, { qos: 1, retain: true });
    };
  }

  // navigate(type: string, data: string|undefined) {
  //   if(this._mqtt && data) {
  //     this._mqtt.unsafePublish(`mrc/${type}`, data, { qos: 1, retain: true });
  //   }
  // }




}
