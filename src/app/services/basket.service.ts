import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DigitalService } from '../models/use';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  private basketSubject = new BehaviorSubject<DigitalService[]>([]);
  basketSubject$ = this.basketSubject.asObservable();

  constructor() {
    const basket = localStorage.getItem('basket');
    if (basket) {
      this.basketSubject.next(JSON.parse(basket));
    }
  }

  add(service: DigitalService) {
    const basket = this.basketSubject.getValue();
    basket.push(service);
    localStorage.setItem('basket', JSON.stringify(basket));
    this.basketSubject.next(basket);
  }

  remove(service: DigitalService) {
    const basket = this.basketSubject.getValue();
    const index = basket.findIndex(s => s.uuid == service.uuid);
    basket.splice(index, 1);
    localStorage.setItem('basket', JSON.stringify(basket));
    this.basketSubject.next(basket);
  }

  contains(service: DigitalService) {
    const basket = this.basketSubject.getValue();
    return basket.findIndex(s => s.uuid == service.uuid) != -1;
  }

  get services() {
    return this.basketSubject.getValue();
  }

  clear() {
    this.basketSubject.next([]);
  }

  count() {
    return this.basketSubject.getValue().length;
  }
}
