import { Lawton } from '@/pages/forms/lawton/lawton';
import { Home } from '@/pages/home/home';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'lawton', component: Lawton },
];
