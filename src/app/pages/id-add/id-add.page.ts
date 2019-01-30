
import { LoadingController } from '@ionic/angular';

import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LionId } from '../../models';
import { Database } from '../../providers/database.provider';
import { Router } from '@angular/router';
/**
 * Generated class for the Landing page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
    selector: 'page-id-add',
    templateUrl: 'id-add.page.html',
})
export class IdAddPage {

    loading: any;
    isLoading = true;
    public lionIdForm;

    public lionIds: Array<LionId> = [];
    constructor(public database: Database, public router: Router, public loadingCtrl: LoadingController, public formBuilder: FormBuilder) {
        this.lionIdForm = formBuilder.group({
            id: ['', Validators.compose([Validators.required])]
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

    addId() {
        this.presentLoading();
        const newId: LionId = {
            id: this.lionIdForm.value.id,
            sold: false,
            died: false,
            lost: false
        };
        this.database.addId(newId).then(response => {

            setTimeout(() => {
                this.dismisLoading();
                this.router.navigate(['/all-ids']);
            }, 100);
        });
    }
}
