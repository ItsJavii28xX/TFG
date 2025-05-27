// src/app/components/budget-form/budget-form.component.ts
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule }         from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule }        from '@angular/material/card';
import { MatFormFieldModule }   from '@angular/material/form-field';
import { MatInputModule }       from '@angular/material/input';
import { MatDatepickerModule }  from '@angular/material/datepicker';
import { MatButtonModule }      from '@angular/material/button';
import { MatNativeDateModule }  from '@angular/material/core';

export interface BudgetDto {
  nombre:       string;
  cantidad:     number;
  descripcion?: string;
  fechaInicio:  string;
  fechaFin:     string;
}

@Component({
  selector: 'app-budget-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  templateUrl: './budget-form.component.html',
  styleUrls: ['./budget-form.component.css']
})
export class BudgetFormComponent implements OnInit {
  @Output() done = new EventEmitter<{
    nombre: string;
    cantidad: number;
    descripcion: string;
    fechaInicio: Date;
    fechaFin: Date;
  }>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      nombre:      ['', Validators.required],
      cantidad:    [null, [Validators.required, Validators.min(0.01)]],
      descripcion: [''],
      fechaInicio: [null, Validators.required],
      fechaFin:    [null, Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.done.emit(this.form.value);
  }

  onCancel() {
    this.cancel.emit();
  }
}
