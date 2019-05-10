import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CartPage } from '../cart/cart';
import { WoocommerceProvider } from '../../providers/woocommerce/woocommerce';
@IonicPage()
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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public modalCtrl: ModalController,
    public WC: WoocommerceProvider
    ) {
    this.homePage = 'HomePage'
    this.categories = [];
    this.user = {};

    this.WooCommerce = WC.init();

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
    this.childNavCtrl.setRoot('ProductsPage', { "category": category })
  }

  openPage(pageName: string) {
    if(pageName == 'signup') {
      this.navCtrl.push('SignupPage');
    } else if(pageName == 'login') {
      this.navCtrl.push('LoginPage');
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
