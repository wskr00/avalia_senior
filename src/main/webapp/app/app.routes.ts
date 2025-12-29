import { Routes } from '@angular/router';
import { Home } from '../pages/home/home';
import { Lawton } from '../pages/forms/lawton/lawton';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'lawton', component: Lawton },
];
