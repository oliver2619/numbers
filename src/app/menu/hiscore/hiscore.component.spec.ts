import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiscoreComponent } from './hiscore.component';

describe('HiscoreComponent', () => {
  let component: HiscoreComponent;
  let fixture: ComponentFixture<HiscoreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HiscoreComponent]
    });
    fixture = TestBed.createComponent(HiscoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
