
import { LoadingController, ActionSheetController } from '@ionic/angular';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet/ngx';
import { Component } from '@angular/core';
import { LionId } from '../../models';
import { Database } from '../../providers/database.provider';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';

/**
 * Generated class for the Landing page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
    selector: 'page-all-ids',
    templateUrl: 'all-ids.page.html',
})
export class AllIdsPage {

    loading: any;
    isLoading = true;
    lionIdsList = [];

    public lionIds: Array<LionId> = [];
    constructor(public database: Database, public router: Router,
        public loadingCtrl: LoadingController, public actionSheetController: ActionSheetController, private actionSheet: ActionSheet) {
        this.presentLoading();
        this.database.getAllLionIds().then(result => {
            this.lionIdsList = result;
            this.dismisLoading();
        });

        router.events.subscribe(e => {
            if (e instanceof NavigationStart) {
                if (e.url === '/all-ids') {
                    this.reloadIds();
                }
            }
        });

    }

    reloadIds() {
        this.presentLoading();
        this.database.getAllLionIds().then(result => {
            this.lionIdsList = result;
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

    addNew() {
        this.router.navigate(['/add-id']);
    }

    showPopup1(lionId: LionId) {
        const buttonLabels = ['Sold', 'Died', 'Lost'];

        const options: ActionSheetOptions = {
            title: 'What do you want with this image?',
            subtitle: 'Choose an action',
            buttonLabels: buttonLabels,
            addCancelButtonWithLabel: 'Cancel',
            addDestructiveButtonWithLabel: 'Delete',
            androidTheme: 1,
            destructiveButtonLast: true
        };

        this.actionSheet.show(options).then((buttonIndex: number) => {
            if (buttonIndex === 0) {
                lionId.sold = true;
                lionId.lost = false;
                lionId.died = false;
                this.updateId(lionId);
            } else if (buttonIndex === 1) {
                lionId.died = true;
                lionId.lost = false;
                lionId.sold = false;
                this.updateId(lionId);
            } else if (buttonIndex === 2) {
                lionId.lost = true;
                lionId.sold = false;
                lionId.died = false;
                this.updateId(lionId);
            }
        });
    }

    async showPopup(lionId: LionId) {

        const buttonsList = [, , {
            text: 'Lost',
            role: '',
            handler: () => {
                lionId.lost = true;
                lionId.sold = false;
                lionId.died = false;
                this.updateId(lionId);
            }
        }];

        if (!lionId.died) {
            buttonsList.push({
                text: 'Died',
                role: '',
                handler: () => {
                    lionId.died = true;
                    lionId.lost = false;
                    lionId.sold = false;
                    this.updateId(lionId);
                }
            });
        }

        if (!lionId.sold) {
            buttonsList.push({
                text: 'Sold',
                role: '',
                handler: () => {
                    lionId.sold = true;
                    lionId.lost = false;
                    lionId.died = false;
                    this.updateId(lionId);
                }
            });
        }

        if (!lionId.lost) {
            buttonsList.push({
                text: 'Lost',
                role: '',
                handler: () => {
                    lionId.lost = true;
                    lionId.sold = false;
                    lionId.died = false;
                    this.updateId(lionId);
                }
            });
        }

        if (lionId.lost || lionId.died || lionId.sold) {
            buttonsList.push({
                text: 'Reactivate',
                role: '',
                handler: () => {
                    lionId.lost = false;
                    lionId.sold = false;
                    lionId.died = false;
                    this.updateId(lionId);
                }
            });
        }

        buttonsList.push({
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
                console.log('Cancel clicked');
            }
        });

        const actionSheet = await this.actionSheetController.create({
            header: 'Reason to remove',
            buttons: buttonsList
        });
        await actionSheet.present();
    }

    updateId(lionId: LionId) {

        this.database.updateId(
            {
                id: lionId.id,
                lost: lionId.lost,
                died: lionId.died,
                sold: lionId.sold
            }
        );
    }
}
