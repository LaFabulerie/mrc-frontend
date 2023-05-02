import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DigitalService, DigitalUse, Item } from 'src/app/models/use';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { RemoteControlService } from 'src/app/services/control.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  item: Item = {} as Item;
  navigationMode: string|undefined = undefined;
  user?: User;

  constructor(
    private location:Location,
    private router: Router,
    private control: RemoteControlService,
    private auth: AuthService,
  ) {
    this.user = this.auth.userValue;
    this.control.navitationMode$.subscribe((v) => {
      if(v) {
        this.navigationMode = v
      }
    });
  }

  ngOnInit(): void {
    this.item = this.location.getState() as Item;

    this.control.navigateToDigitalUse$.subscribe(uuid => {
      if(!uuid) return;
      const use = this.item.uses.find(r => r.uuid == uuid);
      this.router.navigateByUrl('/use', { state: use });
    })
  }

  goToDigitalUse(use: DigitalUse){
    if(this.navigationMode == "master"){
      this.control.navigate('use', use.uuid);
    } else {
      this.router.navigateByUrl('/use', { state: use });
    }
  }
}
