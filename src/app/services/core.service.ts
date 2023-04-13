import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Area, DigitalService, DigitalUse } from '../models/use';

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
    this.loadDigitalUses(); // Load all digital uses
  }


  getRooms(params?: any) {
    const queryParams = new URLSearchParams(params);
    return this.http.get(`${environment.apiHost}/api/rooms/?${queryParams.toString()}`);
  }

  getDigitalUse(useId: number, params?: any) {
    const queryParams = new URLSearchParams(params);
    return this.http.get(`${environment.apiHost}/api/digital-uses/${useId}/?${queryParams.toString()}`);
  }

  loadDigitalUses(params?: any) {
    const queryParams = new URLSearchParams(params ? params : this.defaultFlexFields);
    this.http.get<DigitalUse[]>(`${environment.apiHost}/api/digital-uses/?${queryParams.toString()}`).subscribe((uses: DigitalUse[]) => {
      this.digitalUsesSubject.next(uses);
    });
  }

  createDigitalUse(data: any): Observable<DigitalUse> {
    return this.http.post<DigitalUse>(`${environment.apiHost}/api/digital-uses/`, data);
  }

  updateDigitalUse(useId: number, data: any): Observable<DigitalUse> {
    return this.http.patch<DigitalUse>(`${environment.apiHost}/api/digital-uses/${useId}/`, data);
  }

  deleteDigitalUse(useId: number) {
    return this.http.delete(`${environment.apiHost}/api/digital-uses/${useId}/`);
  }

  get digitalUses(): DigitalUse[] {
    return this.digitalUsesSubject.value;
  }

  getTags(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiHost}/api/tags/`);
  }

  getAreas() : Observable<Area[]> {
    return this.http.get<Area[]>(`${environment.apiHost}/api/areas/`);
  }

  deleteDigitalService(serviceId: number) {
    return this.http.delete(`${environment.apiHost}/api/digital-services/${serviceId}/`);
  }

  updateDigitalService(serviceId: number, data: any, params?: any): Observable<DigitalService> {
    const queryParams = new URLSearchParams(params);
    return this.http.patch<DigitalService>(`${environment.apiHost}/api/digital-services/${serviceId}/?${queryParams.toString()}`, data);
  }

  createDigitalService(data: any, params?: any): Observable<DigitalService> {
    const queryParams = new URLSearchParams(params);
    return this.http.post<DigitalService>(`${environment.apiHost}/api/digital-services/?${queryParams.toString()}`, data);
  }
}
