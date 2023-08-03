import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Area, DigitalService, DigitalUse, Item, Room } from '../models/core';

@Injectable({
  providedIn: 'root'
})
export class CoreService {


  private digitalUsesSubject = new BehaviorSubject<DigitalUse[]>([]);
  public digitalUses$ = this.digitalUsesSubject.asObservable();

  private roomsSubject = new BehaviorSubject<Room[]>([]);
  public rooms$ = this.roomsSubject.asObservable();

  private defaultFlexFields = {
    expand: ['items', 'items.room'],
    omit : ['description', 'slug', 'tags', 'services', 'items.image', 'items.slug', 'items.room.video', 'items.room.description', 'items.room.items', 'items.room.uses.description']
  }

  constructor(
    private http: HttpClient
  ) {
  }

  getRooms(params?: any): Observable<Room[]> {
    const queryParams = new URLSearchParams(params);
    return this.http.get<Room[]>(`${environment.apiHost}/api/r/rooms/?${queryParams.toString()}`);
  }

  getRoom(uuid: string, params?: any): Observable<Room> {
    const queryParams = new URLSearchParams(params);
    return this.http.get<Room>(`${environment.apiHost}/api/r/rooms/${uuid}/?${queryParams.toString()}`);
  }

  getDigitalUse(uuid: string, params?: any): Observable<DigitalUse> {
    const queryParams = new URLSearchParams(params);
    return this.http.get<DigitalUse>(`${environment.apiHost}/api/r/digital-uses/${uuid}/?${queryParams.toString()}`);
  }

  loadDigitalUses(params?: any) {
    const queryParams = new URLSearchParams(params ? params : this.defaultFlexFields);
    this.http.get<DigitalUse[]>(`${environment.apiHost}/api/r/digital-uses/?${queryParams.toString()}`).subscribe((uses: DigitalUse[]) => {
      this.digitalUsesSubject.next(uses);
    });
  }

  createDigitalUse(data: any): Observable<DigitalUse> {
    return this.http.post<DigitalUse>(`${environment.apiHost}/api/w/digital-uses/`, data);
  }

  updateDigitalUse(useId: number, data: any): Observable<DigitalUse> {
    return this.http.patch<DigitalUse>(`${environment.apiHost}/api/w/digital-uses/${useId}/`, data);
  }

  deleteDigitalUse(useId: number) {
    return this.http.delete(`${environment.apiHost}/api/w/digital-uses/${useId}/`);
  }

  get digitalUses(): DigitalUse[] {
    return this.digitalUsesSubject.value;
  }

  getItem(uuid: string, params?: any) {
    const queryParams = new URLSearchParams(params);
    return this.http.get<Item>(`${environment.apiHost}/api/r/items/${uuid}/?${queryParams.toString()}`);
  }

  getTags(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiHost}/api/r/tags/`);
  }

  getAreas() : Observable<Area[]> {
    return this.http.get<Area[]>(`${environment.apiHost}/api/r/areas/`);
  }

  createArea(data: any): Observable<Area> {
    return this.http.post<Area>(`${environment.apiHost}/api/w/areas/`, data);
  }

  deleteDigitalService(serviceId: number) {
    return this.http.delete(`${environment.apiHost}/api/w/digital-services/${serviceId}/`);
  }

  updateDigitalService(serviceId: number, data: any, params?: any): Observable<DigitalService> {
    const queryParams = new URLSearchParams(params);
    return this.http.patch<DigitalService>(`${environment.apiHost}/api/w/digital-services/${serviceId}/?${queryParams.toString()}`, data);
  }

  createDigitalService(data: any, params?: any): Observable<DigitalService> {
    const queryParams = new URLSearchParams(params);
    return this.http.post<DigitalService>(`${environment.apiHost}/api/w/digital-services/?${queryParams.toString()}`, data);
  }
}
