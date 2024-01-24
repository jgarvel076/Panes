import { Component } from '@angular/core';
import {Pan} from '../pan';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  panEditando = {} as Pan;
  arrayColeccionPanes: any = [{
    id: "",
    pan: {} as Pan
}];
idpanSelec: string = "";

  constructor(private firestoreService: FirestoreService, private router: Router) {
    this.obtenerListaPanes();
  }

  clickBotonInsertar(){
   //console.log(this.panEditando.nombre);
    this.firestoreService.insertar("panes", this.panEditando).then(() => {
    console.log('Pan Guardado correctamente!');
    this.panEditando= {} as Pan;
    }, (error) => {
      console.error(error);
    });
  }

  obtenerListaPanes(){
    this.firestoreService.consultar("panes").subscribe((datosRecibidos) => {
      this.arrayColeccionPanes = [];
      datosRecibidos.forEach((datosPan) => {
        this.arrayColeccionPanes.push({
          id: datosPan.payload.doc.id,
          pan: datosPan.payload.doc.data()

        })
      });
    });
  }

  selecPan(idpan:string, panSelec: Pan){
    console.log(panSelec);
    this.panEditando = panSelec;
    this.idpanSelec = idpan;
    this.router.navigate(['detalle',this.idpanSelec]);
  }

  }