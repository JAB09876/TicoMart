import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { UpdateProfileRequest } from '../../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  profileForm: FormGroup;
  isLoading = false;
  isEditing = false;

  constructor() {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.profileForm.patchValue({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        phone: currentUser.phone || ''
      });
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.loadUserData(); // Reset form if canceling
    }
  }

  onSave(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      const profileData: UpdateProfileRequest = this.profileForm.value;

      this.authService.updateProfile(profileData).subscribe({
        next: (updatedUser) => {
          this.isLoading = false;
          this.isEditing = false;
          this.snackBar.open('Profile updated successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open('Failed to update profile. Please try again.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
        }
      });
    }
  }

  onCancel(): void {
    this.isEditing = false;
    this.loadUserData();
  }

  onLogout(): void {
    this.authService.logout();
  }

  get currentUser() {
    return this.authService.currentUser();
  }
}
