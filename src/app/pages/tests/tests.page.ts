import { Component } from '@angular/core';
import { Platform, AlertController, LoadingController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Database } from '../../providers/database.provider';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';

@Component({
    selector: 'page-tests',
    templateUrl: 'tests.page.html',
})
export class TestsPage {

    loading: any;
    isLoading = true;

    constructor(private database: Database,
        private platform: Platform,
        private alertController: AlertController,
        private geolocation: Geolocation,
        private loadingController: LoadingController,
        private diagnostic: Diagnostic) {

            // this.diagnostic.isLocationAuthorized()
            // .then(success => this.showSuccessAlert('startup', 'Granted'),
            // error => this.showErrorAlert('startup', 'Location service is not authorized'));

            // this.diagnostic.isLocationAvailable()
            // .then(success => this.showSuccessAlert('startup', 'Available'),
            // error => this.showErrorAlert('startup', 'Location service is not available'));

            // this.diagnostic.isLocationEnabled()
            // .then(success => this.showSuccessAlert('startup', 'Enabled'),
            //  error => this.showErrorAlert('startup', 'Location service is not enabled'));
    }

    test1() {
        this.presentLoading();
        this.database.setValue()
            .then(val => {
                this.dismisLoading();
                this.showSuccessAlert('test1', 'This works');
            }).catch(err => {
                this.dismisLoading();
                this.showErrorAlert('test1', err);
            });
    }

    test2() {
        this.presentLoading();
        this.geolocation.getCurrentPosition()
            .then(val => {
                this.dismisLoading();
                this.showSuccessAlert('test2', val.coords.latitude.toString() + ' ' + val.coords.longitude.toString());
            })
            .catch(err => {
                this.dismisLoading();
                console.log(err);
                console.log(err.code);
                this.showErrorAlert('test2', err.message);
            });
    }

    test3() {
        this.showSuccessAlert('test3', 'Okay, so the button works');
    }

    test5() {

    }

    async showSuccessAlert(test: string, message: string) {
        const alert = await this.alertController.create({
            header: `SUCCESS!!!!`,
            message: test + ' ' + message,
            buttons: [
                {
                    text: 'Close',
                    role: 'cancel',
                    cssClass: 'secondary',
                },
            ],
        });

        await alert.present();
    }

    async showErrorAlert(test: string, error) {
        const alert = await this.alertController.create({
            header: `ISSUES!!!!`,
            message: test + ' ' + error,
            buttons: [
                {
                    text: 'Close',
                    role: 'cancel',
                    cssClass: 'secondary',
                },
            ],
        });

        await alert.present();
    }

    async presentLoading() {
        this.isLoading = true;
        this.loading = await this.loadingController.create().then(a => {
            a.present().then(() => {
                if (!this.isLoading) {
                    a.dismiss();
                }
            });
        });
    }

    async dismisLoading() {
        this.isLoading = false;
        return await this.loadingController.dismiss();
    }
}
