import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {

  @Output() close = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  userForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['', Validators.required]
  });

  submitForm() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.userService.addUser({
      name: this.userForm.value.name!,
      email: this.userForm.value.email!,
      role: this.userForm.value.role!
    });

    this.close.emit();
  }

  closeModal() {
    this.close.emit();
  }
}