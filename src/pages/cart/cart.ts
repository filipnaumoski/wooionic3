
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';
@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {
  cartItems: any[] = [];
  total: any
  showEmptyCartMessage: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public viewCtrl: ViewController) {
    this.total = 0.0;

    this.storage.ready().then(() => {

      this.storage.get('cart').then(data => {
        this.cartItems = data;

        if (this.cartItems.length > 0) {
          this.cartItems.forEach((item, index) => {
            this.total = this.total + (+item.product.price * item.qty);
          })
        } else {
          this.showEmptyCartMessage = true;
        }
      })

    })
  }

  removeFromCart(item, index) {
    let price = item.product.price;
    let qty = item.qty;
    this.cartItems.splice(index, 1);

    this.storage.set('cart', this.cartItems).then(data => {
      this.total = this.total - (price * qty);
    })

    if (this.cartItems.length == 0) {
      this.showEmptyCartMessage = true;
    }
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  checkout() {
    this.storage.get('userLoginInfo').then( data => {
      if(data != null) {
        this.navCtrl.push('CheckoutPage');
      } else {
        this.navCtrl.push('LoginPage', {next: 'CheckoutPage'})
      }
    })
  }

}
