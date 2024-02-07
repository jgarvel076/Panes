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
  nuevo: boolean = true;
  existente: boolean = false;

  document: any = {
    id: "",
    data: {} as Pan
  }

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
        this.nuevo = false;
        this.existente = true
        
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
    this.firestoreService.borrar("panes", this.id).then(() => {
    console.log('Pan borrado correctamente!');
    this.document.data= {} as Pan;
    this.idpanSelec = "";
    }, (error) => {
      console.error(error);
    });
    this.router.navigate(['home']);
  }
  clickBotonModificar(){
    this.firestoreService.modificar("panes",this.id, this.document.data).then(() => {
      console.log('Pan modificado correctamente!');
    }, (error) => {
      console.error(error);
    });
    this.router.navigate(['home']);
  }
  clickBotonInsertar(){
    //console.log(this.panEditando.nombre);
     this.firestoreService.insertar("panes", this.document.data).then(() => {
     console.log('Pan Guardado correctamente!');
     this.document.pan= {} as Pan;
     }, (error) => {
       console.error(error);
     });
     this.router.navigate(['home']);
   }
 
}
