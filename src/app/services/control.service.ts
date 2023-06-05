import { Injectable, Injector } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RemoteControlService {

  private activatedNavigationSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public activatedNavigation$: Observable<boolean> = this.activatedNavigationSubject.asObservable();

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

  get navigationMode() {
    return this.navigationModeSubject.value;
  }

  enableNavigation() {
    this.activatedNavigationSubject.next(true);
  }

  disableNavigation() {
    this.activatedNavigationSubject.next(false);
  }

  get activatedNavigation() {
    return this.activatedNavigationSubject.value;
  }

  set transparentNavigation(value: boolean) {
    this.transparentNavigationSubject.next(value);
  }

  get transparentNavigation() {
    return this.transparentNavigationSubject.value;
  }

  hideLogo(){
    this.logoVisibleSubject.next(false);
  }

  showLogo(){
    this.logoVisibleSubject.next(true);
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
