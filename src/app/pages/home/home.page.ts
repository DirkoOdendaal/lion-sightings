import { Component } from '@angular/core';
import { Database } from '../../providers/database.provider';
import { User } from '../../models';
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
        admin: false
      };

    constructor(private database: Database) {

        this.database.getUserDetails().then(result => {
            this.user = {
              user_id: result.user_id,
              firstname: result.firstname,
              surname: result.surname,
              email: result.email,
              admin: result.admin
            };
          });
    }
}
