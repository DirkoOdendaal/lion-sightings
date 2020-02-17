import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { User, Sighting, LionId } from '../models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStorageProvider } from './local-storage.provider';

@Injectable()
export class Database {

    constructor(public db: AngularFirestore, public localStorageProvider: LocalStorageProvider) { }

    addUser(createUser: User) {
        this.db.collection('users').doc(createUser.user_id).set({
            user_id: createUser.user_id,
            firstname: createUser.firstname,
            surname: createUser.surname,
            email: createUser.email,
            admin: createUser.admin,
            allowed: createUser.allowed,
            denied: createUser.denied
        });
    }

    updateUser(createUser: User) {
        return this.db.collection('users').doc(createUser.user_id).set({
            user_id: createUser.user_id,
            firstname: createUser.firstname,
            surname: createUser.surname,
            email: createUser.email,
            admin: createUser.admin,
            allowed: createUser.allowed,
            denied: createUser.denied
        });
    }

    userDetails() {
        const userActions = this.db.collection('users').snapshotChanges().pipe(map(actions => {
            return actions.map(action => {
                const data = action.payload.doc.data() as User;
                return data;
            });
        }));
        userActions.subscribe(val => this.localStorageProvider.setLocalData('user_details', val));
        return userActions;
    }

    currentUser(): Observable<User> {
        if (this.db.firestore.app.auth().currentUser) {
           const userId = this.db.firestore.app.auth().currentUser.uid;
            const user = this.db.collection('users').doc(userId).get().pipe(map(snapshot => {
                const loggedInUser: User = {
                    user_id: snapshot.data().user_id,
                    firstname: snapshot.data().firstname,
                    surname: snapshot.data().surname,
                    email: snapshot.data().email,
                    admin: snapshot.data().admin,
                    allowed: snapshot.data().allowed,
                    denied: snapshot.data().denied
                };
                return loggedInUser;
            }));
            user.subscribe(val => this.localStorageProvider.setLocalData('current_user', val));
            return user;
        } else {
            return new Observable();
        }
    }

    getUserDetails() {
        const userId = this.db.firestore.app.auth().currentUser.uid;
        const result = this.db.collection('users').doc(userId).ref.get().then(function (snapshot) {
            const loggedInUser = {
                user_id: snapshot.data().user_id,
                firstname: snapshot.data().firstname,
                surname: snapshot.data().surname,
                email: snapshot.data().email,
                admin: snapshot.data().admin,
                allowed: snapshot.data().allowed,
                denied: snapshot.data().denied
            };
            return Promise.resolve(loggedInUser);
        });
        result.then(val => this.localStorageProvider.setLocalData('get_user_details', val));
        return result;
    }

    getAllUsers(): Promise<any> {
        const list = [];
        const resultList = this.db.collection('users').ref.get().then(snapshot => {
            snapshot.forEach(doc => {
                if (!doc.data().admin) {
                    list.push(doc.data());
                }
            });
            return Promise.resolve(list);
        });
        resultList.then(val => this.localStorageProvider.setLocalData('get_all_users', val));
        return resultList;
    }

    getCurrentSightingNumber() {
        const nextSighting = this.db.collection('sightings').ref.get()
            .then(snapshot => {
                return Promise.resolve(snapshot.size);
            });
        nextSighting.then(val => this.localStorageProvider.setLocalData('next_sighting', val + 1));
        return nextSighting;
    }

    getNextSightingNumber() {
        const nextSighting = this.db.collection('sightings').ref.get()
            .then(snapshot => {
                return Promise.resolve(snapshot.size + 1);
            })
            .catch(err => {
                return Promise.resolve(1);
            });
        nextSighting.then(val => this.localStorageProvider.setLocalData('next_sighting', val));
        return nextSighting;
    }

    addSighting(sighting: Sighting) {
        return this.db.collection('sightings').doc(sighting.sighting_number.toString()).set({
            sighting_number: sighting.sighting_number,
            user: this.db.firestore.app.auth().currentUser.uid,
            date_time: new Date().toString(),
            temperature: sighting.temperature,
            adult_male: sighting.adult_male,
            adult_female: sighting.adult_female,
            sub_adult_male: sighting.sub_adult_male,
            sub_adult_female: sighting.sub_adult_female,
            cub_male: sighting.cub_male,
            cub_female: sighting.cub_female,
            cub_unknown: sighting.cub_unknown,
            lion_id_list: sighting.lion_id_list,
            latitude: sighting.latitude,
            longitude: sighting.longitude,
            activity: sighting.activity,
            catch: sighting.catch,
            catch_species: sighting.catch_species,
            catch_gender: sighting.catch_gender,
            catch_age: sighting.catch_age,
            carcass_utilization: sighting.carcass_utilization,
            comments: sighting.comments,
            photos: sighting.photos
        }).then(pass => {
            return sighting.sighting_number.toString();
        });
    }

