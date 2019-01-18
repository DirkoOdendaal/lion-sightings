
import { NavController,
    LoadingController,
    AlertController } from '@ionic/angular';

import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthData } from '../../providers/auth.provider';
import { EmailValidator } from '../../validators/email.validator';
/**
 * Generated class for the ResetPassword page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.page.html',
})
export class ResetPasswordPage {
    public resetPasswordForm;


    constructor(public authData: AuthData, public formBuilder: FormBuilder,
        public nav: NavController, public loadingCtrl: LoadingController,
        public alertCtrl: AlertController) {

        this.resetPasswordForm = formBuilder.group({
            email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
        });
    }

    /**
     * If the form is valid it will call the AuthData service to reset the user's password displaying a loading
     *  component while the user waits.
     *
     * If the form is invalid it will just log the form value, feel free to handle that as you like.
     */
    resetPassword() {
        if (!this.resetPasswordForm.valid) {
            console.log(this.resetPasswordForm.value);
        } else {
            this.authData.resetPassword(this.resetPasswordForm.value.email).then((user) => {
                this.alertPopUp('We just sent you a reset link to your email.');
            }, (error) => {
                const errorMessage: string = error.message;
                this.alertPopUp(errorMessage);
            });
        }
    }

    async alertPopUp(error) {
        const alert = await this.alertCtrl.create({
            message: error,
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
