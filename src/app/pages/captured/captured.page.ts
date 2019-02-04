
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
/**
 * Generated class for the Landing page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
    selector: 'page-captured',
    templateUrl: 'captured.page.html',
})
export class CapturedPage {

    public sighting_id;

    constructor(public route: ActivatedRoute, public router: Router) {
        this.route.params.subscribe(params => {
            this.sighting_id = params['id'];
        });
    }

    captureSighting() {
        this.router.navigate(['/capture']);
    }

    viewMySightings() {
        this.router.navigate(['/view-sightings']);
    }
}
