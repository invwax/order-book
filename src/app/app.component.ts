import { Component } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { IWsMessage } from './app.interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'order-book';
  private ws = new WebsocketService();
  private buyData = [];
  private sellData = [];
  public displaySellData: Array<Array<string>>;
  public displayBuyData: Array<Array<string>>;
  private listSize = 60;
  public intersection: string;

  ngOnInit() {

    this.ws.observable.subscribe((msg: IWsMessage) => {
      const orderBookData = msg;
      if (orderBookData.type === 'snapshot'){
        this.sellData = orderBookData.asks.sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
        this.buyData = orderBookData.bids.sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]));

        this.displaySellData = this.sellData.slice(0, this.listSize).reverse();
        this.displayBuyData = this.buyData.slice(0, this.listSize);
      }
      if (orderBookData.type === 'l2update'){
        if (orderBookData.changes[0][0] === 'sell') {

            const updatedIndex = this.sellData.findIndex(el => el[0] === orderBookData.changes[0][1]);
            if (updatedIndex > -1) {
              if (orderBookData.changes[0][2] === '0.00000000') {
                this.sellData.splice(updatedIndex, 1);
              } else {
                this.sellData[updatedIndex][1] = orderBookData.changes[0][2];
              }
            } else {
              this.sellData = [...this.sellData, [orderBookData.changes[0][1], orderBookData.changes[0][2]]]
                .sort((a, b) => a[0] - b[0]);
            }
            this.displaySellData = this.sellData.slice(0, this.listSize).reverse();

        }
        if (orderBookData.changes[0][0] === 'buy'){
          const updatedIndex = this.buyData.findIndex(el => el[0] === orderBookData.changes[0][1]);

          if (updatedIndex > -1) {
            if (orderBookData.changes[0][2] === '0.00000000') {
              this.buyData.splice(updatedIndex, 1);
            } else {
              this.buyData[updatedIndex][1] = orderBookData.changes[0][2];
            }
          } else {
            this.buyData = [...this.buyData, [orderBookData.changes[0][1], orderBookData.changes[0][2]]]
              .sort((a, b) => b[0] - a[0]);
          }
          this.displayBuyData = this.buyData.slice(0, this.listSize);
        }
      }
      if (this.displaySellData && this.displayBuyData){
        this.intersection = (parseFloat(this.displaySellData[this.listSize - 1][0]) - parseFloat(this.displayBuyData[0][0])).toFixed(2);
      }
    });
  }
}
