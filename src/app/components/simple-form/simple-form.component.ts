import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Database, ref, set, get, child, DataSnapshot } from '@angular/fire/database';
import { NavigationService } from '../../services/navigation.service';
import { CreateRequestBody, CompleteRequestBody } from '../../models/request.model'; // Adjust the path as needed
import { FormService } from '../../services/form.service';
import { from } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-simple-form',
  templateUrl: './simple-form.component.html',
  styleUrl: './simple-form.component.css'
})
export class SimpleFormComponent implements OnInit {
  id: string | null = null; // Store the ID from the route
  password: string | null = null; // Store the password from localStorage

  constructor(
    private route: ActivatedRoute,
    private database: Database,
    private navService: NavigationService,
    private formService: FormService
  ) {}

  ngOnInit(): void {
    // Retrieve the 'id' parameter from the route
    this.id = this.route.snapshot.paramMap.get('id');

    const dbRef = ref(this.database);

    from(get(child(dbRef, 'password')))
    .pipe(
      finalize(() => {
        console.log('Password retrieval process completed.');
      })
    )
    .subscribe({
      next: (snapshot) => {
        if (snapshot.exists()) {
          this.password = snapshot.val(); // Set the password if it exists in Firebase
        } else {
          console.log('No password found in Firebase.');
        }
      },
      error: (error) => {
        console.error('Error loading password from Firebase:', error);
      }
    });
  }

  onSubmit(): void {
    console.log('Form submitted!');
    this.emitMessageToParent();
  }

  emitMessageToParent(): void {
    console.log('Emitting message to parent window...');
    if (window.parent && window.parent !== window) {
      const payload: CompleteRequestBody = {
        status: 'completed',
        smart_action_id: 1,
      };
      const message = this.formService.CreateFormCompletedPayload(payload);
      console.log(message);
      window.parent.postMessage(message, '*'); // Send the message to the parent window
    }
  }

  goBack(): void {
    this.navService.navigateTo('/'); // Navigate to the home page
  }
}
