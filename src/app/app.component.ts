import { Component, OnInit } from '@angular/core';

import { Platform, ToastController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AuthData } from './providers/auth.provider';
import { Database } from './providers/database.provider';
import { Router } from '@angular/router';
import { User } from './models/user.model';
import { get, set } from 'idb-keyval';

import { SwUpdate } from '@angular/service-worker';

import { NetworkService, ConnectionStatus } from './services/network.service';
import { OfflineManagerService } from './services/offline-manager.service';

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
    private toastController: ToastController,
    private alertController: AlertController,
    private swUpdate: SwUpdate,
    private networkService: NetworkService,
    private offlineManagerService: OfflineManagerService
  ) {
    this.initializeApp();

    this.auth.auth.auth.onAuthStateChanged((state) => {
      if (state != null && state.uid != null) {
        this.database.currentUser().subscribe(user => {
          this.checkMenu(user);
        });
      }
    });
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

    // Check for updates
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(async () => {
        const alert = await this.alertController.create({
          header: `Ooo shiny!`,
          message: `Newer version of the app is available. It's a quick refresh away!`,
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
            }, {
              text: 'Refresh',
              handler: () => {
                window.location.reload();
              },
            },
          ],
        });

        await alert.present();
      });
    }

    // Check if app back online and do updates to DB
    this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
      if (status === ConnectionStatus.Online) {
        this.offlineManagerService.checkForEvents().subscribe();
        this.offlineManagerService.checkForImageEvents().subscribe();
      }
    });

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      setTimeout(() => {
        this.splashScreen.hide();
      }, 1500);
    });
  }

  async getInstallBanner() {
    return await get('isInstallBannerShow');
  }

  setInstallBanner() {
    set('isInstallBannerShow', true);
  }

  async showIosInstallBanner() {
    const toast = await this.toastController.create({
      showCloseButton: true,
      closeButtonText: 'OK',
      position: 'bottom',
      message: `To install the app, tap "Share" icon below and select "Add to Home Screen".`,
    });
    toast.present();
    this.setInstallBanner();
  }

  isLoggedIn() {
    return this.auth.authenticated;
  }

  checkMenu(loggedInUser?: User) {
    const newMenu = [];
    this.menu.splice(0, this.menu.length);
    if (loggedInUser) {
      this.router.navigate(['/home']);
      newMenu.push(
        {
          title: 'Home',
          url: '/home',
          icon: 'home'
        }
      );
      if (loggedInUser.allowed === true) {
        newMenu.push(
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
      }

      if (loggedInUser.admin === true && loggedInUser.allowed === true) {
        newMenu.push(
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
      newMenu.push(
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
    this.menu = newMenu;
  }

  logout() {
    this.auth.logoutUser();
    this.router.navigate(['/landing']);
    this.checkMenu();
  }
}
