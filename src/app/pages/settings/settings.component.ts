import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Organization } from 'src/app/models/org';
import { Area } from 'src/app/models/use';
import { AuthService } from 'src/app/services/auth.service';
import { CoreService } from 'src/app/services/core.service';
import { OrgService } from 'src/app/services/org.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  currentUser: any;
  currentOrg: Organization | null = null;

  selectedOrgId: number = -1;
  orgs: Organization[] = [];
  newOrgDialogVisible: boolean = false;
  newApiKeyDialogVisible: boolean = false;

  areas: Area[] = []
  newApiKeyName: string = '';
  newApiKeyValue: string = '';
  newOrgForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private orgService: OrgService,
    private coreService: CoreService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
      this.fetchCurrentOrg();
    });
    this.fetchOrgs();
    this.fetchArea();

    this.newOrgForm = this.fb.group({
      name: [''],
      areaId: [''],
      newAreaName: [''],
    });
  }

  fetchOrgs() {
    this.orgService.getOrgs().subscribe(orgs => {
      this.orgs = orgs;
    });
  }

  fetchCurrentOrg() {
    if (this.currentUser.orgId) {
      this.orgService.getOrg(this.currentUser.orgId).subscribe(org => {
        this.currentOrg = org;
      })
    }
  }

  fetchArea() {
    this.coreService.getAreas().subscribe(areas => {
      this.areas = areas;
    });
  }

  showNewOrgDialog() {
    this.newOrgDialogVisible = true;
  }

  showNewApiKeyDialog() {
    this.newApiKeyDialogVisible = true;
  }

  resetAreaId() {
    this.newOrgForm.patchValue({ areaId: '' });
  }

  createOrg() {
    const data = this.newOrgForm.value;
    if (data.areaId === '' && data.newAreaName !== '') {
      this.coreService.createArea({ name: data.newAreaName }).subscribe(area => {
        this.newOrgForm.patchValue({ areaId: area.id });
        this.createOrg();
      });
      return;
    }
    delete data.newAreaName;
    this.orgService.createOrg(data).subscribe(org => {
      this.newOrgDialogVisible = false;
      this.newOrgForm.reset();
      this.selectedOrgId = org.id;
      this.saveOrg();
      this.fetchOrgs();
    })
  }

  saveOrg() {
    this.authService.updateCurrentUser({ orgId: this.selectedOrgId }).subscribe( _ => this.selectedOrgId = -1);
  }

  leaveOrg() {
    this.authService.updateCurrentUser({ orgId: null }).subscribe( _ => this.selectedOrgId = -1);
  }

  revokeApiKey(apiKey: any) {
    this.orgService.revokeApiKey(this.currentOrg!.id, apiKey.id).subscribe(_ => {
      this.fetchCurrentOrg();
    });
  }

  saveApiKey() {
    const data = {
      orgId: this.currentOrg!.id,
      name: this.newApiKeyName,
    };
    this.orgService.createApiKey(data).subscribe((resp) => {
      this.newApiKeyValue = resp.key;
      this.fetchCurrentOrg();
    });
  }

  closeNewApiKeyDialog() {
    this.newApiKeyDialogVisible = false;
    this.newApiKeyName = '';
    this.newApiKeyValue = '';
  }


}
