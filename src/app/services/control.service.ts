import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RemoteControlService {

  private showControlsSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public showControls$: Observable<boolean> = this.showControlsSubject.asObservable();

  private showLogoSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public showLogo$: Observable<boolean> = this.showLogoSubject.asObservable();

  private navigationBgColorSubject: BehaviorSubject<string> = new BehaviorSubject<string>('bg-white');
  public navigationBgColor$: Observable<string> = this.navigationBgColorSubject.asObservable();

  private bgColorSubject: BehaviorSubject<string> = new BehaviorSubject<string>('bg-white');
  public bgColor$: Observable<string> = this.bgColorSubject.asObservable();

  private titleColorSubject: BehaviorSubject<string> = new BehaviorSubject<string>('text-50');
  public titleColor$: Observable<string> = this.titleColorSubject.asObservable();

  private navigationModeSubject: BehaviorSubject<string> = new BehaviorSubject<string>('free');
  public navigationMode$: Observable<string> = this.navigationModeSubject.asObservable();

  private navigateToSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public navigateTo$: Observable<any> = this.navigateToSubject.asObservable();

  private titleSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public title$: Observable<string> = this.titleSubject.asObservable();

  set title(value: string) {
    this.titleSubject.next(value);
  }

  set showControls(value: boolean) {
    this.showControlsSubject.next(this.isSecondaryMode ? false : value);
  }

  set navigationBgColor(value: string) {
    this.navigationBgColorSubject.next(value);
  }

  set showLogo(value: boolean){
    this.showLogoSubject.next(value);
  }

  set bgColor(value: string) {
    this.bgColorSubject.next(value);
  }

  set titleColor(value: string) {
    this.titleColorSubject.next(value);
  }

  set navigationMode(value: string) {
    this.navigationModeSubject.next(value);
  }

  get navigationMode() {
    return this.navigationModeSubject.value;
  }

  get isSecondaryMode() {
    return this.navigationMode === 'secondary';
  }

  navigate(url: string[], state?: any) {
    this.navigateToSubject.next({url: url, state: state || {}});
  }

}
