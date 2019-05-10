
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, IonicPage, ToastController } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public viewCtrl: ViewController, public toastCtrl: ToastController) {
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
    this.storage.get('userLoginInfo').then(data => {
      if (data != null) {
        this.navCtrl.push('CheckoutPage');
      } else {
        this.navCtrl.push('LoginPage', { next: 'CheckoutPage' })
      }
    })
  }

  changeQty(item, i, change) {
    let price = 0;
    let qty = 0;

    price = parseFloat(item.product.price);
    qty = item.qty;

    if (change < 0 && item.qty == 1) {
      return;
    }

    qty = qty + change;
    item.qty = qty;
    item.amount = qty * price;
    console.log('qty:', item.qty, 'amount:', item.amount, change);

    this.cartItems[i] = item;
    console.log('this.cartItems', this.cartItems);

    this.storage.set('cart', this.cartItems).then( () => {
      // this.total = this.total - (price * qty);
      this.toastCtrl.create({
        message: 'Cart Updated!',
        duration: 2000,
        showCloseButton: true
      }).present();
    })
  }

}
