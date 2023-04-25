import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MqttService {

  constructor(
    private http: HttpClient
  ) {; // Load all digital uses
  }


  publish(data:any) {
    return this.http.post(`${environment.apiHost}/api/client/mqtt/publish/`, data);
  }


}
