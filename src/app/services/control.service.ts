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

  private navigationBgColorSubject: BehaviorSubject<string> = new BehaviorSubject<string>('bg-white');
  public navigationBgColor$: Observable<string> = this.navigationBgColorSubject.asObservable();

  private bgColorSubject: BehaviorSubject<string> = new BehaviorSubject<string>('bg-white');
  public bgColor$: Observable<string> = this.bgColorSubject.asObservable();

  private titleColorSubject: BehaviorSubject<string> = new BehaviorSubject<string>('text-50');
  public titleColor$: Observable<string> = this.titleColorSubject.asObservable();

  private navigationModeSubject: BehaviorSubject<string> = new BehaviorSubject<string>('free');
  public navigationMode$: Observable<string> = this.navigationModeSubject.asObservable();

  private navigateToSubject: BehaviorSubject<string> = new BehaviorSubject<any>(null);
  public navigateTo$: Observable<any> = this.navigateToSubject.asObservable();

  private currentBackUrlSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public currentBackUrl$: Observable<string> = this.currentBackUrlSubject.asObservable();

  private titleSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public title$: Observable<string> = this.titleSubject.asObservable();

  set title(value: string) {
    this.titleSubject.next(value);
  }

  set showControls(value: boolean) {
    this.showControlsSubject.next(this.isSecondaryMode ? false : value);
  }

  set currentBackUrl(value: string) {
    this.currentBackUrlSubject.next(this.isSecondaryMode ? '' : value);
  }

  set navigationBgColor(value: string) {
    this.navigationBgColorSubject.next(value);
  }

  set showLogo(value: boolean){
    this.logoVisibleSubject.next(value);
  }

  set bgColor(value: string) {
    this.bgColorSubject.next(value);
  }

  set titleColor(value: string) {
    this.titleColorSubject.next(value);
  }

  set navigationMode(value: string) {
    this.navigationModeSubject.next(value); // must be called before _mqtt is set
    if(this._mqtt) {
      this._mqtt.unsafePublish(`mrc/mode`, value === 'primary' ? 'secondary' : 'free' , { qos: 1, retain: true });
    }
  }

  get navigationMode() {
    return this.navigationModeSubject.value;
  }

  get isSecondaryMode() {
    return this.navigationMode === 'secondary';
  }

  private _mqtt : MqttService | undefined

  constructor(
    private injector: Injector

  ) {

    if(environment.mqttBrokenHost) {
      this._mqtt = <MqttService>this.injector.get(MqttService);
      this._mqtt.observe('mrc/mode').subscribe((message: IMqttMessage) => {
        const mode = message.payload.toString();
        if(this.navigationMode === 'primary') return
        this.navigationModeSubject.next(mode);
      });

      this._mqtt.observe('mrc/nav').subscribe((message: IMqttMessage) => {
        if(this.navigationMode === 'secondary') {
          const nav = JSON.parse(String.fromCharCode(...new Uint8Array(message.payload)));
          this.navigateToSubject.next(nav);
        }
      });
    }

  }

  navigateTo(url: string[], state: any) {
    if(this._mqtt) {
      this._mqtt.unsafePublish(`mrc/nav`, JSON.stringify({url: url, state: state}), { qos: 1, retain: true });
    }
  }

}
