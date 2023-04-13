import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DigitalService, DigitalUse } from 'src/app/models/use';
import { CoreService } from 'src/app/services/core.service';
import { DigitalServiceFormDialogComponent } from '../digital-service-form-dialog/digital-service-form-dialog.component';
import { TagPickerDialogComponent } from '../tag-picker-dialog/tag-picker-dialog.component';

@Component({
  selector: 'app-edit-digital-use',
  templateUrl: './edit-digital-use.component.html',
  styleUrls: ['./edit-digital-use.component.scss'],
})
export class EditDigitalUseComponent implements OnInit {
  @Output() onSave: EventEmitter<any> = new EventEmitter();

  @Input()
  get useId(): number {
    return this.use.id;
  }
  set useId(id: number) {
    this.coreService
      .getDigitalUse(id, {
        expand: ['items', 'items.room', 'services', 'services.area'],
        omit: [
          'items.room.video',
          'items.room.description',
          'items.room.items',
          'services.use',
        ],
      })
      .subscribe((use: any) => {
        this.use = use;
      });
  }

  allItems: any[] = [];
  currentItem: any = null;

  use!: DigitalUse;

  ref!: DynamicDialogRef;

  constructor(
    private coreService: CoreService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.coreService
      .getRooms({
        expand: ['items', 'items.room'],
        omit: [
          'slug',
          'video',
          'description',
          'items.room.video',
          'items.room.description',
          'items.room.items',
          'items.slug',
          'items.room',
          'items.image',
          'items.uses.description',
        ],
      })
      .subscribe((rooms: any) => {
        this.allItems = rooms;
      });
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
      this.coreService
        .updateDigitalService(service.id, data, {
          expand: ['area'],
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
        service: null,
      },
    });

    this.ref.onClose.subscribe((data: any) => {
      data['useId'] = this.use.id;
      this.coreService
        .createDigitalService(data, { expand: ['area'], omit: ['use'] })
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
}
