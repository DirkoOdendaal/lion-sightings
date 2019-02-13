
import { LoadingController } from '@ionic/angular';
import { Component } from '@angular/core';
import { ManageStorage } from '../../providers/manage-storage.provider';
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

    constructor(public manageStorage: ManageStorage, public loadingCtrl: LoadingController) {
        this.presentLoading();
        this.manageStorage.getAllUsers().then(users => {
            this.users = users;
            this.dismisLoading();
        });

        this.manageStorage.userDetails().subscribe((change) => {
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
        const newUser: User = {
            firstname: user.firstname,
            surname: user.surname,
            email: user.email,
            admin: user.admin,
            allowed: true,
            denied: false,
            user_id: user.user_id
        };

        this.manageStorage.updateUser(newUser);
    }

    denyUser(user: User) {
        const newUser: User = {
            firstname: user.firstname,
            surname: user.surname,
            email: user.email,
            admin: user.admin,
            allowed: false,
            denied: true,
            user_id: user.user_id
        };

        this.manageStorage.updateUser(newUser);
    }

}
