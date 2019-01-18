import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { User } from '../models';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class Database {

    private currentLoggedInUserSource: User = {
        user_id: '',
        firstname: '',
        surname: '',
        email: ''
    };

    private currentLoggedInUser = new BehaviorSubject<User>(this.currentLoggedInUserSource);

    constructor() { }

    addUser(createUser: User) {
        firebase.database().ref('/users/' + createUser.user_id).set({
            user_id: createUser.user_id,
            firstname: createUser.firstname,
            surname: createUser.surname,
            email: createUser.email
        });
    }

    getUserDetails() {

        const userId = firebase.auth().currentUser.uid;
        const result = firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {

            const loggedInUser = {
                user_id: snapshot.val().user_id,
                firstname: snapshot.val().firstname,
                surname: snapshot.val().surname,
                email: snapshot.val().email
            };

            return Promise.resolve(loggedInUser);
        });

        return result;
    }
}
