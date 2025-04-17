import { Routes } from '@angular/router';
import { FormPreviewComponent } from './components/form-preview/form-preview.component';
import { HomeComponent } from './components/home/home.component';
import { SimpleFormComponent } from './components/simple-form/simple-form.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';

export const routes: Routes = [
  {
    path: '', component: HomeComponent,
  },
  {
    path: 'preview', component: FormPreviewComponent,
  },
  {
    path: 'form', redirectTo: 'form/1', pathMatch: 'full',
  },
  {
    path: 'form/:id', component: SimpleFormComponent,
  },
  {
    path: 'configs', component: ConfigurationComponent, // Add configuration route
  },
  // {
  //   path: '**',
  //   redirectTo: '',
  //   pathMatch: 'full',
  // },
];
