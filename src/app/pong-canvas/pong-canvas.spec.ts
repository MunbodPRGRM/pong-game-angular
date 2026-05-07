import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PongCanvas } from './pong-canvas';

describe('PongCanvas', () => {
  let component: PongCanvas;
  let fixture: ComponentFixture<PongCanvas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PongCanvas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PongCanvas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
