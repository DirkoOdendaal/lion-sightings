
import { LoadingController, ToastController } from '@ionic/angular';

import { Component } from '@angular/core';
import { Sighting } from '../../models';
import { ManageStorage } from '../../providers/manage-storage.provider';
import { Router } from '@angular/router';
import { EmailService } from '../../services/email.service';
/**
 * Generated class for the Landing page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
    selector: 'page-export',
    templateUrl: 'export.page.html',
})
export class ExportPage {

    loading: any;
    isLoading = true;
    name = 'Tito';
    emailAddress = 'tito@mail.com';

    public sightings: Array<Sighting> = [];
    constructor(public manageStorage: ManageStorage, public router: Router,
        public loadingCtrl: LoadingController, public emailService: EmailService,
        private toastController: ToastController) {
        this.presentLoading();
        this.manageStorage.getSightingsForAllUsers().then(sightings => {
            this.sightings = sightings;
            this.dismisLoading();
        });

        this.manageStorage.getUserDetails().then(user => {
            this.name = user.firstname;
            this.emailAddress = user.email;
        }).catch(err => console.log('export error', err));
    }

    async presentLoading() {
        this.isLoading = true;
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

   async exportAll() {
        this.presentLoading();
        this.emailService.requestEmail(this.emailAddress).then(result => {
            if (result === 200) {
               this.showToast('Email sent');
            } else {
                this.showToast('Gasp, issue with sending email...');
            }
            this.dismisLoading();
        });
    }

    async showToast(message: string) {
        const toast = await this.toastController.create({
            showCloseButton: true,
            closeButtonText: 'OK',
            position: 'bottom',
            message: message,
            color: 'primary'
          });
          toast.present();
    }

}
