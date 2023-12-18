import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { user } from 'src/app/models/user.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);

  constructor() {}

  ngOnInit() {}

  async onSubmit() {
    if (this.form.valid) {
      const loading = await this.utilSvc.loading();
      await loading.present();

      this.firebaseSvc
        .singIn(this.form.value as user)
        .then((res) => {
          this.getUserInfo(res.user.uid);
        })
        .catch((error) => {
          this.utilSvc.presentToast({
            message: error.message,
            duration: 5000,
            color: 'warning',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }

  async getUserInfo(uid: string) {
    if (this.form.valid) {
      const loading = await this.utilSvc.loading();
      await loading.present();

      let path =  `users/${uid}`;

      this.firebaseSvc
        .getDocument(path as string)
        .then((user: user) => {
          this.utilSvc.saveInLocalStorage('User', JSON.stringify(user));
          this.utilSvc.routerLink('main/home');
          this.form.reset();
          this.utilSvc.presentToast({
            message:  `Te damos la bienvenida ${user.name}`,
            duration: 2000,
            color: 'primary',
            position: 'middle',
            icon: 'person-circle-outline',
          });
        })
        .catch((error) => {
          this.utilSvc.presentToast({
            message: error.message,
            duration: 5000,
            color: 'warning',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }
}
