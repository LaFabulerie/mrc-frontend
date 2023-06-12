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
    this.refresh();
  }

  load(basketData: []) {
    localStorage.setItem('basket', JSON.stringify(basketData));
    this.basketSubject.next(basketData);
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
    localStorage.removeItem('basket');
    this.basketSubject.next([]);
  }

  refresh() {
    const basket = localStorage.getItem('basket');
    if (basket) {
      this.load(JSON.parse(basket));
    }
  }

  count() {
    return this.basketSubject.getValue().length;
  }
}
