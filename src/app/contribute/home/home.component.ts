import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {map, startWith} from 'rxjs/operators';
import { DigitalUse, Item } from 'src/app/models/core';
import { ContributeService } from 'src/app/services/contribute.service';
import { CoreService } from 'src/app/services/core.service';
import { Room } from '../../models/core';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
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
  communesSelected: string[] = [];
  filteredCommunes: string[] = [];
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  myControl = new FormControl('');
  @ViewChild('communesInput', {static: false}) communesInput!: ElementRef<HTMLInputElement>;


  constructor(
    private fb: FormBuilder,
    private contributeService: ContributeService,
    private coreService: CoreService,
  ) {
  }

  ngOnInit(): void {
    this.errors = {};

    this.contributeForm = this.fb.group({
      roomSelected: ["", Validators.required],
      itemSelected: ["", Validators.required],
      useSelected: ["", Validators.required],
      betterUse: [null],
      serviceName: [null, Validators.required],
      serviceDesc: [null, Validators.required],
      webAddress: [null, Validators.required],
      localisation: ["fr", Validators.required],
      communes: [null],
      tagIt: [null],
      contact: [null],
    });

    this.coreService.loadRooms();
    this.coreService.loadItems();
    this.coreService.loadDigitalUses();

    this.coreService.rooms$.subscribe(rooms => {
      if(!rooms || rooms.length == 0) return;
      rooms.forEach(room => {
        this.roomList.push(room);
      })
    });

    this.myControl.valueChanges.pipe(
      startWith(null),
      map((commune: string | null) => (commune ? this._filter(commune) : this.loadCommuneDataDefault())),
    ).subscribe((commune) => {
      this.filteredCommunes = commune;
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
      this.useList = uses.filter(use => use.items.find(u => u.id === Number(event.target.value)));
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
    this.contributeForm.value.communes = this.communesSelected.join(';');
    this.contributeService.saveData(this.contributeForm.value).subscribe({
      next: () => {
        window.location.reload();
      },
      error: (errorResp) => {
        for(let key in errorResp.error){
          this.errors[key] = errorResp.error[key];
        }
      }
    });
  }

  setAllOpts(optGroup: any[]): string{
    let allOpts = "";

    for(let i = 0; i < optGroup.length; i++) {
      if(Number(optGroup[i].value)) {
        if(allOpts === "") {
          allOpts = optGroup[i].value;
        } else {
          allOpts += "," + optGroup[i].value;
        }
      }
    }
    return allOpts;
  }

  selectChange(event: any): void {
    let optGroupLabel = event.target.children;
    for(let i = 0; i < optGroupLabel.length; i++) {
      if(optGroupLabel[i].children.length !== 0) {
        for(let j = 0; j < optGroupLabel[i].children.length; j++) {
          if(optGroupLabel[i].children[j].selected) {
            switch(optGroupLabel[i].children[j].value) {
              case "auvergne-rhone-alpes": {
                this.contributeForm.value.localisation = this.setAllOpts(optGroupLabel[i].children);
                break;
              }
              case "bourgogne-franche-compte": {
                this.contributeForm.value.localisation = this.setAllOpts(optGroupLabel[i].children);
                  break;
              }
              case "bretagne": {
                this.contributeForm.value.localisation = this.setAllOpts(optGroupLabel[i].children);
                  break;
              }
              case "centre-val-de-loire": {
                this.contributeForm.value.localisation = this.setAllOpts(optGroupLabel[i].children);
                  break;
              }
              case "corse": {
                this.contributeForm.value.localisation = this.setAllOpts(optGroupLabel[i].children);
                  break;
              }
              case "grand-est": {
                this.contributeForm.value.localisation = this.setAllOpts(optGroupLabel[i].children);
                  break;
              }
              case "hauts-de-france": {
                this.contributeForm.value.localisation = this.setAllOpts(optGroupLabel[i].children);
                  break;
              }
              case "ile-de-france": {
                this.contributeForm.value.localisation = this.setAllOpts(optGroupLabel[i].children);
                  break;
              }
              case "normandie": {
                this.contributeForm.value.localisation = this.setAllOpts(optGroupLabel[i].children);
                  break;
              }
              case "nouvelle-aquitaine": {
                this.contributeForm.value.localisation = this.setAllOpts(optGroupLabel[i].children);
                  break;
              }
              case "occitanie": {
                this.contributeForm.value.localisation = this.setAllOpts(optGroupLabel[i].children);
                  break;
              }
              case "pays-de-la-loire": {
                this.contributeForm.value.localisation = this.setAllOpts(optGroupLabel[i].children);
                  break;
              }
              case "provence-alpes-code-dazur": {
                this.contributeForm.value.localisation = this.setAllOpts(optGroupLabel[i].children);
                  break;
              }
              case "dom-tom": {
                this.contributeForm.value.localisation = this.setAllOpts(optGroupLabel[i].children);
                  break;
              }
              default: {
                  break;
              }
            }
          }
        }
      }
    }
  }

  add(event: any): void {
    const value = (event.value || '').trim();

    if (value) {
      this.communesSelected.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.myControl.setValue(null);
  }

  remove(commune: string): void {
    const index = this.communesSelected.indexOf(commune);

    if (index >= 0) {
      this.communesSelected.splice(index, 1);
    }
  }

  private _filter(name: string): string[] {
    const filterValue = name.toLowerCase();
    this.filteredCommunes = [];

    this.contributeService.loadCommuneData(filterValue);
    this.contributeService.communes$.subscribe(commune => {
      commune.forEach(comm => {
        this.filteredCommunes.push(comm.codesPostaux[0].toString() + " " + comm.nom.toString());
      })
    });

    return this.filteredCommunes;
  }

  private loadCommuneDataDefault(): string[] {
    this.filteredCommunes = [];

    this.contributeService.loadCommuneDataDefault();
    this.contributeService.communes$.subscribe(commune => {
      commune.forEach(comm => {
        this.filteredCommunes.push(comm.codesPostaux[0].toString() + " " + comm.nom.toString());
      })
    });

    return this.filteredCommunes;
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.communesSelected.push(event.option.viewValue);
    this.communesInput.nativeElement.value = '';
    this.myControl.setValue(null);
  }


}
