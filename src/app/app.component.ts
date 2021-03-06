import { Component, OnInit } from '@angular/core';

import { Platform, ToastController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AuthData } from './providers/auth.provider';
import { Database } from './providers/database.provider';
import { ManageStorage } from './providers/manage-storage.provider';
import { Router } from '@angular/router';
import { User } from './models/user.model';
import { get, set } from 'idb-keyval';

import { SwUpdate } from '@angular/service-worker';

import { NetworkService, ConnectionStatus } from './services/network.service';
import { OfflineManagerService } from './services/offline-manager.service';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';

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
      icon: 'clipboard'
    },
    {
      title: 'Login',
      url: '/login',
      icon: 'unlock'
    }
  ];

  public loggedIn = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private auth: AuthData,
    private database: Database,
    private manageStorage: ManageStorage,
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
        this.manageStorage.currentUser().subscribe(user => {
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
          message: `Newer version is available. It's just a quick refresh away!`,
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
            }, {
              text: 'Refresh',
              handler: () => {
                this.swUpdate.activateUpdate().then(() => document.location.reload());
              },
            },
          ],
        });

        await alert.present();
      });
    }

    // Check if app back online and do updates to DB
    this.networkService
            .getNetworkStatus()
            .pipe(debounceTime(300))
            .subscribe((connected: boolean) => {
              if (connected) {
                this.database.getCurrentSightingNumber();
                this.database.getAllLionIds();
                this.offlineManagerService.checkForEvents().subscribe();
                this.offlineManagerService.checkForImageEvents().subscribe();
              }
              const toast = this.toastController.create({
                message: `You are now ${connected ? 'online' : 'offline'}`,
                duration: 3000,
                position: 'bottom'
            });
            toast.then(val => val.present());
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
            icon: 'locate'
          },
          {
            title: 'My sightings',
            url: '/view-sightings',
            icon: 'pin'
          }

        );
      }

      if (loggedInUser.admin === true && loggedInUser.allowed === true) {
        newMenu.push(
          {
            title: 'All user sightings',
            url: '/all-sightings',
            icon: 'map'
          },
          {
            title: 'Manage users',
            url: '/manage',
            icon: 'contacts'
          },
          {
            title: 'Lion ID',
            url: '/all-ids',
            icon: 'paw'
          },
          {
            title: 'Export',
            url: '/export',
            icon: 'mail'
          },
          {
            title: 'Tests',
            url: '/tests',
            icon: 'map'
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
          icon: 'clipboard'
        },
        {
          title: 'Login',
          url: '/login',
          icon: 'unlock'
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
