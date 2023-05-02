import { Injectable } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RemoteControlService {

  private navigationModeSubject: BehaviorSubject<string|undefined> = new BehaviorSubject<string|undefined>(undefined);
  public navitationMode$: Observable<string|undefined> = this.navigationModeSubject.asObservable();

  private navigateToPlanSubject: Subject<string> = new Subject<string>();
  public navigateToPlan$: Observable<string> = this.navigateToPlanSubject.asObservable();

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

  constructor(
    private _mqtt : MqttService
  ) {; // Load all digital uses
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
    this._mqtt.observe('mrc/plan').subscribe((message: IMqttMessage) => {
      console.log('PLAN', message.payload.toString());
      this.navigateToPlanSubject.next(message.payload.toString());
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


  switchNavigationMode(mode:string) {
    this._mqtt.unsafePublish(`mrc/mode`, mode, { qos: 1, retain: true });
  }

  navigate(type: string, data: string|undefined) {
    if(data) {
      this._mqtt.unsafePublish(`mrc/${type}`, data, { qos: 1, retain: true });
    }
  }




}
