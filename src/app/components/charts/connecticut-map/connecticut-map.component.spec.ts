import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnecticutMapComponent } from './connecticut-map.component';

describe('ConnecticutMapComponent', () => {
  let component: ConnecticutMapComponent;
  let fixture: ComponentFixture<ConnecticutMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConnecticutMapComponent]
    });
    fixture = TestBed.createComponent(ConnecticutMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
