
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

        this.database.userDetails().subscribe((change) => {
            const updatedUsers = [];
            change.forEach(user => {
                if (!user.admin) {
                    updatedUsers.push(user);
                }
            });
            this.users = updatedUsers;
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
        console.log(user);
        const newUser: User = {
            firstname: user.firstname,
            surname: user.surname,
            email: user.email,
            admin: user.admin,
            allowed: true,
            denied: false,
            user_id: user.user_id
        };

        this.database.updateUser(newUser);
    }

    denyUser(user: User) {
        console.log(user);
        const newUser: User = {
            firstname: user.firstname,
            surname: user.surname,
            email: user.email,
            admin: user.admin,
            allowed: false,
            denied: true,
            user_id: user.user_id
        };

        this.database.updateUser(newUser);
    }

}
