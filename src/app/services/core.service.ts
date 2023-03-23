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


  getRooms() {
    return this.http.get(`${environment.apiHost}/api/rooms`);
  }

  getDigitalUse(useId: number) {
    return this.http.get(`${environment.apiHost}/api/digital-uses/${useId}`);
  }
}
