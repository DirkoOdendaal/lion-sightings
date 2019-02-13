import { Component } from '@angular/core';
import { LoadingController,
    AlertController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthData } from '../../providers/auth.provider';
import { EmailValidator } from '../../validators/email.validator';
import { User } from '../../models';


/**
 * Generated class for the Signup page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.page.html',
})
export class SignUpPage {

    public signupForm;
    loading: any;
    passwordSame = true;
    isLoading = true;


    constructor(public authData: AuthData,
        public formBuilder: FormBuilder, public loadingCtrl: LoadingController,
        public alertCtrl: AlertController) {

        this.signupForm = formBuilder.group({
            firstname: ['', Validators.compose([Validators.required])],
            surname: ['', Validators.compose([Validators.required])],
            email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
            passwordCheck: ['', Validators.compose([Validators.minLength(6), Validators.required])],
            password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
        });
    }

    /**
     * If the form is valid it will call the AuthData service to sign the user up password displaying a loading
     *  component while the user waits.
     *
     * If the form is invalid it will just log the form value, feel free to handle that as you like.
     */
    signupUser() {
        this.presentLoading();
        if (!this.signupForm.valid) {
            // console.log(this.signupForm.value);
            this.dismisLoading();
        } else {
            const newUser: User = {
                firstname: this.signupForm.value.firstname,
                surname: this.signupForm.value.surname,
                email: this.signupForm.value.email,
                admin: false,
                allowed: false,
                denied: false
            };


            this.authData.signupUser(newUser, this.signupForm.value.password)
                .then(() => {
                    this.dismisLoading();
                });
        }
    }

    async presentLoading() {
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

    checkSame() {
        if (this.signupForm.controls.passwordCheck.valid) {

            if (this.signupForm.value.passwordCheck === this.signupForm.value.password) {
                this.passwordSame = true;
            } else {
                this.passwordSame = false;
            }
        }
    }

    showCheckSameError() {
        return !this.passwordSame
        && (this.signupForm.controls.password
            && this.signupForm.controls.passwordCheck)
            && this.signupForm.value.passwordCheck.length > 5
            && this.signupForm.value.password.length > 5 ? true : false;
    }

}
