import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { ActivatedRoute, Router } from '@angular/router';
import {Pan} from '../pan';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {

  id:string="";

  document: any = {
    id: "",
    data: {} as Pan}

    arrayColeccionPanes: any = {
      id: "",
      pan: {} as Pan
  };

  constructor(private activatedRoute: ActivatedRoute, private firestoreService: FirestoreService, private router: Router) {
    this.obtenerListaPanes();
  }

  ngOnInit() {
    let idRecibido = this.activatedRoute.snapshot.paramMap.get('id');
    if(idRecibido!= null) {
      this.id=idRecibido;
    }else {
      this.id="";
    }

    this.firestoreService.consultarPorId("panes", this.id).subscribe((resultado:any) => {
      if(resultado.payload.data() != null) {
        this.document.id = resultado.payload.id
        this.document.data = resultado.payload.data();
      } else {
        this.document.data = {} as Pan;
      }
    })
  }

  idpanSelec: string = "";


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
    this.document.data = panSelec;
    this.idpanSelec = idpan;
    this.router.navigate(['detalle',this.idpanSelec]);
  }

  clickBotonBorrar(){
    this.firestoreService.borrar("panes", this.idpanSelec).then(() => {
    console.log('Pan borrado correctamente!');
    this.document.data= {} as Pan;
    this.idpanSelec = "";
    }, (error) => {
      console.error(error);
    });
  }
  clickBotonModificar(){
    this.firestoreService.modificar("panes",this.idpanSelec, this.document.data).then(() => {
      console.log('Pan modificado correctamente!');
    }, (error) => {
      console.error(error);
    });
  }
 
}
