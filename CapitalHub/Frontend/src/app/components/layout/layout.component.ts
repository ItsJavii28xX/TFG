import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ContentComponent } from '../content/content.component';
import { GroupOptionsComponent } from '../group-options/group-options.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule }   from '@angular/material/icon';
import { GroupFormComponent } from '../group-form/group-form.component';
import { CommonModule }    from '@angular/common';
import { GroupService } from '../../services/group.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ContentComponent,
    GroupOptionsComponent,
    MatIconModule,
    GroupFormComponent,
    MatButtonModule
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})

export class LayoutComponent {
  collapsed     = true;
  optionsOpen   = false;
  showAddForm   = false;
  deleteMode       = false;
  selectedToDelete = new Set<number>();

  constructor(private groupSvc: GroupService) {}

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }

  toggleOptions() {
    this.optionsOpen = !this.optionsOpen;
  }

  /** Paso 4: Abrir el formulario de “Crear Grupo” */
  openAddForm() {
    // cerramos el panel de opciones y mostramos el form
    this.optionsOpen = false;
     console.log('openAddForm() called, showAddForm → true');
    this.showAddForm = true;
  }

  /** Handler para “Cancelar” o “Creado” en el GroupFormComponent */
  onAddCancel() {
    console.log('onAddCancel() called, showAddForm → false');
    this.showAddForm = false;
  }
  onGroupCreated() {
    console.log('onGroupCreated() called, showAddForm → false');
    this.showAddForm = false;
  }


  openDeleteForm() {
    this.optionsOpen  = false;
    this.deleteMode   = true;
    this.selectedToDelete.clear();
  }

  cancelDelete() {
    this.deleteMode   = false;
    this.selectedToDelete.clear();
  }

  onSelectionChange(ids: Set<number>) {
    this.selectedToDelete = ids;
  }

  
  confirmDelete() {
    // aquí lanzamos la eliminación en cascada de cada grupo
    const toDelete = Array.from(this.selectedToDelete);
    Promise.all(
      toDelete.map(() => this.groupSvc.deleteGroupCascade(toDelete).toPromise())
    ).then(() => {
      this.cancelDelete();
      // refresca tu listado de grupos (por ej. vía un Subject o recarga manual)
      this.optionsOpen = false;
    });
  }

  openUpdateForm() { /* … */ }
}
