import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, } from 'rxjs';
import { Commune } from '../models/core';

@Injectable({
  providedIn: 'root',
})
export class ContributeService {
  dataToSend: any;

  private communesSubject = new BehaviorSubject<Commune[]>([]);
  public communes$ = this.communesSubject.asObservable();

  constructor(
    private http: HttpClient,) {
      this.dataToSend = {itemId: null, useId: null, usageTitle: '', title: '', description: '', url: '', scope: '', contact: '', tags: ''};
    }

    saveData(data: any): Observable<any> {
      this.dataToSend.itemId = Number(data.itemSelected);
      if(data.betterUse === null) {
        this.dataToSend.useId = Number(data.useSelected);
      } else {
        this.dataToSend.usageTitle = data.betterUse;
      }
      this.dataToSend.title = data.serviceName;

      this.dataToSend.description = data.serviceDesc;
      this.dataToSend.url = data.webAddress;
      if(data.localisation === 'fr') {
        this.dataToSend.scope = 'National';
      }
      this.dataToSend.contact = data.mailAddress;
      this.dataToSend.tags = data.tagIt;


      return this.http.post(`${environment.serverHost}/api/w/contributions/`, this.dataToSend);
    }

    loadCommuneData() {
      this.http.get<any[]>(`https://geo.api.gouv.fr/communes?fields=codesPostaux,nom`).subscribe((communes: Commune[]) => {
        this.communesSubject.next(communes);
      });
    }


}
