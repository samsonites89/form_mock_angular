import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Database, ref, set, get, child } from '@angular/fire/database';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-configuration',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css'],
})
export class ConfigurationComponent implements OnInit {
  password: string = ''; // Initialize password as an empty string
  passwordVisible: boolean = false; // Track password visibility

  constructor(private database: Database, private navService: NavigationService) {}

  ngOnInit(): void {
    this.loadPassword(); // Load password from Firebase on initialization
  }

  // Save the password to Firebase Realtime Database
  savePassword(): void {
    const dbRef = ref(this.database, 'password'); // Reference to the 'password' key in the database
    set(dbRef, this.password)
      .then(() => {
        alert('Password saved successfully to Firebase!');
      })
      .catch((error) => {
        console.error('Error saving password to Firebase:', error);
        alert('Failed to save password to Firebase.');
      });
  }

  // Load the password from Firebase Realtime Database
  loadPassword(): void {
    const dbRef = ref(this.database);
    get(child(dbRef, 'password'))
      .then((snapshot) => {
        if (snapshot.exists()) {
          this.password = snapshot.val(); // Set the password if it exists in Firebase
          console.log('Password loaded from Firebase:', this.password);
        } else {
          console.log('No password found in Firebase.');
        }
      })
      .catch((error) => {
        console.error('Error loading password from Firebase:', error);
      });
  }

  // Toggle password visibility
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  goHome(): void {
    this.navService.navigateToHome(); // Navigate to the home page
  }

}
