import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController, IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import * as WC from 'woocommerce-api';
import { CartPage } from '../../cart/cart';
@IonicPage()
@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetailsPage {
  product: any;
  WooCommerce: any;
  reviews: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public toastCtrl: ToastController, public modalCtrl: ModalController) {
    this.product = this.navParams.get('product');

    this.WooCommerce = WC({
      url: 'http://localhost:8888/causewayconnect',
      consumerKey: 'ck_ef17b728d716ec4dcda3d8690f05859cbafa05d0',
      consumerSecret: 'cs_235d42d99363f30b567e35e22a6ff7104751462c'
    });

    this.WooCommerce.getAsync('products/' + this.product.id + '/reviews').then(
      res => {
        this.reviews = JSON.parse(res.body).product_reviews;
      },
      err => {
        console.log('err', err);
      }
    );
  }

  addToCart(product) {
    this.storage.get('cart').then(data => {
      if(data == null || data.length == 0) {
        data = [];
        data.push({
          "product": product,
          "qty": 1,
          "amount": +product.price
        })
        console.log('data', data);
      } else {
        let added = 0

        data.forEach(element => {
          if(product.id == element.product.id){
            console.log('Product is already in the cart!');
            let qty = element.qty;
            element.qty = qty+1;
            element.amount = (+element.amount) + (+element.product.price);
            added = 1;
          }
          console.log('el', element);
        });
        if(added == 0){
          data.push({
            "product": product,
            "qty": 1,
            "amount": +product.price
          })
        }
      }
      this.storage.set('cart', data).then(data =>{
        console.log('Cart Updated!', data);

        this.toastCtrl.create({
          message: 'Cart Updated!',
          duration: 3000
        }).present()
      })
    })
  }

  openCart() {
    this.modalCtrl.create(CartPage).present();
  }

}
