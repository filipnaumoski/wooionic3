import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';

import * as WC from 'woocommerce-api';
import { e } from '@angular/core/src/render3';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  WooCommerce: any;
  newUser: any = {};
  billing_shipping_same: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public alertCtrl: AlertController) {
    this.newUser.billing_address = {};
    this.newUser.shipping_address = {};
    this.billing_shipping_same = false;

    this.WooCommerce = WC({
      url: 'http://localhost:8888/causewayconnect',
      consumerKey: 'ck_ef17b728d716ec4dcda3d8690f05859cbafa05d0',
      consumerSecret: 'cs_235d42d99363f30b567e35e22a6ff7104751462c'
    });
  }

  setBillingToShipping() {
    this.billing_shipping_same = !this.billing_shipping_same;
  }

  signup() {
    let customerData = {
      customer: {}
    }

    customerData.customer = {
      "email": this.newUser.email,
      "first_name": this.newUser.first_name,
      "last_name": this.newUser.last_name,
      "username": this.newUser.username,
      "password": this.newUser.password,
      "billing_address": {
        "first_name": this.newUser.billing_address.first_name,
        "last_name": this.newUser.billing_address.last_name,
        "company": "",
        "address_1": this.newUser.billing_address.address_1,
        "address_2": this.newUser.billing_address.address_2,
        "city": this.newUser.billing_address.city,
        "state": this.newUser.billing_address.state,
        "postcode": this.newUser.billing_address.postcode,
        "country": this.newUser.billing_address.country,
        "email": this.newUser.email,
        "phone": this.newUser.billing_address.phone
      },
      "shipping_address": {
        "first_name": this.newUser.first_name,
        "last_name": this.newUser.last_name,
        "company": "",
        "address_1": this.newUser.shipping_address.address_1,
        "address_2": this.newUser.shipping_address.address_2,
        "city": this.newUser.shipping_address.city,
        "state": this.newUser.shipping_address.state,
        "postcode": this.newUser.shipping_address.postcode,
        "country": this.newUser.shipping_address.country
      }
    }

    if (this.billing_shipping_same) {
      this.newUser.shipping_address = this.newUser.billing_address;
    }

    this.WooCommerce.postAsync("customers", customerData).then(data => {
      console.log('data', JSON.parse(data.body));
      let response = JSON.parse(data.body);
      if (response.customer) {
        this.alertCtrl.create({
          title: "Account Created",
          message: "Your account has been created successfully! Please login to proceed",
          buttons: [{
            text: "Login",
            handler: () => {
              //TO DO
            }
          }]
        })
      } else if (response.errors) {
        this.toastCtrl.create({
          message: response.errors[0].message,
          showCloseButton: true
        })
      }
    }, err => {
      console.log('err', JSON.parse(err));
    })

  }

  checkEmail() {
    let validEmail = false;
    let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (reg.test(this.newUser.email)) {
      this.WooCommerce.getAsync('customers/email/' + this.newUser.email).then(data => {
        console.log('email', JSON.parse(data.body));
        let res = JSON.parse(data.body);
        if (res.errors) {
          validEmail = true;
          this.toastCtrl.create({
            message: 'Email is good to go!',
            duration: 3000
          }).present()
        } else {
          validEmail = false;
          this.toastCtrl.create({
            message: 'Email already registered. Please check.',
            showCloseButton: true
          }).present()
        }
      })
    } else {
      validEmail = false;
      this.toastCtrl.create({
        message: 'Invalid Email. Please check.',
        showCloseButton: true
      }).present()
    }
  }

}
