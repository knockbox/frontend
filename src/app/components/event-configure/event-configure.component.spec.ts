import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventConfigureComponent } from './event-configure.component';

describe('EventConfigureComponent', () => {
  let component: EventConfigureComponent;
  let fixture: ComponentFixture<EventConfigureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventConfigureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventConfigureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
