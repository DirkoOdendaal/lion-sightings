
import { NavController,
    LoadingController,
    AlertController } from '@ionic/angular';

import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthData } from '../../providers/auth.provider';
import { EmailValidator } from '../../validators/email.validator';
/**
 * Generated class for the Landing page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-all-sightings',
  templateUrl: 'all-sightings.page.html',
})
export class AllSightingsPage {

    constructor() {
    }
}
