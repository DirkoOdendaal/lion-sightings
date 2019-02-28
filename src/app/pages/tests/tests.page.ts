import { Component } from '@angular/core';
import { Platform, AlertController, LoadingController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Database } from '../../providers/database.provider';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { Camera } from '@ionic-native/camera/ngx';

@Component({
    selector: 'page-tests',
    templateUrl: 'tests.page.html',
})
export class TestsPage {

    loading: any;
    isLoading = true;
    blockShown = false;
    popover;

    constructor(private database: Database,
        private platform: Platform,
        private alertController: AlertController,
        private geolocation: Geolocation,
        private loadingController: LoadingController,
        private diagnostic: Diagnostic,
        private dialogs: Dialogs,
        public cropService: Crop,
        public camera: Camera) {

        this.platform.ready().then(() => {
            this.checkStatus();
        });

        this.platform.resume.subscribe(() => this.checkStatus);
    }

    onError(error) {
        console.error('The following error occurred: ' + error);
    }

    checkStatus() {
        this.diagnostic.getLocationAuthorizationStatus().then(status => {
            switch (status) {
                case this.diagnostic.permissionStatus.NOT_REQUESTED:
                    console.log('Permission not requested');
                    this.diagnostic.requestLocationAuthorization().then(this.checkStatus, this.onError);
                    break;
                case this.diagnostic.permissionStatus.DENIED:
                    console.log('Permission denied');
                    this.dialogs.confirm(
                        'The app has been denied permission to use location but requires it to pin the sighting location.' +
                        '\nWould you like to open the Settings page to manually allow location for the app?',
                        'Location permission is required', [
                            'Yes',
                            'No'
                        ]).then((val) => this.confirmCallback(val));
                    break;
                case this.diagnostic.permissionStatus.GRANTED:
                    console.log('Permission granted always');
                    break;
            }
        }, this.onError);
    }

    confirmCallback(i) {
        if (i === 1) {
            this.dialogs.alert(
                'The Settings page for the app will now open. Select \"Location\" and set it to \"While Using\"' +
                'then return to this app via the Home screen',
                'Opening Settings page'
            ).then(() => this.diagnostic.switchToSettings,
            () => this.checkStatus);
        }
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
            },
             () =>this.dialogs.confirm(
                'The app has been denied permission to use location but requires it to pin the sighting location.' +
                '\nWould you like to open the Settings page to manually allow location for the app?',
                'Location permission is required', [
                    'Yes',
                    'No'
                ]).then((val) => this.confirmCallback(val))
                )
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

    test4() {
        const options = {
            quality: 100,
            correctOrientation: true,
            saveToPhotoAlbum: true,
            allowEdit: true,
            mediaType: this.camera.MediaType.PICTURE
        };
        this.camera.getPicture(options)
            .then((data) => {
                this.cropService
                    .crop(data, { quality: 75 })
                    .then((newImage) => {
                        console.log(newImage);
                    });
            });
    }

    test5() {
        const options = {
            quality: 100,
            correctOrientation: true,
            saveToPhotoAlbum: true,
            allowEdit: true,
            mediaType: this.camera.MediaType.ALLMEDIA,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
        };
        this.camera.getPicture(options)
            .then((data) => {
                this.cropService
                    .crop(data, { quality: 75 })
                    .then((newImage) => {
                        console.log(newImage);
                    },
                    () => this.showCameraError());
            });
    }

    showCameraError() {
        this.dialogs.alert(
            'The Settings page for the app will now open. Select \"Camera\" and enable access ' +
            'then return to this app via the Home screen',
            'Opening Settings page'
        ).then(() => this.diagnostic.switchToSettings);
    }

    async showBlockingPopover(message) {
        this.popover = await this.alertController.create({
            backdropDismiss: false,
            keyboardClose: true,
            header: 'Ohh snap!!',
            message: message
        });
        return this.showBlocker(this.popover);
    }

    async showBlocker(popover) {
        if (!this.blockShown) {
            this.blockShown = true;
            await popover.present();
        }
    }

    async hideBlocker() {
        this.blockShown = false;
        await this.popover.dismiss();
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
