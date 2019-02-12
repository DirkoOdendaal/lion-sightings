import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ManageStorage } from '../../providers/manage-storage.provider';
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

    sighting_id;
    sighting;

    constructor(public route: ActivatedRoute, private manageStorage: ManageStorage) {

       this.route.params.subscribe(params => {
            this.sighting_id = +params['id'];
            this.manageStorage.getSightingById(this.sighting_id).then(result => {
                this.sighting = result;
            });
         });
    }
}
