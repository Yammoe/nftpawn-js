import { WalletSelector } from '@near-wallet-selector/core';
import { AcceptOfferParams, CancelLoanParams, CancelOfferParams, CreateLoanParams, LiquidateLoanParams, MakeOfferParams, OrderNowParams, PayLoanParams, Protocol, TransactionResult } from '@nftpawn-js/core';
import AcceptOfferTx from './transactions/acceptOffer';
import CancelLoanTx from './transactions/cancelLoan';
import CancelOfferTx from './transactions/cancelOffer';
import CreateLoanTx from './transactions/createLoan';
import LiquidateLoanTx from './transactions/liquidateLoan';
import MakeOfferTx from './transactions/makeOffer';
import MakeOfferNearTx from './transactions/makeOfferNear';
import OrderNowTx from './transactions/orderNow';
import OrderNowNearTx from './transactions/orderNowNear';
import PayLoanTx from './transactions/payLoan';
import PayLoanNearTx from './transactions/payLoanNear';

export default class PawnProtocolNear extends Protocol {
  walletSelector: WalletSelector
  accountId: string

  constructor(walletSelector: WalletSelector, accountId: string) {
    super()
    this.walletSelector = walletSelector
    this.accountId = accountId
  }

  async createLoan(params: CreateLoanParams): Promise<TransactionResult> {
    const tx = new CreateLoanTx(this.walletSelector, this.accountId)
    return tx.run(
      params.asset_token_id,
      params.asset_contract_address,
      params.principal,
      params.rate,
      params.duration,
      params.currency_contract_address,
      params.currency_decimal,
      params.available_in,
      params.loan_config,
    )
  }

  async cancelLoan(params: CancelLoanParams): Promise<TransactionResult> {
    const tx = new CancelLoanTx(this.walletSelector, this.accountId)
    return tx.run(params.asset_token_id, params.asset_contract_address)
  }

  async makeOffer(params: MakeOfferParams): Promise<TransactionResult> {
    const tx = new MakeOfferTx(this.walletSelector, this.accountId)
    return tx.run(
      params.asset_token_id,
      params.asset_contract_address,
      params.currency_contract_address,
      params.currency_decimal,
      params.principal,
      params.rate,
      params.duration,
      params.available_in,
    )
  }

  async makeOfferNear(params: MakeOfferParams): Promise<TransactionResult> {
    const tx = new MakeOfferNearTx(this.walletSelector, this.accountId)
    return tx.run(
      params.asset_token_id,
      params.asset_contract_address,
      params.currency_contract_address,
      params.currency_decimal,
      params.principal,
      params.rate,
      params.duration,
      params.available_in,
    )
  }

  async cancelOffer(params: CancelOfferParams): Promise<TransactionResult> {
    const tx = new CancelOfferTx(this.walletSelector, this.accountId)
    return tx.run(
      params.asset_token_id,
      params.asset_contract_address,
      Number(params.nonce),
    )
  }

  async acceptOffer(params: AcceptOfferParams): Promise<TransactionResult> {
    const tx = new AcceptOfferTx(this.walletSelector, this.accountId)
    return tx.run(
      params.asset_token_id,
      params.asset_contract_address,
      Number(params.lender_nonce),
    )
  }

  async orderNow(params: OrderNowParams): Promise<TransactionResult> {
    const tx = new OrderNowTx(this.walletSelector, this.accountId)
    return tx.run(
      params.asset_token_id,
      params.asset_contract_address,
      params.currency_contract_address,
      params.currency_decimals,
      params.principal,
      params.rate,
      params.duration,
    )
  }

  async orderNowNear(params: OrderNowParams): Promise<TransactionResult> {
    const tx = new OrderNowNearTx(this.walletSelector, this.accountId)
    return tx.run(
      params.asset_token_id,
      params.asset_contract_address,
      params.currency_contract_address,
      params.currency_decimals,
      params.principal,
      params.rate,
      params.duration,
    )
  }

  async payLoan(params: PayLoanParams): Promise<TransactionResult> {
    const tx = new PayLoanTx(this.walletSelector, this.accountId)
    return tx.run(
      params.pay_amount,
      params.asset_token_id,
      params.asset_contract_address,
      params.currency_contract_address,
      params.currency_decimal,
      params.principal,
      params.rate,
      params.duration,
    )
  }

  async payLoanNear(params: PayLoanParams): Promise<TransactionResult> {
    const tx = new PayLoanNearTx(this.walletSelector, this.accountId)
    return tx.run(
      params.pay_amount,
      params.asset_token_id,
      params.asset_contract_address,
      params.currency_contract_address,
      params.currency_decimal,
      params.principal,
      params.rate,
      params.duration,
    )
  }

  async liquidateLoan(params: LiquidateLoanParams): Promise<TransactionResult> {
    const tx = new LiquidateLoanTx(this.walletSelector, this.accountId)
    return tx.run(params.asset_token_id, params.asset_contract_address)
  }
}