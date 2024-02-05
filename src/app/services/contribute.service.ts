import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable} from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class ContributeService {

  private userSubject: BehaviorSubject<User | undefined>;
  public user$: Observable<User | undefined>;

  constructor(
    private http: HttpClient,
  ) {
    this.userSubject = new BehaviorSubject<User | undefined>(undefined);
    this.user$ = this.userSubject.asObservable();
  }


}
