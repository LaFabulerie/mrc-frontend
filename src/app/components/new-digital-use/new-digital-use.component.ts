import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { DigitalUse } from 'src/app/models/use';
import { CoreService } from 'src/app/services/core.service';
import { TagPickerDialogComponent } from '../tag-picker-dialog/tag-picker-dialog.component';

@Component({
  selector: 'app-new-digital-use',
  templateUrl: './new-digital-use.component.html',
  styleUrls: ['./new-digital-use.component.scss']
})
export class NewDigitalUseComponent implements OnInit {

  @Output() onSave: EventEmitter<any> = new EventEmitter();

  useForm!: FormGroup;
  allItems: any[] = [];
  tags: string[] = [];
  currentRoom: any = null;

  constructor(
    private fb: FormBuilder,
    private coreService: CoreService,
    private dialogService: DialogService,
  ) {
  }

  ngOnInit(): void {
    this.useForm = this.fb.group({
      title: ['' , [Validators.required]],
      tags: [[], [Validators.required]],
      description: ['', [Validators.required]],
      itemId: [null, [Validators.required]],
    });



    this.coreService.getTags().subscribe((tags: string[]) => this.tags = tags);

    this.coreService.getRooms({
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
      this.allItems = rooms


      this.useForm.get('itemId')?.valueChanges.subscribe((value) => {
        const item = this.allItems.find((room: any) => {
          return room.items.find((item: any) => item.id === value);
        })
        if(item) {
          this.currentRoom = item;
        }
      });

      this.useForm.patchValue({
        itemId: this.allItems[0].items[0].id,
      })
    });


  }

  save() {
    const data = this.useForm.value;
    this.onSave.emit({
      title: data.title,
      description: data.description,
      tags: data.tags,
      itemIds: [data.itemId],
      services: [],
    });
  }

  get useTags() {
    return this.useForm.controls["tags"].value;
  }

  showTagDialog() {
    let ref = this.dialogService.open(TagPickerDialogComponent, {
      header: 'Quel(s) tag(s) pour votre fiche usage',
      width: '600px',
      baseZIndex: 10000,
      maximizable: false,
      draggable: false,
      closable: true,
      data: {
        tags: [...this.useTags],
      },
    });

    ref.onClose.subscribe((tags: string[]) => {
      if (tags) {
        this.useForm.patchValue({
          tags: tags,
        });
      }
    });
  }

  removeTag(event: Event, tag: string) {
    event.stopPropagation();
    const tags = this.useForm.controls["tags"].value;
    const index = tags.indexOf(tag);
    if (index > -1) {
      tags.splice(index, 1);
    }
    this.useForm.patchValue({
      tags: tags,
    });
  }

}
