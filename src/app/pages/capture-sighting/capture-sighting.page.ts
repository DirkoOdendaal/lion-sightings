
import {
    LoadingController,
    AlertController,
    Platform
} from '@ionic/angular';

import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ManageStorage } from '../../providers/manage-storage.provider';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Sighting, Photo } from 'src/app/models';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import fixOrientation from 'fix-orientation';
/**
 * Generated class for the Landing page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
    selector: 'page-capture-sighting',
    templateUrl: 'capture-sighting.page.html',
})
export class CaptureSightingPage {
    @ViewChild('captureForm') formValues;
    imgDisplay = [];
    photos: Photo[] = [];
    photoCounter = 1;

    public sightingForm;
    loading: any;
    catchValue = false;
    lionIdSelect = [];
    isLoading = true;
    photosUrls: string[] = [];
    lat = 0;
    lon = 0;
    watching;
    blockShown = false;
    popover;

    constructor(public formBuilder: FormBuilder,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public router: Router,
        public imagePicker: ImagePicker,
        public cropService: Crop,
        public camera: Camera,
        public manageStorage: ManageStorage,
        public geolocation: Geolocation,
        public platform: Platform,
        public diagnostic: Diagnostic,
        public dialogs: Dialogs,
        public domSanitizer: DomSanitizer) {

        this.sightingForm = formBuilder.group({
            temperature: [0, Validators.compose([Validators.required])],
            adult_male: [0, Validators.compose([Validators.required])],
            adult_female: [0, Validators.compose([Validators.required])],
            sub_adult_male: [0, Validators.compose([Validators.required])],
            sub_adult_female: [0, Validators.compose([Validators.required])],
            cub_male: [0, Validators.compose([Validators.required])],
            cub_female: [0, Validators.compose([Validators.required])],
            cub_unknown: [0, Validators.compose([Validators.required])],
            lion_id_list: [''],
            activity: ['sleeping', Validators.compose([Validators.required])],
            catch: [false, Validators.compose([Validators.required])],
            catch_specie: [''],
            catch_sex: ['male'],
            catch_age: ['fresh'],
            carcass_utilization: ['10'],
            comments: ['']
        });
        this.platform.ready().then(() => {

            this.checkStatus();

            this.watching = this.geolocation.watchPosition().subscribe(pos => {
                this.hideBlocker();
                this.lat = pos.coords.latitude;
                this.lon = pos.coords.longitude;

            },
                () => this.dialogs.alert(
                    'The app has been denied permission to use location but requires it to pin the sighting location.' +
                    'The Settings page for the app will now open. Select \"Location\" and set it to \"While Using\"' +
                    'then return to this app via the Home screen',
                    'Location permission is required'
                ).then(() => this.diagnostic.switchToSettings()));

            this.manageStorage.getAllAvailableLionIds().then(result => {
                result.forEach(element => {
                    this.lionIdSelect.push(element.id);
                });
            });

            // this.diagnostic.isLocationEnabled().then((res) => {
            //     this.hideBlocker();
            //     if (res === true) {
            //         this.diagnostic.isLocationAuthorized().then(() => this.hideBlocker(), () => {
            //             this.showBlockingPopover('You have not given us access to your location. '
            //                 + 'Please authorize access as we require access to your location in order to pin the sighting.');
            //         });
            //     }
            // }, () => {
            //     this.showBlockingPopover('We see that your location service is off. '
            //         + 'Please switch this on and try again. We require access to your location in order to pin the sighting.');
            // });
        });

        this.platform.resume.subscribe(() => this.checkStatus());
    }

    checkStatus() {
        this.diagnostic.getLocationAuthorizationStatus().then(status => {
            this.hideBlocker();
            switch (status) {
                case this.diagnostic.permissionStatus.NOT_REQUESTED:
                    console.log('Permission not requested');
                    this.diagnostic.requestLocationAuthorization().then(() => this.checkStatus(), this.showBlockingPopover);
                    break;
                case this.diagnostic.permissionStatus.DENIED:
                    console.log('Permission denied');
                        this.dialogs.alert(
                            'The app has been denied permission to use location but requires it to pin the sighting location.' +
                            'The Settings page for the app will now open. Select \"Location\" and set it to \"While Using\"' +
                            'then return to this app via the Home screen',
                            'Location permission is required'
                        ).then(() => this.diagnostic.switchToSettings());
                    break;
                case this.diagnostic.permissionStatus.GRANTED:
                    console.log('Permission granted always');
                    break;
            }
        }, this.showBlockingPopover);
    }

    confirmCallback(i) {
        if (i === 1) {
            this.dialogs.alert(
                'The Settings page for the app will now open. Select \"Location\" and set it to \"While Using\"' +
                'then return to this app via the Home screen',
                'Opening Settings page'
            ).then(() => this.diagnostic.switchToSettings(),
            () => this.checkStatus());
        }
    }


    async showBlockingPopover(message) {
        this.popover = await this.alertCtrl.create({
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

    displayCard() {
        return this.imgDisplay.length > 0;
    }

    uploadFiles(e) {
        this.presentLoading();
        for (let i = 0; i < e.target.files.length; i++) {
            const file: File = e.target.files[i];

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {

                const base64 = reader.result as string;

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
                    this.dismisLoading();
                });
            };
        }
    }

    catch() {
        if (this.catchValue) {
            this.sightingForm.value.catch = false;
            this.catchValue = false;
        } else {
            this.sightingForm.value.catch = true;
            this.catchValue = true;
        }
    }

    openImagePicker() {
        const options = {
            maximumImagesCount: 5,
        };
        this.imagePicker.getPictures(options)
            .then((results) => {
                this.reduceImages(results).then(() => {
                    this.photos.push(results);
                });
            });
    }

    reduceImages(selected_pictures: any): any {
        return selected_pictures.reduce((promise: any, item: any) => {
            return promise.then((result) => {
                return this.cropService.crop(item)
                    .then(cropped_image => this.photosUrls.push(cropped_image));
            });
        }, Promise.resolve());
    }

    takePicture() {
        const options = {
            quality: 100,
            correctOrientation: true,
            destinationType: this.camera.DestinationType.DATA_URL,
            mediaType: this.camera.MediaType.PICTURE
        };
        this.camera.getPicture(options)
            .then((data) => {
                this.manageOrientation(data);
            }, () => this.showCameraPhotoError());
            this.camera.cleanup();
    }

    uploadMedia () {
        const options = {
            quality: 100,
            correctOrientation: true,
            mediaType: this.camera.MediaType.ALLMEDIA,
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
        };
        this.camera.getPicture(options)
            .then((data) => {
                this.manageOrientation(data);
            }, () => this.showCameraPhotoError());
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

    showCameraPhotoError() {
        this.alertPopUp('Sorry, we are having a problem accessing the photo you are trying to add.');
    }

    showCameraError() {
        this.dialogs.alert(
            'The Settings page for the app will now open. Select \"Camera\" and enable access ' +
            'then return to this app via the Home screen',
            'Opening Settings page'
        ).then(() => this.diagnostic.switchToSettings());
    }

    saveSighting() {
        this.watching.unsubscribe();
        if (this.sightingForm.valid) {
            this.presentLoading();

            if (this.lat === 0 && this.lon === 0) {
                this.checkStatus();
                return;
            }

            let newSighting: Sighting;
            this.manageStorage.getNextSightingNumber().then(number => {

                this.manageStorage.saveImages(this.photos, number).then(urls => {

                    this.photosUrls = urls;
                    newSighting = {
                        sighting_number: number,
                        user: '',
                        latitude: this.lat,
                        longitude: this.lon,
                        adult_female: this.sightingForm.value.adult_female,
                        adult_male: this.sightingForm.value.adult_male,
                        sub_adult_female: this.sightingForm.value.sub_adult_female,
                        sub_adult_male: this.sightingForm.value.sub_adult_male,
                        cub_female: this.sightingForm.value.cub_female,
                        cub_male: this.sightingForm.value.cub_male,
                        cub_unknown: this.sightingForm.value.cub_unknown,
                        lion_id_list: this.sightingForm.value.lion_id_list,
                        catch: this.sightingForm.value.catch,
                        catch_age: this.sightingForm.value.catch_age,
                        catch_gender: this.sightingForm.value.catch_sex,
                        catch_species: this.sightingForm.value.catch_specie,
                        carcass_utilization: this.sightingForm.value.carcass_utilization,
                        comments: this.sightingForm.value.comments,
                        temperature: this.sightingForm.value.temperature,
                        photos: this.photosUrls,
                        activity: this.sightingForm.value.activity
                    };
                    this.manageStorage.addSighting(newSighting).then(result => {
                        this.dismisLoading();
                        this.formValues.resetForm();
                        if (result) {
                            this.router.navigate(['/captured/', result]);
                        }
                    });
                });
            });
        }

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

    async alertPopUp(error) {
        console.log(error);
        const alert = await this.alertCtrl.create({
            message: error.message,
            buttons: [
                {
                    text: 'Ok',
                    role: 'cancel'
                }
            ]
        });
        alert.present();
    }
}
