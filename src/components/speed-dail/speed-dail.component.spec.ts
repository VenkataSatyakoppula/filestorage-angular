import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedDailComponent } from './speed-dail.component';

describe('SpeedDailComponent', () => {
  let component: SpeedDailComponent;
  let fixture: ComponentFixture<SpeedDailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeedDailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpeedDailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
