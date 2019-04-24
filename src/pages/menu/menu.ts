import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { HomePage } from './../home/home';

import * as WC from 'woocommerce-api';
import { ProductsPage } from '../products/products';
import { SignupPage } from '../signup/signup';
import { LoginPage } from './../login/login';
import { Storage } from '@ionic/storage';
import { CartPage } from '../cart/cart';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  homePage: any
  WooCommerce: any;
  categories: any[]
  loggedIn: boolean;
  user: any;
  @ViewChild('content') childNavCtrl: NavController;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public modalCtrl: ModalController) {
    this.homePage = HomePage
    this.categories = [];
    this.user = {};

    this.WooCommerce = WC({
      url: 'http://localhost:8888/causewayconnect',
      consumerKey: 'ck_ef17b728d716ec4dcda3d8690f05859cbafa05d0',
      consumerSecret: 'cs_235d42d99363f30b567e35e22a6ff7104751462c'
    });

    this.WooCommerce.getAsync("products/categories").then(res => {
      let temp: any[] = JSON.parse(res.body).product_categories;
      temp.forEach(element => {
        if (element.parent == 0 && element.slug != 'uncategorized') {
          if (element.slug == 'clothing') {
            element.icon = 'shirt';
          }
          if (element.slug == 'music') {
            element.icon = 'musical-notes';
          }
          if (element.slug == 'posters') {
            element.icon = 'images';
          }
          this.categories.push(element);
        }
      });
    }, err => {
      console.log('err', err);
    })
  }

  ionViewDidEnter(){
    this.storage.ready().then(()=>{
      this.storage.get('userLoginInfo').then( data =>{
        if(data != null) {
          this.user = data.user;
          this.loggedIn = true;
        } else {
          this.loggedIn = false;
          this.user = {};
        }
      })
    })
  }

  openCategoryPage(category) {
    this.childNavCtrl.setRoot(ProductsPage, { "category": category })
  }

  openPage(pageName: string) {
    if(pageName == 'signup') {
      this.navCtrl.push(SignupPage);
    } else if(pageName == 'login') {
      this.navCtrl.push(LoginPage);
    } else if (pageName == 'logout') {
      this.storage.remove('userLoginInfo').then( () => {
        this.user = {};
        this.loggedIn = false;
      })
    } else if(pageName == 'cart') {
      let modal = this.modalCtrl.create(CartPage);
      modal.present();
    }
  }

}
