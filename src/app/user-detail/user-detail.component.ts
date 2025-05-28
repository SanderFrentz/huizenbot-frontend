import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { UserService } from '../services/user.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatExpansionModule,
    FormsModule
  ],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  user: any;
  searchConfigs: any[] = [];
  isEditingUser: boolean = false;
  isAddingConfig: boolean = false;

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
  

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log(id);
    this.userService.getUserById(id).subscribe(user => this.user = user);
    this.userService.getUserSearchConfigs(id).subscribe(configs => this.searchConfigs = configs);
  }

  goBack() {
    this.router.navigate(['/users']);
  }

  updateUser() {
    const updatedData: any = {};
  
    if (this.user.refresh_rate !== undefined) {
      updatedData.refresh_rate = this.user.refresh_rate;
    }
  
    if (this.user.email_to !== undefined) {
      updatedData.email_to = this.user.email_to;
    }
  
    this.userService.updateUser(this.user.id, updatedData).subscribe(() => {
      alert("User updated!");
      window.location.reload();
    });
  }
  
  
  deleteConfig(configId: number) {
    this.userService.deleteSearchConfig(configId).subscribe(() => {
      this.searchConfigs = this.searchConfigs.filter(c => c.id !== configId);
    });
  }

  sanitizeNumber(value: number | null): number {
    return value === null || isNaN(value) ? 0 : value;
  }

  addConfig() {
    this.newConfig.min_surface_area = this.sanitizeNumber(this.newConfig.min_surface_area);
    this.newConfig.min_price = this.sanitizeNumber(this.newConfig.min_price);
    this.newConfig.max_price = this.sanitizeNumber(this.newConfig.max_price);
    this.newConfig.min_bedrooms = this.sanitizeNumber(this.newConfig.min_bedrooms);
    
    this.userService.createSearchConfig(this.user.id, this.newConfig).subscribe(config => {
      this.searchConfigs.push(config);
      this.newConfig = { city: '', min_price: 0, max_price: 0, min_bedrooms: 1, min_surface_area: 0, enabled: true };
      window.location.reload();
    });
  }

  deleteUser() {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(this.user.id).subscribe(() => {
        alert('User deleted.');
        this.router.navigate(['/users']);
      });
    }
  }  
}
