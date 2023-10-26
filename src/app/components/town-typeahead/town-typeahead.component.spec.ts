import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TownTypeaheadComponent } from './town-typeahead.component';

describe('TownTypeaheadComponent', () => {
  let component: TownTypeaheadComponent;
  let fixture: ComponentFixture<TownTypeaheadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TownTypeaheadComponent]
    });
    fixture = TestBed.createComponent(TownTypeaheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
