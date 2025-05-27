import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersSelectComponent } from './members-select.component';

describe('MembersSelectComponent', () => {
  let component: MembersSelectComponent;
  let fixture: ComponentFixture<MembersSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembersSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembersSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
