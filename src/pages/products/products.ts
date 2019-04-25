import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import * as WC from 'woocommerce-api';
@IonicPage()
@Component({
  selector: 'page-products',
  templateUrl: 'products.html'
})
export class ProductsPage {
  WooCommerce: any;
  products: any[];
  page: number;
  category: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController) {
    this.page = 1;
    this.category = this.navParams.get('category');

    this.WooCommerce = WC({
      url: 'http://localhost:8888/causewayconnect',
      consumerKey: 'ck_ef17b728d716ec4dcda3d8690f05859cbafa05d0',
      consumerSecret: 'cs_235d42d99363f30b567e35e22a6ff7104751462c'
    });

    this.WooCommerce.getAsync(
      'products?filter[category]=' + this.category.slug
    ).then(
      res => {
        this.products = JSON.parse(res.body).products;
      },
      err => {
      }
    );
  }

  loadMoreProducts(event) {
    this.page++;

    this.WooCommerce.getAsync(
      'products?filter[category]=' + this.category.slug + '&page=' + this.page
    ).then(
      res => {
        let temp = JSON.parse(res.body).products;
        this.products = this.products.concat(JSON.parse(res.body).products);
        if (event !== null) {
          event.complete();
        }
        if (temp.length < 10) {
          event.enable(false);

          this.toastCtrl.create({
            message: 'No more products!',
            duration: 5000
          }).present()
        }
      },
      err => { }
    );
  }

  openProductDetails(product) {
    this.navCtrl.push('ProductDetailsPage', { "product": product });
  }
}
