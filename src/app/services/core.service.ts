import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  constructor(
    private http: HttpClient
  ) { }


  getRooms(params?: any) {
    const queryParams = new URLSearchParams(params);
    return this.http.get(`${environment.apiHost}/api/rooms/?${queryParams.toString()}`);
  }

  getDigitalUse(useId: number, params?: any) {
    const queryParams = new URLSearchParams(params);
    return this.http.get(`${environment.apiHost}/api/digital-uses/${useId}/?${queryParams.toString()}`);
  }
}
