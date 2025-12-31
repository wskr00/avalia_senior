import { Lawton } from '@/pages/forms/lawton/lawton';
import { Home } from '@/pages/home/home';
import { Routes } from '@angular/router';
import { Katz } from '@/pages/forms/katz/katz';
import { Gds } from '@/pages/forms/gds/gds';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'lawton', component: Lawton },
  { path: 'katz', component: Katz },
  { path: 'gds', component: Gds },
];
