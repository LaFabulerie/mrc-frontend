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
      this.dataToSend = {itemId: '', useId: 0, usageTitle: '', title: '', description: '', url: '', scope: '', contact: ''};
    }

  saveData(data: any): Observable<any> {
    this.dataToSend.itemId = data.itemSelected;
    this.dataToSend.useId = data.useSelected;
    this.dataToSend.title = data.serviceName;
    this.dataToSend.description = data.serviceDesc;
    this.dataToSend.url = data.webAddress;
    this.dataToSend.scope = data.localisation;
    this.dataToSend.contact = data.mailAddress;

    return this.http.post(`${environment.serverHost}/api/w/contribute/`, this.dataToSend);
  }


}
