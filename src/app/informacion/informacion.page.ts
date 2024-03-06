import { Component, OnInit } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.page.html',
  styleUrls: ['./informacion.page.scss'],
})
export class InformacionPage implements OnInit {

  constructor(private callNumber: CallNumber) { }

  

  telefono: string = "637884153";

  llamar() {
    this.callNumber.callNumber(this.telefono, true)
      .then(res => console.log('Llamada exitosa', res))
      .catch(err => console.log('Error al llamar', err));
  }
  
  ngOnInit() {
  }
}


