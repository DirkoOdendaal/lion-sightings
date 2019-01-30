import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Database } from '../../providers/database.provider';
/**
 * Generated class for the Landing page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-sighting',
  templateUrl: 'sighting.page.html',
})
export class SightingPage {

    private sighting_id;
    private sighting;

    constructor(public route: ActivatedRoute, private database: Database) {

       this.route.params.subscribe(params => {
            this.sighting_id = +params['id'];
            this.database.getSightingById(this.sighting_id).then(result => {
                this.sighting = result;
            });
         });
    }
}
