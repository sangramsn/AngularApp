import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import { User } from '../Interface/userInterface';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  standalone: true,
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class UserComponent implements OnInit {
  users: User[] = [];
  editingUserId: string | null = null;
  userForm: FormGroup;

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (res) => {
        this.users = res;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  canEditDelete(): boolean {
    return this.authService.isAdmin();
  }

  addUser() {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      console.log(formData);

      this.userService.createUser(formData).subscribe({
        next: (res) => {
          Swal.fire('User added successfully!');
          this.userForm.reset();
          this.loadUsers();
        },
        error: (err) => {
          console.error(err);
        },
      });
    } else {
      Swal.fire('Please fill in all required fields.');
    }
  }

  editdata(user: User) {
    this.editingUserId = user.id;
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '',
    });
  }

  updateUser() {
    if (this.userForm.valid && this.editingUserId) {
      const updatedData: any = {
        id: this.editingUserId,
        name: this.userForm.get('name')?.value,
        email: this.userForm.get('email')?.value,
        role: this.userForm.get('role')?.value,
        password: this.userForm.get('password')?.value || undefined,
      };

      this.userService.editUser(this.editingUserId, updatedData).subscribe({
        next: (res) => {
          Swal.fire('User updated successfully!');
          this.userForm.reset();
          this.editingUserId = null;
          this.loadUsers();
        },
        error: (err) => {
          console.error(err);
        },
      });
    } else {
      Swal.fire('Please fill in all required fields.');
    }
  }

  deleteUser(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(id).subscribe({
          next: (res) => {
            Swal.fire('Deleted!', 'User deleted successfully!', 'success');
            this.loadUsers();
          },
          error: (err) => {
            Swal.fire('Error!', 'Could not delete user.', 'error');
            console.error(err);
          },
        });
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
