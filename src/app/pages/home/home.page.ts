import { Component } from '@angular/core';
import { Database } from '../../providers/database.provider';
import { User } from '../../models';
import { Router } from '@angular/router';
/**
 * Generated class for the Landing page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-home',
  templateUrl: 'home.page.html',
})
export class HomePage {

    user: User = {
        firstname: '',
        surname: '',
        email: '',
        admin: false,
        allowed: false
      };

    constructor(private database: Database, public router: Router) {

        this.database.getUserDetails().then(result => {
            this.user = {
              user_id: result.user_id,
              firstname: result.firstname,
              surname: result.surname,
              email: result.email,
              admin: result.admin,
              allowed: result.allowed
            };
          });
    }

    captureSighting() {
      this.router.navigate(['/capture']);
    }

    viewMySightings() {
      this.router.navigate(['/view-sightings']);
    }
}
