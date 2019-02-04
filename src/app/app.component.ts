import { Component, OnInit } from '@angular/core';

import { Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AuthData } from './providers/auth.provider';
import { Database } from './providers/database.provider';
import { Router } from '@angular/router';

import { get, set } from 'idb-keyval';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {

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
    private router: Router,
    private toastController: ToastController
  ) {
    this.initializeApp();
    this.checkMenu();
  }

  ngOnInit() {
    // Detects if device is on iOS
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };
    // Detects if device is in standalone mode
    const isInStandaloneMode = () => ('standalone' in (window as any).navigator) && ((window as any).navigator.standalone);

    // Show the banner once
    let isBannerShown = {};
    this.getInstallBanner().then(val => {
      isBannerShown = val;
    });

    // Checks if should display install popup notification:
    if (isIos() && !isInStandaloneMode() && isBannerShown === 'undefined') {
      this.showIosInstallBanner();
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.isLoggedIn();
    });
  }

  async getInstallBanner() {
    return await get('isInstallBannerShown');
  }

  setInstallBanner() {
    set('isInstallBannerShown', true);
  }

  async showIosInstallBanner() {
    const toast = await this.toastController.create({
      showCloseButton: true,
      closeButtonText: 'OK',
      cssClass: 'custom-toast',
      position: 'bottom',
      message: `To install the app, tap "Share" icon below and select "Add to Home Screen".`,
    });
    toast.present();
    this.setInstallBanner();
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
