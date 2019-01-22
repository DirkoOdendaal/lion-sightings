
import {
    NavController,
    LoadingController,
    AlertController
} from '@ionic/angular';

import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Database } from '../../providers/database.provider';
import { EmailValidator } from '../../validators/email.validator';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Sighting } from 'src/app/models';
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

    public sightingForm;
    loading: any;
    catchValue = false;
    photos = new Array<string>();

    constructor(public formBuilder: FormBuilder,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public imagePicker: ImagePicker,
        public cropService: Crop,
        public camera: Camera,
        public database: Database,
        public geolocation: Geolocation) {

        this.sightingForm = formBuilder.group({
            temperature: [0, Validators.compose([Validators.required])],
            adult_male: [0, Validators.compose([Validators.required])],
            adult_female: [0, Validators.compose([Validators.required])],
            adult_ids: [''],
            sub_adult_male: [0, Validators.compose([Validators.required])],
            sub_adult_female: [0, Validators.compose([Validators.required])],
            sub_adult_ids: [''],
            cub_male: [0, Validators.compose([Validators.required])],
            cub_female: [0, Validators.compose([Validators.required])],
            cub_unknown: [0, Validators.compose([Validators.required])],
            cub_ids: [''],
            activity: ['sleeping', Validators.compose([Validators.required])],
            catch: [false, Validators.compose([Validators.required])],
            catch_specie: [''],
            catch_sex: ['male'],
            catch_age: ['fresh'],
            carcass_utilization: ['10'],
            comments: ['']
        });
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
                    .then(cropped_image => this.photos.push(cropped_image));
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
                        this.photos.push(newImage);
                    }, error => console.error('Error cropping image', error));
            }, function (error) {
                console.log(error);
            });
    }

    saveSighting() {

        let latitude = 0;
        let longitude = 0;

        this.geolocation.getCurrentPosition().then((resp) => {
            console.log('Location!!!!!!!!!!!!!');
            console.log(resp.coords);
            latitude = resp.coords.latitude;
            longitude = resp.coords.longitude;
            if (!this.sightingForm.valid) {
                console.log(this.sightingForm.value);
            } else {
                console.log('Form valid');
                let newSighting: Sighting;
                this.database.getNextSightingNumber().then(number => {
                    newSighting = {
                        sighting_number: number,
                        user: '',
                        date_time: new Date(),
                        latitude: latitude,
                        longitude: longitude,
                        adult_female: this.sightingForm.value.adult_female,
                        adult_male: this.sightingForm.value.adult_male,
                        adult_id_list: this.sightingForm.value.adult_ids,
                        sub_adult_female: this.sightingForm.value.sub_adult_female,
                        sub_adult_male: this.sightingForm.value.sub_adult_male,
                        sub_adult_id_list: this.sightingForm.value.sub_adult_ids,
                        cub_female: this.sightingForm.value.cub_female,
                        cub_male: this.sightingForm.value.cub_male,
                        cub_unknown: this.sightingForm.value.cub_unknown,
                        cub_id_list: this.sightingForm.value.cub_ids,
                        catch: this.sightingForm.value.catch,
                        catch_age: this.sightingForm.value.catch_age,
                        catch_gender: this.sightingForm.value.catch_sex,
                        catch_species: this.sightingForm.value.catch_specie,
                        carcass_utilization: this.sightingForm.value.carcass_utilization,
                        comments: this.sightingForm.value.comments,
                        temperature: this.sightingForm.value.temperature,
                        photos: this.photos,
                        activity: this.sightingForm.value.activity
                    };

                    this.database.addSighting(newSighting);
                    this.loading.dismis();
                });
                this.loading = this.loadingCtrl.create();
                this.loading.present();
            }
        }).catch((error) => {
            console.log('Error getting location', error);
        });

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
