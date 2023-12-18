import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { user } from 'src/app/models/user.model';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);

  constructor() {}

  ngOnInit() {}

  async onSubmit() {
    if (this.form.valid) {
      const loading = await this.utilSvc.loading();
      await loading.present();

      //console.log(this.form.value);

      this.firebaseSvc
        .singUp(this.form.value as user)
        .then(async (res) => {
          await this.firebaseSvc.updateUser(this.form.value.name);
          let uid = res.user.uid;
          this.form.controls.uid.setValue(uid);
          this.setUserInfo(uid);
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

  async setUserInfo(uid: string) {
    if (this.form.valid) {
      const loading = await this.utilSvc.loading();
      await loading.present();

      let path =  `users/${uid}`;
      delete this.form.value.password;

      this.firebaseSvc
        .setDocument(path as string, this.form.value)
        .then(async (res) => {
          this.utilSvc.presentToast({
            message:  `Bienvenido ${this.form.value.name}`,
            duration: 2000,
            color: 'primary',
            position: 'middle',
            icon: 'person-circle-outline',
          });
          this.utilSvc.saveInLocalStorage('User', this.form.value.uid);
          this.utilSvc.routerLink('main/home');
          this.form.reset();
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
