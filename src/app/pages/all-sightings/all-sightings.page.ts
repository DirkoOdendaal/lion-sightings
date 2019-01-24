
import { LoadingController } from '@ionic/angular';

import { Component } from '@angular/core';
import { Sighting } from '../../models';
import { Database } from '../../providers/database.provider';
import { Router } from '@angular/router';
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

    loading: any;
    isLoading = true;

    public sightings: Array<Sighting> = [];
    constructor(public database: Database, public router: Router, public loadingCtrl: LoadingController) {
        this.presentLoading();
        this.database.getSightingsForAllUsers().then(sightings => {
            this.sightings = sightings;
            this.dismisLoading();
        });
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

    captureSighting() {
        this.router.navigate(['/capture']);
    }

    viewDetail(sighting: Sighting) {
        this.router.navigate(['/sighting/', sighting.sighting_number]);
    }

}
