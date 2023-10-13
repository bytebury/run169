import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAvatarDialog } from './update-avatar-dialog.component';

describe('EditProfileImageDialogueComponent', () => {
  let component: UpdateAvatarDialog;
  let fixture: ComponentFixture<UpdateAvatarDialog>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateAvatarDialog],
    });
    fixture = TestBed.createComponent(UpdateAvatarDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
