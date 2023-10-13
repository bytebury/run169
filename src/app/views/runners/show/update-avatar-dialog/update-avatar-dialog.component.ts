import { NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone: true,
  imports: [
    MatDialogModule,
    NgIf,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  selector: 'app-update-avatar-dialog',
  templateUrl: './update-avatar-dialog.component.html',
  styleUrls: ['./update-avatar-dialog.component.scss'],
})
export class UpdateAvatarDialog {
  updateAvatarForm = new FormGroup({
    avatarUrl: new FormControl(this.data.avatar_url ?? '', [
      Validators.required,
    ]),
  });
  constructor(@Inject(MAT_DIALOG_DATA) public data: { avatar_url: string }) {}
}
