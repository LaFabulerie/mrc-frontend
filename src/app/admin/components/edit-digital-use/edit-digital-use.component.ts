import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DigitalService, DigitalUse } from 'src/app/models/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { CoreService } from 'src/app/services/core.service';
import { DigitalServiceFormDialogComponent } from '../digital-service-form-dialog/digital-service-form-dialog.component';
import { TagPickerDialogComponent } from '../tag-picker-dialog/tag-picker-dialog.component';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-edit-digital-use',
  templateUrl: './edit-digital-use.component.html',
  styleUrls: ['./edit-digital-use.component.scss'],
})
export class EditDigitalUseComponent implements OnInit {

  @Output() onSave: EventEmitter<any> = new EventEmitter();

  @Input()
  get useUuid(): string {
    return this.use.uuid;
  }
  set useUuid(uuid: string) {
    this.coreService.digitalUses$.subscribe((uses) => {
      this.use = uses.find((use) => use.uuid === uuid)!;
    });
  }
  user?: User | null;

  allItems: any[] = [];
  currentItem: any = null;

  use!: DigitalUse;

  ref!: DynamicDialogRef;

  constructor(
    private coreService: CoreService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    private authService: AuthService,
  ) {
    this.authService.user$.subscribe((x) => (this.user = x));
  }
  ngOnInit(): void {
    this.allItems = this.coreService.rooms;
  }

  saveItem() {
    this.coreService
      .updateDigitalUse(this.use.id, {
        itemIds: [this.use.itemIds[0]],
      })
      .subscribe((use) => {
        this.onSave.emit(use);
      });
  }

  saveTitle() {
    this.coreService
      .updateDigitalUse(this.use.id, {
        title: this.use.title,
      })
      .subscribe((use) => {
        this.onSave.emit(use);
      });
  }

  saveDescription() {
    this.coreService
      .updateDigitalUse(this.use.id, {
        description: this.use.description,
      })
      .subscribe(() => {
        this.onSave.emit();
      });
  }

  removeService(event: Event, service: DigitalService) {
    event.stopPropagation();
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Êtes-vous sûr de vouloir supprimer ce service ?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      acceptIcon: 'pi pi-check',
      rejectLabel: 'Non',
      rejectIcon: 'pi pi-times',
      accept: () => {
        this.coreService.deleteDigitalService(service.id).subscribe(() => {
          this.use.services.splice(this.use.services.indexOf(service), 1);
        });
      },
      reject: () => {},
    });
  }

  editService(service: DigitalService) {
    this.ref = this.dialogService.open(DigitalServiceFormDialogComponent, {
      header: 'Mise à jour du service',
      width: '650px',
      baseZIndex: 10000,
      maximizable: false,
      draggable: false,
      closable: true,
      data: {
        service: service,
      },
    });

    this.ref.onClose.subscribe((data: any) => {
      if(!data) return;
      this.coreService
        .updateDigitalService(service.id, data, {
          omit: ['use'],
        })
        .subscribe((serv) => {
          const idx = this.use.services.findIndex(
            (s: DigitalService) => s.id === service.id
          );
          this.use.services[idx] = serv;
        });
    });
  }

  addService() {
    this.ref = this.dialogService.open(DigitalServiceFormDialogComponent, {
      header: "Ajout d'un service",
      width: '650px',
      baseZIndex: 10000,
      maximizable: false,
      draggable: false,
      closable: true,
      data: {
        useId: this.use.id,
        service: null,
      },
    });

    this.ref.onClose.subscribe((data: any) => {
      if(!data) return;
      data['useId'] = this.use.id;
      this.coreService
        .createDigitalService(data, { omit: ['use'] })
        .subscribe((serv) => {
          this.use.services.push(serv);
        });
    });
  }

  showTagDialog() {
    this.ref = this.dialogService.open(TagPickerDialogComponent, {
      header: 'Quel(s) tag(s) pour votre fiche usage',
      width: '600px',
      baseZIndex: 10000,
      maximizable: false,
      draggable: false,
      closable: true,
      data: {
        tags: [...this.use.tags],
      },
    });

    this.ref.onClose.subscribe((tags: string[]) => {
      if (tags) {
        this.coreService
          .updateDigitalUse(this.use.id, {
            tags: tags,
          })
          .subscribe(() => {
            this.use.tags = tags;
            this.onSave.emit();
          });
      }
    });
  }

  removeTag(event: Event, tag: string) {
    event.stopPropagation();
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Êtes-vous sûr de vouloir supprimer le tag "${tag}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      acceptIcon: 'pi pi-check',
      rejectLabel: 'Non',
      rejectIcon: 'pi pi-times',
      accept: () => {
        const tags = this.use.tags.filter((t: string) => t !== tag);
        this.coreService.updateDigitalUse(this.use.id, {
          tags: tags,
        }).subscribe(() => {
          this.use.tags.splice(this.use.tags.indexOf(tag), 1);
          this.onSave.emit();
        });
      },
      reject: () => {}
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.use.services, event.previousIndex, event.currentIndex);
    let index = 0;
    var data = {};
    this.use.services.forEach((service) => {
      index++;
      if(service.id === event.item.data.id) {
        data = {
          ordre: event.currentIndex + 1,
        };
      } else {
        data = {
          ordre: index,
        };
      }
      this.coreService.updateDigitalService(service.id, data).subscribe();
    })

  }
}
