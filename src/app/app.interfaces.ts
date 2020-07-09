export interface IWsMessage {
    type: string;
    product_id: string;
    asks?: Array<Array<string>>;
    bids?: Array<Array<string>>;
    changes?: Array<Array<string>>;
}
