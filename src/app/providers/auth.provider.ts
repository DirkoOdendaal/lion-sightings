import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from '../models/user.model';
import { Database } from './database.provider';
import { LocalStorageProvider } from './local-storage.provider';

@Injectable()
export class AuthData {
  authState = null;

  constructor(public auth: AngularFireAuth, public database: Database, public localStorageProvider: LocalStorageProvider) {

    auth.auth.onAuthStateChanged((state) => {
      this.authState = state;
    });
  }

  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.authState !== null;
  }

  /**
   * [loginUser We'll take an email and password and log the user into the firebase app]
   * @param  {string} email    [User's email address]
   * @param  {string} password [User's password]
   */
  loginUser(email: string, password: string): Promise<any> {
    return this.auth.auth.setPersistence('local').then(() => this.auth.auth.signInWithEmailAndPassword(email, password));
  }

  /**
   * [signupUser description]
   * This function will take the user's email and password and create a new account on the Firebase app, once it does
   * it's going to log the user in and create a node on userProfile/uid with the user's email address, you can use
   * that node to store the profile information.
   * @param  {string} email    [User's email address]
   * @param  {string} password [User's password]
   */
  signupUser(createUser: User, password: string): Promise<any> {
    return this.auth.auth.createUserWithEmailAndPassword(createUser.email, password).then((user) => {
      if (user) {
        createUser.user_id = user.user.uid;
        this.database.addUser(createUser);
      }
    });
  }

  /**
   * [resetPassword description]
   * This function will take the user's email address and send a password reset link, then Firebase will handle the
   * email reset part, you won't have to do anything else.
   *
   * @param  {string} email    [User's email address]
   */
  resetPassword(email: string): Promise<any> {
    return this.auth.auth.sendPasswordResetEmail(email);
  }

  /**
   * This function doesn't take any params, it just logs the current user out of the app.
   */
  logoutUser(): Promise<any> {
    this.localStorageProvider.clearLocalData();
    return this.auth.auth.signOut();
  }

  isLoggedIn() {
    return this.auth.auth.currentUser ? true : false;
  }
}
