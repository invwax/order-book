import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { Observable } from 'rxjs';
import { IWsMessage } from './app.interfaces';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private subject = webSocket('wss://ws-feed.pro.coinbase.com/');
  public observable: Observable<any>;

  constructor() {

    this.observable = this.subject.multiplex(
      () => ({
        type: 'subscribe',
        product_ids: [
          'BTC-USD'
        ],
        channels: [
            'level2'
          ]
      }),
      () => ({
        type: 'unsubscribe',
        product_ids: [
          'BTC-USD'
        ],
        channels: [
            'level2'
          ]
      }),
      (message: IWsMessage) => {
        return ([ 'subscriptions', 'snapshot', 'l2update' ].includes(message.type));
      }
    );
  }
}
