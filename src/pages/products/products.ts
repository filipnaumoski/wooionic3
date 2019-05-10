import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { WoocommerceProvider } from '../../providers/woocommerce/woocommerce';
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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public WC: WoocommerceProvider
    ) {
    this.page = 1;
    this.category = this.navParams.get('category');

    this.WooCommerce = WC.init();

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
