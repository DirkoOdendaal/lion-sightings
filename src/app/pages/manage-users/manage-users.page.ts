
import { LoadingController, AlertController } from '@ionic/angular';

import { Component } from '@angular/core';
import { Database } from '../../providers/database.provider';
import { User } from '../../models';
/**
 * Generated class for the Landing page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-manage-users',
  templateUrl: 'manage-users.page.html',
})
export class ManageUsersPage {

    loading: any;
    isLoading = true;
    public users: Array<User> = [];

    constructor(public database: Database, public loadingCtrl: LoadingController) {
        this.presentLoading();
        this.database.getAllUsers().then(users => {
            this.users = users;
            this.dismisLoading();
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

    allowUser(user: User) {

    }

    denyUser(user: User) {

    }

}
