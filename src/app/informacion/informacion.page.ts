import { Component, OnInit } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
import * as L from 'leaflet';


@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.page.html',
  styleUrls: ['./informacion.page.scss'],
})
export class InformacionPage implements OnInit {

  map: L.Map;
  marker: L.Marker;



  constructor(private callNumber: CallNumber) {
    {
      this.map = {} as L.Map;
      this.marker = {} as L.Marker;
     }
   }

  

  telefono: string = "637884153";

  llamar() {
    this.callNumber.callNumber(this.telefono, true)
      .then(res => console.log('Llamada exitosa', res))
      .catch(err => console.log('Error al llamar', err));
  }

  
  
  ngOnInit() {
  }

  ionViewDidEnter() {
    this.loadMap();
  }

  loadMap() {
    let latitud = 36.78704926854758;
    let longitud = -5.55717347200687;
    let zoom = 17;
    this.map = L.map("mapId").setView([latitud, longitud], zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
    this.marker = L.marker([latitud, longitud]).addTo(this.map);
  }
}


