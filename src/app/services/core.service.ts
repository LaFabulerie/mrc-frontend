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
    return this.http.get<Room[]>(`${environment.apiHost}/r/rooms/?${queryParams.toString()}`);
  }

  getRoom(uuid: string, params?: any): Observable<Room> {
    const queryParams = new URLSearchParams(params);
    return this.http.get<Room>(`${environment.apiHost}/r/rooms/${uuid}/?${queryParams.toString()}`);
  }

  updateRoom(uuid:string, data:any): Observable<Room> {
    return this.http.patch<Room>(`${environment.apiHost}/r/rooms/${uuid}/`, data);
  }


  getDigitalUse(uuid: string, params?: any): Observable<DigitalUse> {
    const queryParams = new URLSearchParams(params);
    return this.http.get<DigitalUse>(`${environment.apiHost}/r/digital-uses/${uuid}/?${queryParams.toString()}`);
  }

  loadDigitalUses(params?: any) {
    const queryParams = new URLSearchParams(params ? params : this.defaultFlexFields);
    this.http.get<DigitalUse[]>(`${environment.apiHost}/r/digital-uses/?${queryParams.toString()}`).subscribe((uses: DigitalUse[]) => {
      this.digitalUsesSubject.next(uses);
    });
  }

  createDigitalUse(data: any): Observable<DigitalUse> {
    return this.http.post<DigitalUse>(`${environment.apiHost}/w/digital-uses/`, data);
  }

  updateDigitalUse(useId: number, data: any): Observable<DigitalUse> {
    return this.http.patch<DigitalUse>(`${environment.apiHost}/w/digital-uses/${useId}/`, data);
  }

  deleteDigitalUse(useId: number) {
    return this.http.delete(`${environment.apiHost}/w/digital-uses/${useId}/`);
  }

  get digitalUses(): DigitalUse[] {
    return this.digitalUsesSubject.value;
  }

  getItem(uuid: string, params?: any) {
    const queryParams = new URLSearchParams(params);
    return this.http.get<Item>(`${environment.apiHost}/r/items/${uuid}/?${queryParams.toString()}`);
  }

  updateItem(uuid: string, data: any): Observable<Item> {
    return this.http.patch<Item>(`${environment.apiHost}/w/items/${uuid}/`, data);
  }

  getTags(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiHost}/r/tags/`);
  }

  getAreas() : Observable<Area[]> {
    return this.http.get<Area[]>(`${environment.apiHost}/r/areas/`);
  }

  createArea(data: any): Observable<Area> {
    return this.http.post<Area>(`${environment.apiHost}/w/areas/`, data);
  }

  deleteDigitalService(serviceId: number) {
    return this.http.delete(`${environment.apiHost}/w/digital-services/${serviceId}/`);
  }

  updateDigitalService(serviceId: number, data: any, params?: any): Observable<DigitalService> {
    const queryParams = new URLSearchParams(params);
    return this.http.patch<DigitalService>(`${environment.apiHost}/w/digital-services/${serviceId}/?${queryParams.toString()}`, data);
  }

  createDigitalService(data: any, params?: any): Observable<DigitalService> {
    const queryParams = new URLSearchParams(params);
    return this.http.post<DigitalService>(`${environment.apiHost}/w/digital-services/?${queryParams.toString()}`, data);
  }
}
