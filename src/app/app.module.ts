import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { File } from '@ionic-native/file/ngx';
import { ActionSheet } from '@ionic-native/action-sheet/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';

import { AuthData } from './providers/auth.provider';
import { Database } from './providers/database.provider';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthData,
    Database,
    ImagePicker,
    Crop,
    Camera,
    Geolocation,
    File,
    ActionSheet,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
