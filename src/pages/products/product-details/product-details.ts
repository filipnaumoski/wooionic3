import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController, IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { CartPage } from '../../cart/cart';
import { WoocommerceProvider } from '../../../providers/woocommerce/woocommerce';
@IonicPage()
@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetailsPage {
  product: any;
  WooCommerce: any;
  reviews: any[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public WC: WoocommerceProvider
    ) {
    this.product = this.navParams.get('product');

    this.WooCommerce = WC.init();

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
      if (data == null || data.length == 0) {
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
          if (product.id == element.product.id) {
            let qty = element.qty;
            element.qty = qty + 1;
            element.amount = (+element.amount) + (+element.product.price);
            added = 1;
          }
          console.log('el', element);
        });
        if (added == 0) {
          data.push({
            "product": product,
            "qty": 1,
            "amount": +product.price
          })
        }
      }
      this.storage.set('cart', data).then(data => {
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
