
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
import { Sighting, Photo } from 'src/app/models';
import { Router } from '@angular/router';

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
    lat;
    lon;
    watching;

    constructor(public formBuilder: FormBuilder,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public router: Router,
        public imagePicker: ImagePicker,
        public cropService: Crop,
        public camera: Camera,
        public manageStorage: ManageStorage,
        public geolocation: Geolocation,
        public platform: Platform) {

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
        this.manageStorage.getAllAvailableLionIds().then(result => {
            result.forEach(element => {
                this.lionIdSelect.push(element.id);
            });
        });

        this.watching = this.geolocation.watchPosition().subscribe(pos => {
            this.lat = pos.coords.latitude;
            this.lon = pos.coords.longitude;
        });
    });
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
                    console.log('all images cropped!!');
                    this.photos.push(results);
                });
            }, (err) => { console.log(err); });
    }

    reduceImages(selected_pictures: any): any {
        return selected_pictures.reduce((promise: any, item: any) => {
            return promise.then((result) => {
                return this.cropService.crop(item, { quality: 75 })
                    .then(cropped_image => this.photosUrls.push(cropped_image));
            });
        }, Promise.resolve());
    }

    takePicture() {
        const options = {
            quality: 100,
            correctOrientation: true,
            saveToPhotoAlbum: true,
            allowEdit: true,
            mediaType: this.camera.MediaType.ALLMEDIA
        };
        this.camera.getPicture(options)
            .then((data) => {
                this.cropService
                    .crop(data, { quality: 75 })
                    .then((newImage) => {
                        this.photosUrls.push(newImage);
                    }, error => console.error('Error cropping image', error));
            }, function (error) {
                console.log(error);
            });
    }

    saveSighting() {
        // let latitude = 0;
        // let longitude = 0;

        // this.geolocation.getCurrentPosition().then((resp) => {
        //     latitude = resp.coords.latitude;
        //     longitude = resp.coords.longitude;
        this.watching.unsubscribe();
            if (!this.sightingForm.valid) {
                console.log(this.sightingForm.value);
            } else {
                this.presentLoading();

                let newSighting: Sighting;
                this.manageStorage.getNextSightingNumber().then(number => {

                    this.manageStorage.saveImages(this.photos, number).then(urls => {

                        console.log('savedImages');
                        console.log(urls);
                        urls.forEach(url => {
                            console.log(url);
                        });
                        this.photosUrls = urls;
                        console.log(this.photosUrls);
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
        // }).catch((error) => {
        //     console.log('Error getting location', error);
        // });

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
