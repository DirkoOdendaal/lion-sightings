import { Component } from '@angular/core';
import { LoadingController,
    AlertController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { EmailValidator } from '../../validators/email.validator';
import { AuthData } from '../../providers/auth.provider';

/**
 * Generated class for the Login page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
    selector: 'page-signin',
    templateUrl: 'signin.page.html',
  })
export class SignInPage {
    public loginForm;
    loading: any;

    constructor( public formBuilder: FormBuilder,
        public alertCtrl: AlertController, public loadingCtrl: LoadingController,
        public authData: AuthData, public router: Router) {

        this.loginForm = formBuilder.group({
            email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
            password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
        });

    }

   loginUser(): void {
        console.log('!!!!!!!!!!!SUBMITTING!!!!!!!!!!');
        if (!this.loginForm.valid) {
            console.log(this.loginForm.value);
        } else {
            this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password).then(authData => {
                this.dismisAndRoute();
            }, error => {
               this.dismisWithError(error);
            });

            this.createLoader();
        }
    }

    async dismisAndRoute() {
        await this.loading.dismiss().then(() => {
            this.router.navigate(['/home']);
       });
    }

    async dismisWithError(error) {
        await this.loading.dismiss().then(() => {
            this.alertPopUp(error);
        });
    }

    async createLoader() {
        this.loading = await this.loadingCtrl.create();
        await this.loading.present();
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
