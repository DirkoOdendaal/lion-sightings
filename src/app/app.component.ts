import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'List',
      url: '/list',
      icon: 'list'
    },
    {
      title: 'Landing',
      url: '/landing',
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
    },
    {
      title: 'Capture',
      url: '/capture',
      icon: 'lock'
    },
    {
      title: 'Manage users',
      url: '/manage',
      icon: 'lock'
    },
    {
      title: 'View history',
      url: '/history',
      icon: 'lock'
    },
    {
      title: 'Export',
      url: '/export',
      icon: 'lock'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
