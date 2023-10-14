import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CoreService } from 'src/app/services/core.service';
import {saveAs as importedSaveAs} from "file-saver";
import * as moment from 'moment';


@Component({
  selector: 'app-import-export-dialog',
  templateUrl: './import-export-dialog.component.html',
  styleUrls: ['./import-export-dialog.component.scss']
})
export class ImportExportDialogComponent implements OnInit {

  nodes: TreeNode[] = [];
  selectedNodes: TreeNode[] = [];
  selectedUseCount: number = 0;
  selectedServiceCount: number = 0 ;

  waiting: boolean = false;

  action: string = 'export';

  constructor(
    private coreService: CoreService,
    private dialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef,
  ) { }

  ngOnInit(): void {
    this.action = this.dialogConfig.data.action;
    if(this.action === 'export') {
      this.buildTree();
    }

  }

  buildTree() {
    this.coreService.digitalUses$.subscribe((uses) => {
      uses.forEach((use) => {
        let useNode = {
          label: use.title,
          data: use.uuid,
          type: 'use',
          selectable: use.services.length > 0,
          children: [] as TreeNode[],
        }
        use.services.forEach((service) => {
          useNode.children.push({
            label: service.title,
            data: service.uuid,
            type: 'service',
            parent: useNode,
            leaf: true,
          });
        });

        this.nodes.push(useNode);
      });
    });
  }

  updateCount() {
    this.selectedUseCount = 0
    this.selectedServiceCount = 0
    this.selectedNodes.forEach(node => {
      if(node.type === 'use') {
        this.selectedUseCount++;
        this.selectedServiceCount+= node.children ? node.children.length : 0
      }
    });
  }

  getButtonLabel() {
    const actionLabel = this.action === 'export' ? 'Exporter' : 'Importer';
    let useLabel = ""
    let serviceLabel = ""
    if(this.selectedUseCount === 0) {
      useLabel = "aucun usage"
    } else if (this.selectedUseCount === 1) {
      useLabel = "1 usage"
    } else {
      useLabel = `${this.selectedUseCount} usages`
    }
    if(this.selectedServiceCount === 0) {
      serviceLabel = "aucun service"
    }
    else if (this.selectedServiceCount === 1) {
      serviceLabel = "1 service"
    } else {
      serviceLabel = `${this.selectedServiceCount} services`
    }
    return `Exporter ${serviceLabel} (dans ${useLabel})`
  }

  performAction() {
    this.waiting = true;
    let uuids: string[] = [];
    this.selectedNodes.forEach((node) => {
      if(node.type === 'use') {
        uuids.push(...node.children!.map((child) => child.data));
      }
    });
    if(this.action === 'export') {
      this.coreService.exportServices(uuids).subscribe((data) => {
        const blob = new Blob([data], { type: 'text/csv' });
        const currentDate = moment();

        importedSaveAs(blob, `export_mrc_${currentDate.format("DD_MM_YYYY_HH_mm")}.csv`);
        this.waiting = false;
        this.dialogRef.close();
      });
    } else {
    }
  }
}
