import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-tag-picker-dialog',
  templateUrl: './tag-picker-dialog.component.html',
  styleUrls: ['./tag-picker-dialog.component.scss']
})
export class TagPickerDialogComponent  implements OnInit{

  tags: string[] = [];
  currentTag = '';
  tagSuggestions: string[] = [];
  currentTags: string[] = [];

  constructor(
    public ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private coreService: CoreService,
  ) {
    this.currentTags = this.config.data.tags;
  }

  ngOnInit(): void {
    this.coreService.getTags().subscribe((tags: any) => {
      this.tags = tags;
    });
  }

  search(event: any) {
    this.tagSuggestions = this.tags.filter((tag: string) => {
      return tag.toLowerCase().includes(event.query.toLowerCase());
    });
  }

  removeTag(tag: string) {
    this.currentTags = this.currentTags.filter((t: string) => t !== tag);
    this.tags.push(tag);
    this.tags.sort();
  }

  onSuggestionSelect(tag: string) {
    this.tags = this.tags.filter((t: string) => t !== tag);
    this.currentTags.push(tag);
    this.currentTag = '';
  }

  saveTags() {
    this.ref.close(this.currentTags);
  }

}
