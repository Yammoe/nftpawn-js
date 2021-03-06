import BigNumber from 'bignumber.js';
import * as dayjs from 'dayjs';
import { Chain } from './constants/network';

const DAY_SECS = 86400;
const YEAR_DAYS = 365;
const EARLY_PAY_RATIO = 2;
const PLATFORM_FEE = 0.01;

/**
* Take a duration in seconds and return the timestamp from now
* @param seconds duration in seconds
* @returns timestamp after seconds from now
*/
export function isEvmChain(chain: Chain) {
  return ["MATIC"].includes(chain);
}


/**
* Take a duration in seconds and return the timestamp from now
* @param seconds duration in seconds
* @returns timestamp after seconds from now
*/
export function timestampAfter(seconds: number): number {
  return dayjs().add(seconds, 's').unix();
};


/**
* Calculate maximum interest of a loan
* @param principal principal amount of the loan
* @param interest interest rate (eg: passing 0.1 for 10%) of the loan
* @param duration duration in seconds of the loan
* @returns return maximum interest amount of the loan
*/
export const calculateMaxInterest = (principal: number, interest: number, duration: number): number => {
  const loanDay = duration / DAY_SECS;
  
  const primaryInterest = new BigNumber(principal)
    .multipliedBy(interest)
    .multipliedBy(loanDay)
    .dividedBy(YEAR_DAYS);
  return primaryInterest.toNumber();
}


/**
* Calculate maximum payment amount of a loan
* @param principal principal amount of the loan
* @param interest interest rate (eg: passing 0.1 for 10%) of the loan
* @param duration duration in seconds of the loan
* @returns return maximum payment amount of the loan
*/
export const calculateMaxTotalPay = (principal: number, interest: number, duration: number): number => {
  const loanDay = duration / DAY_SECS;
  const primaryInterest = new BigNumber(principal)
    .multipliedBy(interest)
    .multipliedBy(loanDay)
    .dividedBy(YEAR_DAYS);
  const matchingFee = new BigNumber(principal).dividedBy(100);
  return new BigNumber(principal)
    .plus(primaryInterest)
    .plus(matchingFee)
    .toNumber();
}


/**
* Calculate payment amount of a loan. If the loan is pay early (before last day), the interest of leftover days is count as 50%.
* @param principal principal amount of the loan
* @param interest interest rate (eg: passing 0.1 for 10%) of the loan
* @param duration duration in seconds of the loan
* @param decimals maximum decimal places of currency, Eg: decimals = 18 for ETH, because it is divisible up to 18 decimal places
* @param startedAt timestamp in seconds when the loan started
* @returns return payment amount of the loan
*/
export const calculateTotalPay = (principal: number, interest: number, duration: number, decimals: number, startedAt: number) => {
  const payAt = dayjs().unix();

  let maxLoanDay = Math.floor(duration / DAY_SECS);
  if (maxLoanDay === 0) maxLoanDay = 1;

  let loanDay = maxLoanDay;
  if (payAt < startedAt + duration && payAt > startedAt) {
    loanDay = Math.floor((payAt - startedAt) / DAY_SECS) + 1;
  }
  if (loanDay >= maxLoanDay) {
    loanDay = maxLoanDay;
  }

  const primaryInterest = new BigNumber(principal)
    .shiftedBy(decimals)
    .multipliedBy(interest)
    .multipliedBy(loanDay)
    .dividedToIntegerBy(YEAR_DAYS);
  let secondaryInterest = new BigNumber(0);
  if (maxLoanDay > loanDay) {
    // 50% interest remain day
    secondaryInterest = new BigNumber(principal)
      .shiftedBy(decimals)
      .multipliedBy(interest)
      .multipliedBy(maxLoanDay - loanDay)
      .dividedToIntegerBy(YEAR_DAYS)
      .dividedToIntegerBy(EARLY_PAY_RATIO)
  }
  // 1% fee (base on principal amount)
  const matchingFee = new BigNumber(principal)
    .shiftedBy(decimals)
    .dividedToIntegerBy(1 / PLATFORM_FEE)

  return new BigNumber(principal)
    .shiftedBy(decimals)
    .plus(primaryInterest)
    .plus(secondaryInterest)
    .plus(matchingFee)
    .shiftedBy(-decimals)
    .toString()
}