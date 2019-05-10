import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, IonicPage } from 'ionic-angular';

import { ProductDetailsPage } from './../products/product-details/product-details';
import { WoocommerceProvider } from '../../providers/woocommerce/woocommerce';
@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  serachQuery: string = '';
  WooCommerce: any;
  products: any[] = [];
  page: number = 2;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public WC: WoocommerceProvider
    ) {
    this.serachQuery = this.navParams.get("searchQuery");

    this.WooCommerce = WC.init();

    this.WooCommerce.getAsync("products?filter[q]=" + this.serachQuery).then( searchData => {
      this.products = JSON.parse(searchData.body).products;
    }, err => {
    })
  }

  openProductDetails(product) {
    this.navCtrl.push(ProductDetailsPage, { "product": product });
  }

  loadMoreProducts(event) {
    this.page++;

    this.WooCommerce.getAsync(
      'products?filter[category]=' + this.serachQuery + '&page=' + this.page
    ).then(
      res => {
        let temp = JSON.parse(res.body).products;
        this.products = this.products.concat(JSON.parse(res.body).products);
        if (event !== null) {
          event.complete();
        }
        if (temp.length < 10) {
          this.toastCtrl.create({
            message: 'No more products!',
            duration: 5000
          }).present()
          event.enable(false);
        }
      },
      err => { }
    );
  }

}
