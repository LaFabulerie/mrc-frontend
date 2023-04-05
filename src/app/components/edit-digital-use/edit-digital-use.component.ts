import { Component, Input, OnInit } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-edit-digital-use',
  templateUrl: './edit-digital-use.component.html',
  styleUrls: ['./edit-digital-use.component.scss']
})
export class EditDigitalUseComponent implements OnInit {
  @Input()
  get useId(): number { return this.use.id; }
  set useId(id: number) {
    this.coreService.getDigitalUse(id, {
      expand: ['items', 'items.room', 'services', 'services.zone'],
      omit : ['items.room.video', 'items.room.description', 'items.room.items', 'services.uses']
    }).subscribe((use: any) => {
      this.use = use;
    });
  }

  use:any = null;

  constructor(
    private coreService: CoreService
  ) { }

  ngOnInit(): void {
  }

}
