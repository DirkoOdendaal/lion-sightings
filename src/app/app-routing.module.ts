import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './pages/home/home.module#HomePageModule'
  },
  {
    path: 'landing',
    loadChildren: './pages/landing/landing.module#LandingPageModule'
  },
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule'
  },
  {
    path: 'register',
    loadChildren: './pages/signup/signup.module#SignUpPageModule'
  },
  {
    path: 'login',
    loadChildren: './pages/signin/signin.module#SignInPageModule'
  },
  {
    path: 'history',
    loadChildren: './pages/view-sightings/view-sightings.module#ViewSightingsPageModule'
  },
  {
    path: 'manage',
    loadChildren: './pages/manage-users/manage-users.module#ManageUsersPageModule'
  },
  {
    path: 'capture',
    loadChildren: './pages/capture-sighting/capture-sighting.module#CaptureSightingPageModule'
  },
  {
    path: 'view-sightings',
    loadChildren: './pages/view-sightings/view-sightings.module#ViewSightingsPageModule'
  },
  {
    path: 'all-sightings',
    loadChildren: './pages/all-sightings/all-sightings.module#AllSightingsPageModule'
  },
  {
    path: 'export',
    loadChildren: './pages/export/export.module#ExportPageModule'
  },
  {
    path: 'sighting/:id',
    loadChildren: './pages/sighting/sighting.module#SightingPageModule'
  },
  {
    path: 'all-ids',
    loadChildren: './pages/all-ids/all-ids.module#AllIdsPageModule'
  },
  {
    path: 'add-id',
    loadChildren: './pages/id-add/id-add.module#IdAddPageModule'
  },
  {
    path: 'reset-password',
    loadChildren: './pages/reset-password/reset-password.module#ResetPasswordPageModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
