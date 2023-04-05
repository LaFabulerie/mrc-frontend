import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{

  data: TreeNode[] = [];
  selectedNode!: TreeNode;
  suggestions: any[] = [];
  digitalUses: any[] = [];

  constructor(
    private coreService: CoreService
  ) {
  }

  ngOnInit(): void {
    this.coreService.getRooms({
      expand: ['items', 'items.uses'],
      omit : ['video', 'description', 'items.room','items.image', 'items.uses.items', 'items.uses.description']
    }).subscribe((rooms: any) => {
      rooms.forEach((room: any) => {
        this.data.push({
          label: room.name,
          data: room.id,
          type: 'room',
          expandedIcon: 'pi pi-folder-open',
          collapsedIcon: 'pi pi-folder',
          children: room.items.map((item: any) => {
            return {
              label: item.name,
              data: item.id,
              type: 'item',
              expandedIcon: 'pi pi-folder-open',
              collapsedIcon: 'pi pi-folder',
              children: item.uses.map((use: any) => {
                this.digitalUses.push(use);
                return {
                  label: use.title,
                  data: use.id,
                  type: 'use',
                  icon: 'pi pi-file',
                  leaf: true
                };
              })
            };
          })
        });
      });
      this._selectFirstUseNode(this.data);
    });
  }

  private _selectFirstUseNode(nodes: any[]) {
    for(let i = 0; i < nodes.length; i++) {
      if(nodes[i].type === 'use') {
        this.selectedNode = nodes[i];
        return true;
      } else if(nodes[i].children) {
        const res = this._selectFirstUseNode(nodes[i].children);
        if(res) {
          nodes[i].expanded = true;
          return true;
        }
      }
    }
    return false;
  }

  private _selectNodeById(nodes: any[], id: number) {
    for(let i = 0; i < nodes.length; i++) {
      if(nodes[i].type === 'use' && nodes[i].data === id) {
        this.selectedNode = nodes[i];
        return true;
      } else if(nodes[i].children) {
        const res = this._selectNodeById(nodes[i].children, id);
        if(res) {
          nodes[i].expanded = true;
          return true;
        }
      }
    }
    return false;
  }

  private _selectNode(node: any){
    if(node.type === 'use') {
      this.selectedNode = node;
    } else {
      node.expanded = !node.expanded;
    }
  }

  onNodeSelect(event: any){
    this._selectNode(event.node);
  }

  search(event: any){
    if(event.query.length > 2) {
      this.suggestions = this.digitalUses.filter((use: any) => {
        const titleTest = use.title.toLowerCase().indexOf(event.query.toLowerCase()) > -1
        const tagTest = use.tags.filter((tag: any) => tag.toLowerCase().indexOf(event.query.toLowerCase()) > -1).length > 0;
        return titleTest || tagTest;
      });
    }
  }

  onSuggestionSelect(use: any){
    this._selectNodeById(this.data, use.id);
  }
}
