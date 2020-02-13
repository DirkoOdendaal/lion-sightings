import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

const STORAGE_KEY = 'lion-sightings-key-859638453';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageProvider {

    constructor(public storage: Storage) { }

    // Save result of requests
    setLocalData(key, data) {
        this.storage.set(`${STORAGE_KEY}-${key}`, data);
    }

    // Get cached result
    getLocalData(key) {
        return this.storage.get(`${STORAGE_KEY}-${key}`);
    }

    clearLocalData() {
        this.storage.clear();
    }

}
