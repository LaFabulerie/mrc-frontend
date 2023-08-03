import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DigitalService } from '../models/core';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  private basketSubject = new BehaviorSubject<DigitalService[]>([]);
  public basketSubject$: Observable<DigitalService[]> = this.basketSubject.asObservable();

  private printBasketSubject: BehaviorSubject<any[] | null> = new BehaviorSubject<any[]|null>(null);
  public printBasket$: Observable<any[]|null> = this.printBasketSubject.asObservable();


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

  isEmpty() {
    return this.count() == 0;
  }

  get payload() {
    if(this.isEmpty()) return null;

    let data: any[] = []
    this.basketSubject.getValue().forEach(service => {
      data.push({
        name: service.title,
        url: service.url,
      });
    });
    return data
  }

  print() {
    this.printBasketSubject.next(this.payload);
  }
}
