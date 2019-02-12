


import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

const STORAGE_KEY = 'lion-sightings-key-859638453';

@Injectable()
export class LocalStorageProvider {

    constructor(public storage: Storage) { }

    // Save result of requests
    setLocalData(key, data) {
        console.log('set local data');
        console.log(data);
        this.storage.set(`${STORAGE_KEY}-${key}`, data)
        .then(val => console.log('store success', val))
        .catch(err => console.log('store err ', err));
    }

    // Get cached result
    getLocalData(key) {
        console.log('get local data');
        return this.storage.get(`${STORAGE_KEY}-${key}`);
    }

}
