import { Component } from '@angular/core';
import { ManageStorage } from '../../providers/manage-storage.provider';
import { User } from '../../models';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

/**
 * Generated class for the Landing page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-home',
  templateUrl: 'home.page.html',
})
export class HomePage {

  loading: any;
  isLoading = true;

  user: User = {
    firstname: '',
    surname: '',
    email: '',
    admin: false,
    allowed: false,
    denied: false
  };

  constructor(private manageStorage: ManageStorage, public router: Router, public loadingCtrl: LoadingController) {

    this.presentLoading();

    this.manageStorage.getUserDetails().then(result => {
      this.user = {
        user_id: result.user_id,
        firstname: result.firstname,
        surname: result.surname,
        email: result.email,
        admin: result.admin,
        allowed: result.allowed,
        denied: result.denied
      };
      this.dismisLoading();
    }).catch(err => {
      console.log('Error', err);
    });
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create().then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss();
        }
      });
    });
  }

  async dismisLoading() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss();
  }

  captureSighting() {
    this.router.navigate(['/capture']);
  }

  viewMySightings() {
    this.router.navigate(['/view-sightings']);
  }
}
