import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DigitalUse, Item } from 'src/app/models/core';
import { MessageService } from 'primeng/api';
import { ContributeService } from 'src/app/services/contribute.service';
import { CoreService } from 'src/app/services/core.service';
import { environment } from 'src/environments/environment';
import { Room } from '../../models/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit{
  item?: Item;
  room?: Room;
  use?: DigitalUse;
  useList: any[] = [];
  itemList: any[] = [];
  roomList: any[] = [];
  servicesList: any[] = [];
  errors: any;
  contributeForm: any;


  constructor(
    private fb: FormBuilder,
    private contributeService: ContributeService,
    private coreService: CoreService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {


    this.contributeForm = this.fb.group({
      roomSelected: [null, Validators.required],
      itemSelected: [null, Validators.required],
      useSelected: [null, Validators.required],
      betterUse: [null, Validators.required],
      serviceName: [null, Validators.required],
      serviceDesc: [null, Validators.required],
      webAddress: [null, Validators.required],
      localisation: [null, Validators.required],
      tagIt: [null],
      mailAddress: [null],
    });

    this.coreService.loadRooms();
    this.coreService.loadItems();
    this.coreService.loadDigitalUses()

    this.coreService.rooms$.subscribe(rooms => {
      if(!rooms || rooms.length == 0) return;
      for(let i=1; i<=rooms.length; i++){
        this.roomList.push(rooms.find(room => room.id === i));
      }
    });


  }

  loadItems(event: any) {
    this.useList = []
    this.servicesList = []
    this.coreService.items$.subscribe(items => {
      if(!items || items.length == 0) return;
      this.itemList = items.filter(item => item.room.uuid === event.target.value);
    });
  }

  loadUse(event: any) {
    this.servicesList = []
    this.coreService.digitalUses$.subscribe(uses => {
      if(!uses || uses.length == 0) return;
      this.useList = uses.filter(use => use.items.find(u => u.uuid === event.target.value));
    });
  }

  loadServices(event: any) {
    this.coreService.digitalUses$.subscribe(uses => {
      if(!uses || uses.length == 0) return;
      this.use = uses.find(use => use.id === Number(event.target.value));
      this.servicesList = this.use ? this.use.services : [];
    });
  }

  save(){
    this.contributeService.saveData(this.contributeForm.value).subscribe({
      next: () => {
          this.contributeForm.reset();
      },
      error: (errorResp) => {
        for(let key in errorResp.error){
          this.errors[key] = errorResp.error[key];
        }
      }
    });
  }


}
