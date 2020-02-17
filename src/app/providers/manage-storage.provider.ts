import { Injectable } from '@angular/core';
import { User, Sighting, LionId, Photo, SavedImage } from '../models';
import { Observable, from } from 'rxjs';
import { NetworkService, ConnectionStatus } from '../services/network.service';
import { OfflineManagerService } from '../services/offline-manager.service';
import { LocalStorageProvider } from './local-storage.provider';
import { Database } from './database.provider';
import { StorageProvider } from './storage.provider';

@Injectable()
export class ManageStorage {

    constructor(public networkService: NetworkService,
        public offlineManagerService: OfflineManagerService, public localStorageProvider: LocalStorageProvider,
        public database: Database, private storageProvider: StorageProvider) { }

    addUser(createUser: User) {
        this.database.addUser(createUser);
    }

    updateUser(createUser: User) {
        if (this.networkService.getCurrentNetworkStatus() === 1) {
            this.offlineManagerService.storeRequest('update_user', createUser);
        } else {
            this.database.updateUser(createUser);
        }
    }

    userDetails() {
        if (this.networkService.getCurrentNetworkStatus() === 1) {
            return from(this.localStorageProvider.getLocalData('user_details'));
        } else {
            return this.database.userDetails();
        }
    }

    currentUser(): Observable<User> {
        if (this.networkService.getCurrentNetworkStatus() === 1) {
            return from(this.localStorageProvider.getLocalData('current_user'));
        } else {
            return this.database.currentUser();
        }
    }

    getUserDetails() {
        if (this.networkService.getCurrentNetworkStatus() === 1) {
            return Promise.resolve(this.localStorageProvider.getLocalData('get_user_details'));
        } else {
            return Promise.resolve(this.database.getUserDetails());
        }
    }

    getAllUsers(): Promise<any> {
        if (this.networkService.getCurrentNetworkStatus() === 1) {
            return Promise.resolve(this.localStorageProvider.getLocalData('get_all_users'));
        } else {
            return this.database.getAllUsers();
        }
    }

    getNextSightingNumber() {
        if (this.networkService.getCurrentNetworkStatus() === 1) {
            const previousValue = this.localStorageProvider.getLocalData('next_sighting').then(val => val + 1);
            this.localStorageProvider.setLocalData('next_sighting', previousValue);
            return Promise.resolve(this.localStorageProvider.getLocalData('next_sighting'));
        } else {
            return this.database.getNextSightingNumber();
        }
    }

    addSighting(sighting: Sighting) {
        if (this.networkService.getCurrentNetworkStatus() === 1) {
            return Promise.resolve(this.offlineManagerService.storeRequest('sightings', sighting));
        } else {
            return this.database.addSighting(sighting);
        }
    }

    getSightingsForAllUsers(): Promise<any> {
        if (this.networkService.getCurrentNetworkStatus() === 1) {
            return Promise.resolve(this.localStorageProvider.getLocalData('all_sightings'));
        } else {
            return this.database.getSightingsForAllUsers();
        }
    }

    getSightingsForUser(): Promise<any> {
        const list = [];
        if (this.networkService.getCurrentNetworkStatus() === 1) {
            return Promise.resolve(this.localStorageProvider.getLocalData('user_sightings'));
        } else {
            return this.database.getSightingsForUser();
        }
    }

    getSightingById(id: number): Promise<any> {
        if (this.networkService.getCurrentNetworkStatus() === 1) {
            return this.localStorageProvider.getLocalData('user_sightings').then(list => {
                return list.find(x => x.sighting_number === id);
            });
        } else {
            return this.database.getSightingById(id);
        }
    }

    addId(lionId: LionId): Promise<any> {
        if (this.networkService.getCurrentNetworkStatus() === 1) {
            return Promise.resolve(this.offlineManagerService.storeRequest('add_id', lionId));
        } else {
            return this.database.addId(lionId);
        }
    }

    updateId(lionId: LionId) {
        if (this.networkService.getCurrentNetworkStatus() === 1) {
            return Promise.resolve(this.offlineManagerService.storeRequest('update_id', lionId));
        } else {
            return this.database.updateId(lionId);
        }
    }

    getLionIdById(id: string): Promise<any> {
        if (this.networkService.getCurrentNetworkStatus() === 1) {
            return this.localStorageProvider.getLocalData('all_lion_ids').then(list => {
                return list.find(x => x.id === id);
            });
        } else {
            return this.database.getLionIdById(id);
        }
    }

    getAllLionIds(): Promise<any> {
        if (this.networkService.getCurrentNetworkStatus() === 1) {
            return this.localStorageProvider.getLocalData('all_lion_ids');
        } else {
            return this.database.getAllLionIds();
        }
    }

    getAllAvailableLionIds(): Promise<any> {
        if (this.networkService.getCurrentNetworkStatus() === 1) {
            return this.localStorageProvider.getLocalData('all_available_ids');
        } else {
            return this.database.getAllAvailableLionIds();
        }
    }

    async saveImages(photos: Photo[], sightingNumber): Promise<any> {
        const list = [];
        const promiseList = [];

        if (this.networkService.getCurrentNetworkStatus() === 1) {
            const savedPhoto: SavedImage = {
                sightingNumber: sightingNumber,
                photos: photos
            };
            this.offlineManagerService.storeImageRequest('save_photos', savedPhoto);
        } else {
            photos.forEach((photo, index) => {
                promiseList.push(this.saveImage(photo, index, sightingNumber).then(url => {
                    list.push(url);
                }));
            });
        }
        await Promise.all(promiseList);
        return await Promise.resolve(list);
    }

    saveImage(photo: Photo, index, sightingNumber): Promise<any> {
        return this.storageProvider.saveImage(photo, index, sightingNumber);
    }

    setValue() {

        if (this.networkService.getCurrentNetworkStatus() === 1) {
            return Promise.resolve(this.offlineManagerService.storeRequest('setValue', "Test"));
        } else {
            return this.database.setValue();
        }
    }
}
