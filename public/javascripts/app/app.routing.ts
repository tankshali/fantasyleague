import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent }  from './home.component';
import { DashboardComponent }  from './dashboard.component';
import { TeamSelectionComponent }  from './teamselection.component';
import { RulesComponent }  from './rules.component';
import { ScoringComponent }  from './scoring.component';
import { PerformanceComponent }  from './performance.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'teamselection', component: TeamSelectionComponent },
  { path: 'rules', component: RulesComponent },
  { path: 'scoring', component: ScoringComponent },
  { path: 'viewperformances', component: PerformanceComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, { useHash: true });