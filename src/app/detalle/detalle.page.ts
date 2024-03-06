import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { ActivatedRoute, Router } from '@angular/router';
import {Pan} from '../pan';
import { LoadingController, ToastController } from '@ionic/angular';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import { AlertController } from '@ionic/angular';
import { Share } from '@capacitor/share';

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

  imagenSelect: string = "";

  constructor(private activatedRoute: ActivatedRoute, 
    private firestoreService: FirestoreService, 
    private router: Router, 
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private imagePicker: ImagePicker
    ) {
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

  async confirmarBorrado() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Deseas borrar este pan permanentemente?',
      buttons: [
        {
          text: 'no',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Borrado cancelado');
          }
        }, {
          text: 'si',
          handler: () => {
            console.log('Borrado confirmado');
            this.clickBotonBorrar(); // Llama a la función de borrado cuando el usuario confirma
          }
        }
      ]
    });

    await alert.present();
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

   //IMAGEN
   async seleccionarImagen() {
    //Comprobamos si la aplicaciónn tiene parámetros de lectura
    console.log("Entramos seleccionar imagen")
    this.imagePicker.hasReadPermission().then(
      (result) => {
        //Si no tiene permiso de lectura se solicita al usuario
        if (result == false) {
          this.imagePicker.requestReadPermission();
        } else {
          console.log("Búscamos imagen en selector")
          //Abrir selector de imágenes (ImagePicker)
          this.imagePicker.getPictures({
            maximumImagesCount: 1, //Permitir sólo 1 imagen
            outputType: 1 // 1 = Base64
          }).then(
            (results) => {
              console.log(results) // En la variable results se tienen las imágenes seleccionadas
              if (results.length > 0) { // Si el usuario ha elegido alguna imagen
                console.log("Imagen seleccionado");
                // En la variaBLEe imagenSelect quedará almacenadda la imagen seleccionada
                this.imagenSelect = "data:image/jpeg;base64," + results[0];
                console.log("Imagen que se ha seleccionado (En Base64): " + this.imagenSelect);
              }
            },
            (err) => {
              console.log(err)
            }
          );
        }
      }, (err) => {
        console.log(err);
      });
  }

  async subirImagen() {
    
    // Mensaje de espera mientras se sube la imagen
    const loading = await this.loadingController.create({
      message: 'Please wait ...'
    });

    // Mensaje de finalización de subida de la imagen
    const toast = await this.toastController.create({
      message: 'Image was updated successfully',
      duration: 3000
    });

    // Carpeta del Storage donde se almacenará la imagen
    let nombreCarpeta = "imagenes";

    // Mostrar el mensaje de espera
    loading.present();

    //Asignar el nombre de la iamgen en función de la hora actual para evitar duplicaciones de nombres
    let nombreImagen = '${new Date().getTime()}';
    //Llamar al método que sube la imagen al storage
    this.firestoreService.subirImagenBase64(nombreCarpeta, nombreImagen, this.imagenSelect)
    .then(snapshot => {
      snapshot.ref.getDownloadURL()
      .then(downloadURL => {
        console.log("downloadURL:" + downloadURL);
        toast.present();
        loading.dismiss();
      })
    })
  }

  async eliminarArchivo(fileURL: string) {
    const toast = await this.toastController.create({
      message: 'File deleted successfully',
      duration: 3000
    });
    this.firestoreService.eliminarArchivoPorUrl(fileURL)
      .then(() => {
        toast.present();
      }, (err) => {
        console.log(err)
      });
  }

  async share(){
    await Share.share({
      text: "Pan: " + this.document.data.nombre + " Tipo: " + this.document.data.tipo,
    });
    }
}
