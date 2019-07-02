import { Component, OnInit } from '@angular/core';
import { Camera } from '@ionic-native/camera/ngx';

import { UsuarioService } from './../../services/usuario.service';
import { FirebaseService } from './../../services/firebase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  public fotoPadrao = 'assets/img/add-avatar.png';
  public foto: any;
  public nome = '';
  public email = '';
  public telefone = '';
  public atletica = '';
  public senha = '';
  public userId = '';
  public showLoading = false;

  constructor(
    public usuario: UsuarioService,
    public firebase: FirebaseService,
    public camera: Camera
  ) {
    this.usuario.getUser().subscribe(user => {
      if (user.isOnline) {
        this.userId = user.id;
      }
    });
  }

  ngOnInit() {
  }

  async registrar() {
    try {
      this.showLoading = true;
      await this.usuario.registrar(this.email, this.senha);
      this.gravarUsuario();
      this.showLoading = false;
    } catch (erro) {
      this.showLoading = false;
    }
  }

  async gravarUsuario() {
    try {
      if (this.foto) {
        const uploadTask = await this.firebase.storage().ref()
          .child(`images/${this.userId}/perfil.jpg`)
          .putString(this.foto, 'data_url');

        await uploadTask.ref.getDownloadURL().then(url => {
          this.foto = url;
        });
      }

      await this.firebase.db().collection('users').doc(this.userId).set({
        nome: this.nome,
        telefone: this.telefone,
        atletica: this.atletica,
        photoURL: this.foto || this.fotoPadrao,
        esportes: '',
        tipo: 'player'
      });
    } catch (erro) {
      console.log(erro);
    }
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
    } catch (error) {
      console.log('Deu Ruim', error);
    }
  }

}
