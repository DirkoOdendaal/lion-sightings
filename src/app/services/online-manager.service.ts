import { Injectable } from '@angular/core';
import { StoredRequest } from '../models';
import { forkJoin } from 'rxjs';
import { Database } from '../providers/database.provider';
import { StorageProvider } from '../providers/storage.provider';
import { Photo } from '../models/photo.model';

@Injectable({
    providedIn: 'root'
})
export class OnlineManagerService {

    constructor(private database: Database, private storage: StorageProvider) { }


sendRequests(operations: StoredRequest[]) {
    const obs = [];

    for (const op of operations) {
        console.log('Make one request: ', op);
        let oneObs;
        if (op.type === 'update_user') {
            oneObs = this.database.updateUser(op.data);
        } else if (op.type === 'sightings') {
            oneObs = this.database.addSighting(op.data);
        } else if (op.type === 'add_id') {
            oneObs = this.database.addId(op.data);
        } else if (op.type === 'update_id') {
            oneObs = this.database.updateId(op.data);
        }
        obs.push(oneObs);
    }

    // Send out all local events and return once they are finished
    return forkJoin(obs);
}

processImages(operations: StoredRequest[]) {
    const obs = [];
    for (const op of operations) {
        console.log('Make one request: ', op);
        let oneObs;
        if (op.type === 'save_photos') {
            oneObs = this.saveImagesLater(op.data.photos, op.data.sightingNumber);
        }
        obs.push(oneObs);
    }

    // Send out all local events and return once they are finished
    return forkJoin(obs);
}

saveImagesLater(photos: Photo[], sightingNumber): Promise<any> {
    // Find sighting record in firestore
    let sighting;
    this.database.getSightingById(sightingNumber).then(result => {
        sighting = result;
    });

    if (sighting) {
        const list = [];
        const promiseList = [];
        // Add photo url after saving to datastore
        photos.forEach((photo, index) => {
            promiseList.push(this.storage.saveImage(photo, index, sightingNumber).then(url => {
                list.push(url);
            }));
        });
        return Promise.all(promiseList).then(() => {
            sighting.photos = list;
            this.database.updateSighting(sighting);
        }
        );
    }
}

}
