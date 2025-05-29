import { Component, OnInit }         from '@angular/core';
import { CommonModule }      from '@angular/common';
import { NavigationEnd, RouterModule }      from '@angular/router';
import { MatButtonModule }   from '@angular/material/button';
import { MatIconModule }     from '@angular/material/icon';
import { HeaderComponent }       from '../header/header.component';
import { FooterComponent }       from '../footer/footer.component';
import { SidebarComponent }      from '../sidebar/sidebar.component';
import { ContentComponent }      from '../content/content.component';
import { GroupOptionsComponent } from '../group-options/group-options.component';
import { GroupFormComponent }    from '../group-form/group-form.component';
import { GroupService } from '../../services/group.service';
import { Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ContentComponent,
    GroupOptionsComponent,
    GroupFormComponent
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  collapsed       = true;
  optionsOpen     = false;
  showAddForm     = false;
  deleteMode      = false;
  updateMode      = false;
  selectedToDelete = new Set<number>();
  showProfile = false;

  constructor(private groupSvc: GroupService, private router: Router) {}

  ngOnInit() {
    // cada vez que cambie la ruta, actualizamos showProfile
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.showProfile = this.router.url.startsWith('/perfil');
      });
  }

  toggleSidebar() { this.collapsed = !this.collapsed; }
  toggleOptions() { this.optionsOpen = !this.optionsOpen; }

  openAddForm() {
    this.optionsOpen = false;
    this.showAddForm = true;
  }
  onAddCancel()    { this.showAddForm = false; }
  onGroupCreated(){ this.showAddForm = false; }

  openDeleteForm() {
    this.optionsOpen = false;
    this.deleteMode  = true;
    this.selectedToDelete.clear();
  }
  cancelDelete() {
    this.deleteMode = false;
    this.selectedToDelete.clear();
  }
  onSelectionChange(ids: Set<number>) {
    this.selectedToDelete = ids;
  }
  confirmDelete() {
    const toDelete = Array.from(this.selectedToDelete);
    this.groupSvc.deleteGroupCascade(toDelete)
      .subscribe(() => {
        this.cancelDelete();
        this.optionsOpen = false;
      }, err => {
        console.error('Error borrando grupos:', err);
      });
  }

  // ** NUEVO: edición **
  openUpdateForm() {
    this.optionsOpen = false;
    this.updateMode  = true;
    this.deleteMode  = false;
  }
  cancelUpdate() {
    this.updateMode = false;
  }
}
