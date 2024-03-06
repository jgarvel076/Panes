import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';

import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';

import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

import { CallNumber } from '@ionic-native/call-number/ngx';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, AngularFireModule.initializeApp(environment.firebaseConfig), AngularFireModule],
  providers: [ImagePicker, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, CallNumber],
  bootstrap: [AppComponent],
})
export class AppModule {}