import { Injectable } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';
import { Photo } from '../models/photo.model';

@Injectable()
export class StorageProvider {

    constructor(public storage: AngularFireStorage) { }

    saveImage(photo: Photo, index, sightingNumber): Promise<any> {
            return this.storage.storage.ref().child('sightings/' + sightingNumber + '/' + (index + 1))
                .putString(photo.file, 'data_url', { contentType: 'image/jpeg' }).then(snapshot => {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    // console.log('Upload is ' + progress + '% done');
                    if (progress === 100) {
                        return snapshot.ref.getDownloadURL().then(url => {
                            return Promise.resolve(url);
                        });
                    }
                });
    }
}
