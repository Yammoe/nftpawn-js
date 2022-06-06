import { AcceptOfferParams, CancelLoanParams, CancelOfferParams, CloseOfferParams, CreateLoanParams, LiquidateLoanParams, MakeOfferParams, OrderNowParams, PayLoanParams, TransactionResult } from './protocol.interface';

export abstract class Protocol {
  abstract createLoan(params: CreateLoanParams): Promise<TransactionResult>;
  abstract cancelLoan(params: CancelLoanParams): Promise<TransactionResult>;
  abstract makeOffer(params: MakeOfferParams): Promise<TransactionResult>;
  abstract cancelOffer(params: CancelOfferParams): Promise<TransactionResult>;
  abstract acceptOffer(params: AcceptOfferParams): Promise<TransactionResult>;
  abstract orderNow(params: OrderNowParams): Promise<TransactionResult>;
  abstract liquidateLoan(params: LiquidateLoanParams): Promise<TransactionResult>;
  abstract closeOffer(params: CloseOfferParams): Promise<TransactionResult>;
  abstract payLoan(params: PayLoanParams): Promise<TransactionResult>;
}