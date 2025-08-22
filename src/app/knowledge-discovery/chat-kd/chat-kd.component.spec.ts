import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatKdComponent } from './chat-kd.component';

describe('ChatKdComponent', () => {
  let component: ChatKdComponent;
  let fixture: ComponentFixture<ChatKdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatKdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatKdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
