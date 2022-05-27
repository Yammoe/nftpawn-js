import * as dayjs from 'dayjs';
import { timestampAfter, calculateMaxInterest, calculateMaxTotalPay, calculateTotalPay } from './utils';

describe('timestampAfter', () => {
  it('should return the correct timestamp', () => {
    const actual = timestampAfter(1653636350);
    expect(actual).toEqual(dayjs().add(1653636350, 's').unix());
  });
});

describe('calculateMaxInterest', () => {
  it('should return the correct max interest', () => {
    const actual = calculateMaxInterest(100, 0.24, 864000);
    expect(actual).toEqual(0.6575342465753424);
  });
});

describe('calculateMaxTotalPay', () => {
  it('should return the correct max total pay amount', () => {
    const actual = calculateMaxTotalPay(100, 0.24, 864000);
    expect(actual).toEqual(101.65753424657534);
  });
});

describe('calculateTotalPay', () => {
  it('should return the correct result for case pay loan right after borrow', () => {
    const actual = calculateTotalPay(100, 0.24, 864000, 18, dayjs().subtract(1, 'm').unix());
    expect(typeof(actual)).toEqual('string');
    expect(actual).toEqual('101.361643835616438355');
  });
});