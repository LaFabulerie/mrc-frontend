import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RemoteControlService {

  private showMapButtonSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public showMapButton$: Observable<boolean> = this.showMapButtonSubject.asObservable();

  private showBackButtonSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public showBackButton$: Observable<boolean> = this.showBackButtonSubject.asObservable();

  private showListButtonSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public showListButton$: Observable<boolean> = this.showListButtonSubject.asObservable();

  private showExitButtonSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public showExitButton$: Observable<boolean> = this.showExitButtonSubject.asObservable();

  private showLogoSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public showLogo$: Observable<boolean> = this.showLogoSubject.asObservable();

  private bgColorSubject: BehaviorSubject<string> = new BehaviorSubject<string>('bg-white');
  public bgColor$: Observable<string> = this.bgColorSubject.asObservable();

  private titleColorSubject: BehaviorSubject<string> = new BehaviorSubject<string>('text-50');
  public titleColor$: Observable<string> = this.titleColorSubject.asObservable();

  private titleSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public title$: Observable<string> = this.titleSubject.asObservable();

  private navigationModeSubject: BehaviorSubject<string> = new BehaviorSubject<string>('free');
  public navigationMode$: Observable<string> = this.navigationModeSubject.asObservable();

  private navigateToSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public navigateTo$: Observable<any> = this.navigateToSubject.asObservable();

  private dialogSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public dialog$: Observable<any> = this.dialogSubject.asObservable();

  set title(value: string) {
    this.titleSubject.next(value);
  }

  set showMapButton(value: boolean) {
    this.showMapButtonSubject.next(this.isSecondaryMode ? false : value);
  }

  set showBackButton(value: boolean) {
    this.showBackButtonSubject.next(this.isSecondaryMode ? false : value);
  }

  set showListButton(value: boolean) {
    this.showListButtonSubject.next(this.isSecondaryMode ? false : value);
  }

  set showExitButton(value: boolean) {
    this.showExitButtonSubject.next(this.isSecondaryMode ? false : value);
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
    localStorage.setItem('navigationMode', value);
    this.navigationModeSubject.next(value);
  }

  get navigationMode() {
    return this.navigationModeSubject.value;
  }

  get isSecondaryMode() {
    return this.navigationMode === 'secondary';
  }

  navigate(url: string[], state?: any) {
    this.bgColor = '#ffffff';
    this.navigateToSubject.next({url: url, state: state || {}});
  }

  stopNavigate() {
    this.navigateToSubject.next(null);
  }

  openDialog(dialogClass: any, data: any) {
    this.dialogSubject.next({name : dialogClass.name, data: data});
  }

  closeDialog() {
    this.dialogSubject.next(null);
  }

}
