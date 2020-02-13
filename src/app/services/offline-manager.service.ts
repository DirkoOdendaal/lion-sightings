import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { from, of, forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import { StoredRequest } from '../models';
import { OnlineManagerService } from './online-manager.service';

const STORAGE_REQ_KEY = 'storedreq123';
const STORAGE_IMAGE_REQ_KEY = 'storedimagereq387';

@Injectable({
    providedIn: 'root'
})
export class OfflineManagerService {

    constructor(private storage: Storage, private toastController: ToastController, private onlineManagerService: OnlineManagerService) { }

    checkForEvents() {
        return from(
            this.storage.get(STORAGE_REQ_KEY)).pipe(
                switchMap(storedOperations => {
                    const storedObj = JSON.parse(storedOperations);
                    if (storedObj && storedObj.length > 0) {
                        return this.onlineManagerService.sendRequests(storedObj).toPromise().then(result => {
                            const toast = this.toastController.create({
                                message: `Local data succesfully synced to API!`,
                                duration: 3000,
                                position: 'bottom'
                            });
                            toast.then(val => val.present());

                            this.storage.remove(STORAGE_REQ_KEY);
                            return of(true);
                        });
                    } else {
                        return Promise.resolve(of(false));
                    }
                })
            );
    }

    checkForImageEvents() {
        return from(
            this.storage.get(STORAGE_IMAGE_REQ_KEY)).pipe(
                switchMap(storedOperations => {
                    const storedObj = JSON.parse(storedOperations);
                    if (storedObj && storedObj.length > 0) {
                        return this.onlineManagerService.processImages(storedObj).toPromise().then(result => {
                            const toast = this.toastController.create({
                                message: `Local data succesfully synced to API!`,
                                duration: 3000,
                                position: 'bottom'
                            });
                            toast.then(val => val.present());

                            this.storage.remove(STORAGE_IMAGE_REQ_KEY);
                            return of(true);
                        });
                    } else {
                            return Promise.resolve(of(false));
                    }
                })
            );
    }

    storeRequest(type, data) {
        const toast = this.toastController.create({
            message: `Your data is stored locally because you seem to be offline.`,
            duration: 3000,
            position: 'bottom'
        });
        toast.then(val => val.present());

        const action: StoredRequest = {
            type: type,
            data: data,
            time: new Date().getTime(),
            id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
        };
        // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript

        return this.storage.get(STORAGE_REQ_KEY).then(storedOperations => {
            let storedObj = JSON.parse(storedOperations);

            if (storedObj) {
                storedObj.push(action);
            } else {
                storedObj = [action];
            }
            // Save old & new local transactions back to Storage
            this.storage.set(STORAGE_REQ_KEY, JSON.stringify(storedObj))
            return 'unknown';
        });
    }

    storeImageRequest(type, data) {
        const toast = this.toastController.create({
            message: `Your data is stored locally because you seem to be offline.`,
            duration: 3000,
            position: 'bottom'
        });
        toast.then(val => val.present());

        const action: StoredRequest = {
            type: type,
            data: data,
            time: new Date().getTime(),
            id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
        };
        // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript

        return this.storage.get(STORAGE_IMAGE_REQ_KEY).then(storedOperations => {
            let storedObj = JSON.parse(storedOperations);

            if (storedObj) {
                storedObj.push(action);
            } else {
                storedObj = [action];
            }
            // Save old & new local transactions back to Storage
            return this.storage.set(STORAGE_IMAGE_REQ_KEY, JSON.stringify(storedObj));
        });
    }

}
