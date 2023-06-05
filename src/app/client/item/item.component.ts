import { Location } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DigitalService, DigitalUse, Item } from 'src/app/models/use';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { ClientService } from 'src/app/services/client.service';
import { RemoteControlService } from 'src/app/services/control.service';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  item?: Item;
  user?: User;
  navigationMode: string|undefined = undefined;

  useGrid: (DigitalUse|undefined)[][] = [
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
  ];

  constructor(
    private location:Location,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private control: RemoteControlService,
    private auth: AuthService,
    private coreService: CoreService,
  ) {
  }

  ngOnInit(): void {
    this.user = this.auth.userValue;
    this.control.enableNavigation();
    this.control.hideLogo();
    this.control.transparentNavigation = true;

    this.control.navitationMode$.subscribe((v) => {
      if(v) {
        this.navigationMode = v
      }
    });

    this.activatedRoute.params.subscribe(params => {
      const uuid = params['uuid'];
      this.item = this.coreService.findItem(uuid)
      if(this.item){
        this.useGrid = [
          [this.item.uses[9], this.item.uses[0], this.item.uses[6]],
          [this.item.uses[5], undefined, this.item.uses[2]],
          [this.item.uses[3], undefined, this.item.uses[4]],
          [this.item.uses[8], this.item.uses[1], this.item.uses[7]],
        ];
      }
    })

    let state = this.location.getState() as any;
    console.log(state['back'])


    this.control.navigateToDigitalUse$.subscribe(uuid => {
      if(!uuid && !this.item) return;
      const use = this.item!.uses.find(r => r.uuid == uuid);
      this.router.navigateByUrl('/use', { state: use });
    })
  }

  goToDigitalUse(use: DigitalUse){
    this.router.navigate(['/use', use.uuid]);
  }
}
