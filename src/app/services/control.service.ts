import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RemoteControlService {

  private showMapButtonSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public showMapButton$: Observable<boolean> = this.showMapButtonSubject.asObservable();

  private showBackButtonSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public showBackButton$: Observable<boolean> = this.showBackButtonSubject.asObservable();

  private showListButtonSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public showListButton$: Observable<boolean> = this.showListButtonSubject.asObservable();

  private showExitButtonSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public showExitButton$: Observable<boolean> = this.showExitButtonSubject.asObservable();

  private bgColorSubject: BehaviorSubject<string> = new BehaviorSubject<string>('bg-white');
  public bgColor$: Observable<string> = this.bgColorSubject.asObservable();

  private navigationModeSubject: BehaviorSubject<string> = new BehaviorSubject<string>('free');
  public navigationMode$: Observable<string> = this.navigationModeSubject.asObservable();

  private navigateToSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public navigateTo$: Observable<any> = this.navigateToSubject.asObservable();

  private dialogSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public dialog$: Observable<any> = this.dialogSubject.asObservable();


  set showMapButton(value: boolean) {
    this.showMapButtonSubject.next(this.navigationMode === 'secondary' ? false : value);
  }

  set showBackButton(value: boolean) {
    this.showBackButtonSubject.next(this.navigationMode === 'secondary' ? false : value);
  }

  set showListButton(value: boolean) {
    this.showListButtonSubject.next(this.navigationMode === 'secondary' ? false : value);
  }

  set showExitButton(value: boolean) {
    this.showExitButtonSubject.next(this.navigationMode === 'secondary' ? false : value);
  }


  set bgColor(value: string) {
    this.bgColorSubject.next(value);
  }

  get showExitButton() {
    return this.showExitButtonSubject.value;
  }

  get showMapButton() {
    return this.showMapButtonSubject.value;
  }

  get showBackButton() {
    return this.showBackButtonSubject.value;
  }

  get showListButton() {
    return this.showListButtonSubject.value;
  }

  set navigationMode(value: string) {
    this.navigationModeSubject.next(value);
  }

  get navigationMode() {
    return this.navigationModeSubject.value;
  }

  navigate(url: string[], state?: any) {
    this.navigateToSubject.next({url: url, state: state || {}});
  }

  stopNavigate() {
    this.navigateToSubject.next(null);
  }

  openDialog(dialogClass: any, data: any) {
    this.dialogSubject.next({action : 'open', name : dialogClass.name, data: data});
  }

  closeDialog(dialogClass: any, next?: string[]) {
    this.dialogSubject.next({action : 'close', name : dialogClass.name, data: {next: next}});
  }

}
