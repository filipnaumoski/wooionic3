import { Injectable } from '@angular/core';
import * as WC from 'woocommerce-api';

@Injectable()
export class WoocommerceProvider {
  WooCommerce: any;
  constructor() {

    this.WooCommerce = WC({
      url: 'http://localhost:8888/causewayconnect',
      consumerKey: 'ck_ef17b728d716ec4dcda3d8690f05859cbafa05d0',
      consumerSecret: 'cs_235d42d99363f30b567e35e22a6ff7104751462c'
    });
  }

  init() {
    return this.WooCommerce;
  }

}
