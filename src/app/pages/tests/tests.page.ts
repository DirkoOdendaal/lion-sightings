import { Component } from '@angular/core';
import { Platform, AlertController, LoadingController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Database } from '../../providers/database.provider';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import fixOrientation from 'fix-orientation';
import { Photo } from 'src/app/models/photo.model';
import { ManageStorage } from 'src/app/providers/manage-storage.provider';

@Component({
    selector: 'page-tests',
    templateUrl: 'tests.page.html',
})
export class TestsPage {

    loading: any;
    isLoading = true;
    blockShown = false;
    popover;
    imgDisplay = [];
    photos: Photo[] = [];
    photoCounter = 1;

    constructor(private database: Database,
        private platform: Platform,
        private alertController: AlertController,
        private geolocation: Geolocation,
        private loadingController: LoadingController,
        private diagnostic: Diagnostic,
        private dialogs: Dialogs,
        public cropService: Crop,
        public manageStorage: ManageStorage,
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

    test1Online() {
        this.presentLoading();
        this.database.setValue()
            .then(val => {
                this.showSuccessAlert('test1Online', `This works ${val}`);
                this.dismisLoading();
            }).catch(err => {
                this.showErrorAlert('test1Online', err);
                this.dismisLoading();
            });
    }

    test1Offline() {
        this.presentLoading();
        this.manageStorage.setValue()
            .then(val => {
                this.showSuccessAlert('test1Offline', `This works ${val}`);
                this.dismisLoading();
            }).catch(err => {
                this.showErrorAlert('test1Offline', err);
                this.dismisLoading();
            });
    }

    test2() {
        this.presentLoading();
        this.geolocation.getCurrentPosition()
            .then(val => {
                this.showSuccessAlert('test2', val.coords.latitude.toString() + ' ' + val.coords.longitude.toString());
                this.dismisLoading();
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
                this.showErrorAlert('test2', err.message);
                this.dismisLoading();
            });
    }

    test3() {
        this.showSuccessAlert('test3', 'Okay, so the button works');
    }

    test4() {
            const options = {
                quality: 100,
                destinationType: this.camera.DestinationType.DATA_URL,
                encodingType: this.camera.EncodingType.JPEG,
                sourceType: this.camera.PictureSourceType.CAMERA,
                mediaType: this.camera.MediaType.PICTURE
            };
            this.camera.getPicture(options)
                .then((data) => {
                    this.manageOrientation(data);
                });
            this.camera.cleanup();
    }

    test5() {
        const options = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
        };
        this.camera.getPicture(options)
            .then((data) => {
                this.manageOrientation(data);
            }, this.showCameraError);
    }

    manageOrientation(data) {
        const base64 = 'data:image/jpeg;base64,' + data;

        // FIXING ORIENTATION USING NPM PLUGIN fix-orientation
        fixOrientation(base64, { image: true }, (fixed: string, image: any) => {
            // fixed IS THE NEW VERSION FOR DISPLAY PURPOSES
            this.imgDisplay.push(fixed);
            const newPhoto: Photo = {
                name: '',
                file: fixed
            };
            this.photos.push(newPhoto);
            this.photoCounter++;
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
