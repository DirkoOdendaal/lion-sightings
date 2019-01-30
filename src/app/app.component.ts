import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AuthData } from './providers/auth.provider';
import { Database } from './providers/database.provider';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  public menu = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Sign up',
      url: '/register',
      icon: 'lock'
    },
    {
      title: 'Login',
      url: '/login',
      icon: 'lock'
    }
  ];

  public loggedIn = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private auth: AuthData,
    private database: Database,
    private router: Router
  ) {
    this.initializeApp();
    this.checkMenu();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.isLoggedIn();
    });
  }

  isLoggedIn() {
    if (!this.loggedIn && this.auth.authenticated) {
      this.loggedIn = true;
      this.checkMenu();
    } else if (!this.auth.authenticated && this.loggedIn) {
      this.loggedIn = false;
      this.checkMenu();
    }

    // else if (!this.loggedIn && !this.auth.authenticated) {
    //   this.checkMenu();
    // }
    return this.auth.authenticated;
  }

  checkMenu() {
    this.menu.splice(0, this.menu.length);
    if (this.auth.authenticated) {
      this.router.navigate(['/home']);
      this.menu.push(
        {
          title: 'Home',
          url: '/home',
          icon: 'home'
        },
        {
          title: 'Capture',
          url: '/capture',
          icon: 'lock'
        },
        {
          title: 'My sightings',
          url: '/view-sightings',
          icon: 'lock'
        }

      );

      if (this.database.getUserDetails().then(user => {
        return user.admin;
      })) {
        this.menu.push(
          {
            title: 'All user sightings',
            url: '/all-sightings',
            icon: 'lock'
          },
          {
            title: 'Manage users',
            url: '/manage',
            icon: 'lock'
          },
          {
            title: 'Lion ID',
            url: '/all-ids',
            icon: 'lock'
          },
          {
            title: 'Export',
            url: '/export',
            icon: 'lock'
          }
        );
      }

    } else {
      this.router.navigate(['/landing']);
      this.menu.push(
        {
          title: 'Home',
          url: '/home',
          icon: 'home'
        },
        {
          title: 'Sign up',
          url: '/register',
          icon: 'lock'
        },
        {
          title: 'Login',
          url: '/login',
          icon: 'lock'
        }
      );
    }
  }

  async isUserAdmin() {
    return this.database.getUserDetails().then(user => {
      return user.admin;
    });
  }

  logout() {
    this.auth.logoutUser();
    this.router.navigate(['/landing']);
  }
}
