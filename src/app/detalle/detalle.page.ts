import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { ActivatedRoute } from '@angular/router';
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
    data: {} as Pan
  };

  constructor(private activatedRoute: ActivatedRoute, private firestoreService: FirestoreService) { }

  ngOnInit() {
    let idRecibido = this.activatedRoute.snapshot.paramMap.get('id');
    if(idRecibido!= null) {
      this.id=idRecibido;
    }else {
      this.id="";
    }
  }

}
