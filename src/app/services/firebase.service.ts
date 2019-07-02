import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor() {
    const config = {
      apiKey: 'AIzaSyD8Rl2mtQIpse7YOSNS3mOhLY9SbScNQ90',
      authDomain: 'utf-sports.firebaseapp.com',
      databaseURL: 'https://utf-sports.firebaseio.com',
      projectId: 'utf-sports',
      storageBucket: 'utf-sports.appspot.com',
      messagingSenderId: '209573562359',
      appId: '1:209573562359:web:7f9f4e6300a2e15b'
    };
    firebase.initializeApp(config);
  }

  db() {
    return firebase.firestore();
  }

  auth() {
    return firebase.auth();
  }

  storage() {
    return firebase.storage();
  }

}
