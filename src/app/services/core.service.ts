import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DigitalService, DigitalUse, Item, Room } from '../models/core';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  private roomsSubject = new BehaviorSubject<Room[]>([]);
  public rooms$ = this.roomsSubject.asObservable();

  private itemsSubject = new BehaviorSubject<Item[]>([]);
  public items$ = this.itemsSubject.asObservable();

  private digitalUsesSubject = new BehaviorSubject<DigitalUse[]>([]);
  public digitalUses$ = this.digitalUsesSubject.asObservable();

  constructor(
    private http: HttpClient
  ) {
  }

  get rooms(): Room[] {
    return this.roomsSubject.value;
  }

  loadRooms() {
    const queryParams = new URLSearchParams({
      expand : ['items', 'items.room'].join(','),
    });
    this.http.get<Room[]>(`${environment.serverHost}/api/r/rooms/?${queryParams.toString()}`).subscribe((rooms: Room[]) => {
      this.roomsSubject.next(rooms);
    });
  }


  getDistanceBetweenRooms(room1: Room, room2: Room): any {
    return this.http.get(`${environment.serverHost}/api/r/rooms/distance/?from=${room1.uuid}&to=${room2.uuid}`);
  }

  updateRoom(uuid:string, data:any): Observable<Room> {
    return this.http.patch<Room>(`${environment.serverHost}/api/r/rooms/${uuid}/`, data);
  }

  loadDigitalUses() {
    const queryParams = new URLSearchParams({
      expand: ['items', 'items.room', 'services.use'].join(','),
      omit : ['slug',
              'services.use_id', 'items.slug',
              'items.room.video', 'items.room.description',
              'items.room.items', 'items.room.uses.description'].join(',')
    });
    this.http.get<DigitalUse[]>(`${environment.serverHost}/api/r/digital-uses/?${queryParams.toString()}`).pipe(
      map(results => {
        return results.map(use => {
          use.items[0].image = `${environment.serverHost}${use.items[0].image}` ;
          return use;
        })
      }))
    .subscribe((uses: DigitalUse[]) => {
      this.digitalUsesSubject.next(uses);
    });
  }

  createDigitalUse(data: any): Observable<DigitalUse> {
    return this.http.post<DigitalUse>(`${environment.serverHost}/api/w/digital-uses/`, data);
  }

  updateDigitalUse(useId: number, data: any): Observable<DigitalUse> {
    return this.http.patch<DigitalUse>(`${environment.serverHost}/api/w/digital-uses/${useId}/`, data);
  }

  deleteDigitalUse(useId: number) {
    return this.http.delete(`${environment.serverHost}/api/w/digital-uses/${useId}/`);
  }

  get digitalUses(): DigitalUse[] {
    return this.digitalUsesSubject.value;
  }


  loadItems() {
    const queryParams = new URLSearchParams({
      expand: ['uses', 'room'].join(','),
      fields: ['id', 'name', 'uses', 'room.uuid', 'room.main_color', 'image', 'uuid', 'light_ctrl', 'light_pin'].join(',')
    });
    this.http.get<Item[]>(`${environment.serverHost}/api/r/items/?${queryParams.toString()}`).pipe(
      map(results => {
        return results.map(item => {
          item.image = `${environment.serverHost}${item.image}` ;
          return item;
        })
      }))
    .subscribe((items: Item[]) => {
      this.itemsSubject.next(items);
    });
  }

  updateItem(uuid: string, data: any): Observable<Item> {
    return this.http.patch<Item>(`${environment.serverHost}/api/w/items/${uuid}/`, data);
  }

  getTags(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.serverHost}/api/r/tags/`);
  }

  deleteDigitalService(serviceId: number) {
    return this.http.delete(`${environment.serverHost}/api/w/digital-services/${serviceId}/`);
  }

  updateDigitalService(serviceId: number, data: any, params?: any): Observable<DigitalService> {
    const queryParams = new URLSearchParams(params);
    return this.http.patch<DigitalService>(`${environment.serverHost}/api/w/digital-services/${serviceId}/?${queryParams.toString()}`, data);
  }

  createDigitalService(data: any, params?: any): Observable<DigitalService> {
    const queryParams = new URLSearchParams(params);
    return this.http.post<DigitalService>(`${environment.serverHost}/api/w/digital-services/?${queryParams.toString()}`, data);
  }

  exportServices(uuids: string[]): Observable<Blob> {
    return this.http.post(`${environment.serverHost}/api/r/export/`, {uuids : uuids} ,{responseType: 'blob'});
  }
}
