import { Component } from '@angular/core';
import { LoadingController,
    AlertController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';

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
        public authData: AuthData) {

        this.loginForm = formBuilder.group({
            email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
            password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
        });

    }

    loginUser(): void {
        if (!this.loginForm.valid) {
            console.log(this.loginForm.value);
        } else {
            this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password).then(authData => {
                this.loading.dismiss().then(() => {
                    // this.navCtrl.setRoot(HomePage);
                });
            }, error => {
                this.loading.dismiss().then(() => {
                    this.alertPopUp(error);
                });
            });

            this.loading = this.loadingCtrl.create();
            this.loading.present();
        }
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

    goToSignup(): void {
        // this.navCtrl.navigate('', );
    }

    goToResetPassword(): void {
        // this.navCtrl.push(ResetPassword);
    }
}
