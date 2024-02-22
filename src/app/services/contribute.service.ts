import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CoreService } from 'src/app/services/core.service';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContributeService {
  dataToSend: any;

  constructor(
    private http: HttpClient,
    private coreService: CoreService,) {
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


}
