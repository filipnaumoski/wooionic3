import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, IonicPage } from 'ionic-angular';
import * as WC from 'woocommerce-api';

import { ProductDetailsPage } from './../products/product-details/product-details';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController) {
    this.serachQuery = this.navParams.get("searchQuery");

    this.WooCommerce = WC({
      url: 'http://localhost:8888/causewayconnect',
      consumerKey: 'ck_ef17b728d716ec4dcda3d8690f05859cbafa05d0',
      consumerSecret: 'cs_235d42d99363f30b567e35e22a6ff7104751462c'
    });

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
