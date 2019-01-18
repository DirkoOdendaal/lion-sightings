import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule'
  },
  {
    path: 'register',
    loadChildren: '../pages/signup/signup.module#SignUpPageModule'
  },
  {
    path: 'login',
    loadChildren: '../pages/signin/signin.module#SignInPageModule'
  },
  {
    path: 'reset-password',
    loadChildren: '../pages/reset-password/reset-password.module#ResetPasswordPageModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