    addNextSighting(sighting: Sighting) {
        const nextSighting = this.db.collection('sightings').ref.get()
            .then(snapshot => {
                return this.db.collection('sightings').doc((snapshot.size + 1).toString()).set({
                    sighting_number: sighting.sighting_number,
                    user: this.db.firestore.app.auth().currentUser.uid,
                    date_time: new Date().toString(),
                    temperature: sighting.temperature,
                    adult_male: sighting.adult_male,
                    adult_female: sighting.adult_female,
                    sub_adult_male: sighting.sub_adult_male,
                    sub_adult_female: sighting.sub_adult_female,
                    cub_male: sighting.cub_male,
                    cub_female: sighting.cub_female,
                    cub_unknown: sighting.cub_unknown,
                    lion_id_list: sighting.lion_id_list,
                    latitude: sighting.latitude,
                    longitude: sighting.longitude,
                    activity: sighting.activity,
                    catch: sighting.catch,
                    catch_species: sighting.catch_species,
                    catch_gender: sighting.catch_gender,
                    catch_age: sighting.catch_age,
                    carcass_utilization: sighting.carcass_utilization,
                    comments: sighting.comments,
                    photos: sighting.photos
                }).then(pass => {
                    return sighting.sighting_number.toString();
                });
            })
            .catch(err => {
                return Promise.resolve(1);
            });
        nextSighting.then(val => this.localStorageProvider.setLocalData('next_sighting', val));
        return nextSighting;
    }

    updateSighting(sighting: Sighting) {
        return this.db.collection('sightings').doc(sighting.sighting_number.toString()).set({
            sighting_number: sighting.sighting_number,
            user: this.db.firestore.app.auth().currentUser.uid,
            date_time: new Date().toString(),
            temperature: sighting.temperature,
            adult_male: sighting.adult_male,
            adult_female: sighting.adult_female,
            sub_adult_male: sighting.sub_adult_male,
            sub_adult_female: sighting.sub_adult_female,
            cub_male: sighting.cub_male,
            cub_female: sighting.cub_female,
            cub_unknown: sighting.cub_unknown,
            lion_id_list: sighting.lion_id_list,
            latitude: sighting.latitude,
            longitude: sighting.longitude,
            activity: sighting.activity,
            catch: sighting.catch,
            catch_species: sighting.catch_species,
            catch_gender: sighting.catch_gender,
            catch_age: sighting.catch_age,
            carcass_utilization: sighting.carcass_utilization,
            comments: sighting.comments,
            photos: sighting.photos
        }).then(pass => {
            return sighting.sighting_number.toString();
        });
    }

    getSightingsForAllUsers(): Promise<any> {
        const list = [];
        const sightingsList = this.db.collection('sightings').ref.orderBy('date_time').get().then(snapshot => {
            snapshot.forEach(doc => {
                list.push(doc.data());
            });
            return Promise.resolve(list);
        });
        sightingsList.then(val => this.localStorageProvider.setLocalData('all_sightings', val));
        return sightingsList;
    }

    getSightingsForUser(): Promise<any> {
        const list = [];
        const userSightings = this.db.collection('sightings').ref.orderBy('date_time').get().then(snapshot => {
            snapshot.forEach(doc => {
                if (doc.data().user === this.db.firestore.app.auth().currentUser.uid) {
                    list.push(doc.data());
                }
            });
            return Promise.resolve(list);
        });
        userSightings.then(val => this.localStorageProvider.setLocalData('user_sightings', val));
        return userSightings;
    }

    getSightingById(id: number): Promise<any> {
        const list = [];
        return this.db.collection('sightings').doc(id.toString()).ref.get().then(snapshot => {
            return Promise.resolve(snapshot.data());
        });
    }

    addId(lionId: LionId): Promise<any> {
        return this.db.collection('ids').doc(lionId.id).set({
            id: lionId.id,
            sold: lionId.sold,
            died: lionId.died,
            lost: lionId.lost,
            date: new Date().toString()
        }).then(response => {
            return response;
        });
    }

    updateId(lionId: LionId) {
        return this.db.collection('ids').doc(lionId.id).set({
            id: lionId.id,
            sold: lionId.sold,
            died: lionId.died,
            lost: lionId.lost,
            date: new Date().toString()
        });
    }

    getLionIdById(id: string): Promise<any> {
        const list = [];
        return this.db.collection('ids').doc(id).ref.get().then(snapshot => {
            return Promise.resolve(snapshot.data());
        });
    }

    getAllLionIds(): Promise<any> {
        const list = [];
        const allLionIds = this.db.collection('ids').ref.get().then(snapshot => {
            snapshot.forEach(doc => {
                list.push(doc.data());
            });
            return Promise.resolve(list);
        });
        allLionIds.then(val => this.localStorageProvider.setLocalData('all_lion_ids', val));
        return allLionIds;
    }

    getAllAvailableLionIds(): Promise<any> {
        const list = [];
        const availableIds = this.db.collection('ids').ref.get().then(snapshot => {
            snapshot.forEach(doc => {
                if (!doc.data().lost && !doc.data().dead && !doc.data().sold) {
                    list.push(doc.data());
                }
            });
            return Promise.resolve(list);
        });
        availableIds.then(val => this.localStorageProvider.setLocalData('all_available_ids', val));
        return availableIds;
    }

    setValue() {
        return this.db.collection('tests').doc(new Date().toString()).set({
            working: new Date().toString(),
            user: this.db.firestore.app.auth().currentUser.uid
        }).then(() => {
            return "Success";
        });
    }
}
