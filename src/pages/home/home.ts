import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, ToastController, IonicPage } from 'ionic-angular';
import { WoocommerceProvider } from '../../providers/woocommerce/woocommerce';
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  WooCommerce: any;
  products: any[];
  page: number;
  moreProducts: any[];
  searchQuery: ''

  @ViewChild('productSlides') productSlides: Slides;
  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public WC: WoocommerceProvider
    ) {
    this.page = 2;

    this.WooCommerce = WC.init();

    this.loadMoreProducts(null);

    this.WooCommerce.getAsync("products").then(res => {
      this.products = JSON.parse(res.body).products;
    }, err => {
    })
  }

  ionViewDidLoad() {
    setInterval(() => {
      if (this.productSlides.getActiveIndex() == this.productSlides.length() - 1)
        this.productSlides.slideTo(0);

      this.productSlides.slideNext();
    }, 3000)
  }

  loadMoreProducts(event) {
    if (event == null) {
      this.page = 2;
      this.moreProducts = [];
    }
    else
      this.page++;

    this.WooCommerce.getAsync("products?page=" + this.page).then(res => {
      this.moreProducts = this.moreProducts.concat(JSON.parse(res.body).products);

      if (event !== null) {
        event.complete();
      }

      if (JSON.parse(res.body).products.length < 10) {
        event.enable(false);

        this.toastCtrl.create({
          message: 'No more products!',
          duration: 5000
        }).present()
      }
    }, err => {
    })
  }

  openProductDetails(product){
    this.navCtrl.push('ProductDetailsPage', {"product": product});
  }

  onSearch(event) {
    if(this.searchQuery.length > 0) {
      this.navCtrl.push('SearchPage', {"searchQuery": this.searchQuery})
    }
  }

}
