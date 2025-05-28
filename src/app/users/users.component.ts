import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  // userForm: FormGroup;
  showForm: boolean = false;
  newConfig: {
    city: string;
    min_price: number | null;
    max_price: number | null;
    min_bedrooms: number | null;
    min_surface_area: number | null;
    enabled: boolean;
  } = {
    city: '',
    min_price: null,
    max_price: null,
    min_bedrooms: null,
    min_surface_area: null,
    enabled: true,
  };

  newUser: {
    userId: number | null,
    email_to: string;
    refresh_rate: number | null;
  } = {
    userId: null,
    email_to: '',
    refresh_rate: null
  };

  constructor(private userService: UserService, private router: Router, private fb: FormBuilder) {
    // this.userForm = this.fb.group({
    //   email_to: ['', [Validators.required, Validators.email]],
    //   refresh_rate: [900, Validators.required],
    //   city: ['', Validators.required],
    //   min_price: [800, Validators.required],
    //   max_price: [3000, Validators.required],
    //   min_bedrooms: [2, Validators.required],
    //   min_surface_area: [40, Validators.required],
    // });
  }

  ngOnInit() {
    this.userService.getUsers().subscribe(users => this.users = users);
  }

  sanitizeNumber(value: number | null): number {
    return value === null || isNaN(value) ? 0 : value;
  }

  addUser() {
    this.newConfig.min_surface_area = this.sanitizeNumber(this.newConfig.min_surface_area);
    this.newConfig.min_price = this.sanitizeNumber(this.newConfig.min_price);
    this.newConfig.max_price = this.sanitizeNumber(this.newConfig.max_price);
    this.newConfig.min_bedrooms = this.sanitizeNumber(this.newConfig.min_bedrooms);

    this.userService.createUser(this.newUser).subscribe({
      next: (res) => {
        const user_id = res.user_id;
        this.newUser.userId = user_id;

        this.userService.createSearchConfig(user_id, this.newConfig).subscribe(() => {
          this.showForm = false;
          this.ngOnInit();
          window.location.reload();
        });
      },
      error: () => alert('Failed to create user'),
    });
  }

  viewUser(id: number) {
    this.router.navigate(['/users', id]);
  }
}
