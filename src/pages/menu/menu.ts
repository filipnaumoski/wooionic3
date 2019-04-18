import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from './../home/home';

import * as WC from 'woocommerce-api';
import { ProductsPage } from '../products/products';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  homePage: any
  WooCommerce: any;
  categories: any[]
  @ViewChild('content') childNavCtrl: NavController;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.homePage = HomePage
    this.categories = [];

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

  openCategoryPage(category) {
    this.childNavCtrl.setRoot(ProductsPage, { "category": category })
  }

}
