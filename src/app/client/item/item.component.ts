import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DigitalService, DigitalUse, Item } from 'src/app/models/use';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  item: Item = {} as Item;
  constructor(
    private location:Location,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.item = this.location.getState() as Item;
  }

  goToDigitalUse(use: DigitalUse) {
    this.router.navigateByUrl('/use', { state: use });
  }
}
