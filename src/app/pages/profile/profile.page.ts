import { Component, OnInit } from '@angular/core';
import { Camera } from '@ionic-native/camera/ngx';
import { AlertController } from '@ionic/angular';

import { UsuarioService } from './../../services/usuario.service';
import { FirebaseService } from './../../services/firebase.service';
import { ToastService } from './../../services/toast.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  public user: any;
  public foto: any;

  constructor(
    public usuario: UsuarioService,
    public firebase: FirebaseService,
    public camera: Camera,
    public alert: AlertController,
    public toast: ToastService
  ) {
    this.usuario.getUserData().subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit() {
  }

  async updateName() {
    const nameAlert = await this.alert.create({
      header: 'Insira seu nome',
      inputs: [
        {
          type: 'text',
          name: 'nome',
          min: 3,
          value: this.user.nome
        }
      ],
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Salvar',
          handler: async (input) => {
            if (input.nome.length >= 3) {
              this.user.nome = input.nome;

              await this.firebase.db().collection('users')
                .doc(this.user.id)
                .set({
                  nome: this.user.nome
                }, { merge: true });

              this.toast.presentToast('Nome atualizado com sucesso!');
            } else {
              this.toast.presentToast('Insira um nome com no mínimo 3 letras!');
            }
          }
        }
      ]
    });

    await nameAlert.present();
  }

  async updatePhone() {
    const phoneAlert = await this.alert.create({
      header: 'Insira seu telefone',
      inputs: [
        {
          type: 'tel',
          name: 'phone',
          min: 11,
          max: 11,
          value: this.user.telefone
        }
      ],
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Salvar',
          handler: async (input) => {
            if (input.phone.length === 11) {
              this.user.telefone = input.phone;

              await this.firebase.db().collection('users')
                .doc(this.user.id)
                .set({
                  telefone: this.user.telefone
                }, { merge: true });

              this.toast.presentToast('Telefone atualizado com sucesso!');
            } else {
              this.toast.presentToast('Insira um telefone válido!');
            }
          }
        }
      ]
    });

    await phoneAlert.present();
  }

  async pickFoto() {
    const opcoes = {
      quality: 95,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      targetWidth: 100,
      targetHeight: 100
    };

    try {
      const captura = await this.camera.getPicture(opcoes);
      this.foto = `data:image/jpeg;base64,${captura}`;

      const uploadTask = await this.firebase.storage().ref()
          .child(`images/${this.user.id}/perfil.jpg`)
          .putString(this.foto, 'data_url');

      await uploadTask.ref.getDownloadURL().then(url => {
        this.foto = url;
      });

      await this.firebase.db().collection('users')
        .doc(this.user.id)
        .set({
          photoURL: this.foto
        }, { merge: true });

      this.toast.presentToast('Foto de perfil atualizada com sucesso!');
    } catch (error) {
      console.log('Deu Ruim', error);
    }
  }

}
