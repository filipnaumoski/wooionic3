import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  username: string;
  password: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public toastCtrl: ToastController,
    public storage: Storage,
    public alertCtrl: AlertController
  ) {
    this.username = '';
    this.password = '';
  }

  login() {
    this.http.get('http://localhost:8888/causewayconnect/api/auth/generate_auth_cookie/?insecure=cool&username='
      + this.username + '&password=' + this.password).subscribe(
        data => {
          console.log('data', data.json()); //user password: u0&3aoYHfNO%nGh3XUSa@6QX
          let response = data.json();
          if (response.error) {
            this.toastCtrl.create({
              message: response.error,
              duration: 5000
            }).present();
            return;
          }
          this.storage.set('userLoginInfo', response).then(data => {
            this.alertCtrl.create({
              title: "Login Successful",
              message: "You have been logged successfully!",
              buttons: [{
                text: "OK",
                handler: () => {
                  if (this.navParams.get("next")) {
                    this.navCtrl.push(this.navParams.get("next"))
                  } else {
                    this.navCtrl.pop();
                  }
                }
              }]
            }).present();
          });
        }, err => {
          console.log('err', err);
        }
      )
  }

}
