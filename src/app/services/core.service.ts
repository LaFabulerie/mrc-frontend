import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Area, DigitalService, DigitalUse, Item, Room } from '../models/core';

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
    this.http.get<Room[]>(`${environment.apiHost}/r/rooms/?${queryParams.toString()}`).subscribe((rooms: Room[]) => {
      this.roomsSubject.next(rooms);
    });
  }


  getDistanceBetweenRooms(room1: Room, room2: Room): any {
    return this.http.get(`${environment.apiHost}/r/rooms/distance/?from=${room1.uuid}&to=${room1.uuid}`);
  }

  updateRoom(uuid:string, data:any): Observable<Room> {
    return this.http.patch<Room>(`${environment.apiHost}/r/rooms/${uuid}/`, data);
  }

  loadDigitalUses() {
    const queryParams = new URLSearchParams({
      expand: ['items', 'items.room', 'services.use', 'services.area'].join(','),
      omit : ['slug',
              'item_ids', 'services.use_id',
              'items.image', 'items.slug',
              'items.room.video', 'items.room.description',
              'items.room.items', 'items.room.uses.description'].join(',')
    });
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


  loadItems() {
    console.log('loadItems')
    const queryParams = new URLSearchParams({
      expand: ['uses', 'room'].join(','),
      fields: ['name', 'uses', 'room.uuid', 'room.main_color', 'image', 'uuid', 'light_ctrl', 'light_pin'].join(',')
    });
    this.http.get<Item[]>(`${environment.apiHost}/r/items/?${queryParams.toString()}`).pipe(
      map(results => {
        return results.map(item => {
          item.image = `${environment.mediaHost}${item.image}` ;
          return item;
        })
      }))
    .subscribe((items: Item[]) => {
      this.itemsSubject.next(items);
    });
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
