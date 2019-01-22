import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { User, Sighting } from '../models';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class Database {

    private currentLoggedInUserSource: User = {
        user_id: '',
        firstname: '',
        surname: '',
        email: '',
        admin: false
    };

    private currentLoggedInUser = new BehaviorSubject<User>(this.currentLoggedInUserSource);

    constructor(public db: AngularFirestore) { }

    addUser(createUser: User) {
        this.db.collection('users').doc(createUser.user_id).set({
            user_id: createUser.user_id,
            firstname: createUser.firstname,
            surname: createUser.surname,
            email: createUser.email,
            admin: createUser.admin
        });
    }

    getUserDetails() {

        const userId = this.db.firestore.app.auth().currentUser.uid;
        console.log('GetUserDetails');
        console.log(userId);
        const result = this.db.collection('users').doc(userId).get().toPromise().then(function (snapshot) {

            console.log('Result!!');
            console.log(snapshot);
            const loggedInUser = {
                user_id: snapshot.data().user_id,
                firstname: snapshot.data().firstname,
                surname: snapshot.data().surname,
                email: snapshot.data().email,
                admin: snapshot.data().admin
            };

            return Promise.resolve(loggedInUser);
        });

        return result;
    }

    getUserName() {

        const userId = this.db.firestore.app.auth().currentUser.uid;
        let username = '';
        this.db.collection('users').doc(userId).get().toPromise().then(function (snapshot) {
            username = snapshot.data().firstname + ' ' + snapshot.data().surname;
        });

        return Promise.resolve(username);
    }

    getNextSightingNumber() {
        return this.db.collection('sightings').get().toPromise()
        .then(snapshot => {
            console.log('Sightings available');
            console.log(snapshot);
            return Promise.resolve(snapshot.size + 1); })
        .catch(err => {
            console.log('error location');
            console.log(err);
            return Promise.resolve(1); });
    }

    addSighting(sighting: Sighting) {
        this.getUserName().then(username => {
            this.db.collection('sightings').doc(sighting.sighting_number.toString()).set({
                sighting_number: sighting.sighting_number,
                user: username,
                date_time: new Date(),
                temperature: sighting.temperature,
                adult_male: sighting.adult_male,
                adult_female: sighting.adult_female,
                adult_id_list: sighting.adult_id_list,
                sub_adult_male: sighting.sub_adult_male,
                sub_adult_female: sighting.sub_adult_female,
                sub_adult_id_list: sighting.sub_adult_id_list,
                cub_male: sighting.cub_male,
                cub_female: sighting.cub_female,
                cub_unknown: sighting.cub_unknown,
                cub_id_list: sighting.cub_id_list,
                latitude:  sighting.latitude,
                longitude:  sighting.longitude,
                activity: sighting.activity,
                catch: sighting.catch,
                catch_species: sighting.catch_species,
                catch_gender: sighting.catch_gender,
                catch_age: sighting.catch_age,
                carcass_utilization: sighting.carcass_utilization,
                comments: sighting.comments,
                photos: sighting.photos
            });
        });
    }
}
