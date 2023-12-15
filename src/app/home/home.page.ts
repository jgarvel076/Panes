import { Component } from '@angular/core';
import {Pan} from '../pan';
import { FirestoreService } from '../firestore.service';

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

  constructor(private firestoreService: FirestoreService) {
    this.obtenerListaPanes();
  }

  clickBotonInsertar(){
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
    this.panEditando = panSelec;
    this.idpanSelec = idpan;
  }

  clickBotonBorrar(){
    this.firestoreService.borrar("panes", this.idpanSelec).then(() => {
    console.log('Pan borrado correctamente!');
    this.panEditando= {} as Pan;
    this.idpanSelec = "";
    }, (error) => {
      console.error(error);
    });
  }
  clickBotonModificar(){
    this.firestoreService.modificar("panes",this.idpanSelec, this.panEditando).then(() => {
      console.log('Pan modificado correctamente!');
    }, (error) => {
      console.error(error);
    });
  }
 

  }