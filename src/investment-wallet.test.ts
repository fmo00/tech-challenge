import { InvestmentWallet } from '@/investment-wallet.class';
import { WalletMock } from '@/mocks/wallet.mock';
import { describe, expect, it, jest } from '@jest/globals';
import 'jest';

describe('When instantiating a wallet with stock operations list', () => {
  it("should format operations list into wallet history", () => {
    const wallet = new InvestmentWallet(WalletMock.stockList());

    expect(wallet.getWallet().history).toBeDefined()
    expect(wallet.getWallet()).toEqual(WalletMock.generatedWallet())
  });
})

describe('When executing wallet trading history', () => {
  const wallet = new InvestmentWallet(WalletMock.stockList());

  it("should check if current operation is a purchase", () => {
    const isPurchaseSpy = jest.spyOn(wallet as any, 'isPurchase')

    wallet.executeTradingHistory()

    expect(wallet).toBeDefined()
    expect(isPurchaseSpy.mock.results[0]).toBeTruthy()
  });

  it("if operation is a purchase, tax return must be 0", () => {
    wallet.executeTradingHistory()

    expect(wallet.getWallet().taxCost[0]).toEqual(WalletMock.zeroTaxReturnObject())
  });

  it("should check if operation did not generate loss or profit", () => {
    const isOperationNotProfitableSpy = jest.spyOn(wallet as any, 'isOperationNotProfitable')

    wallet.executeTradingHistory()

    expect(isOperationNotProfitableSpy).toHaveBeenCalled()
    expect(isOperationNotProfitableSpy.mock.results.length).toBeGreaterThan(1)
  });

  it("if operation did not generate loss or profit, tax return must be 0", () => {
    jest.spyOn(wallet as any, 'isOperationNotProfitable').mockReturnValueOnce(false)

    wallet.executeTradingHistory()

    expect(wallet.getWallet().taxCost[0]).toEqual(WalletMock.zeroTaxReturnObject());
  });

  describe("if operation is profitable", () => {
    it("must calculate generated profit", () => {
      jest.spyOn(wallet as any, 'isPurchase').mockReturnValueOnce(false)
      jest.spyOn(wallet as any, 'isOperationNotProfitable').mockReturnValueOnce(false)

      const isOperationProfitableSpy = jest.spyOn(wallet as any, 'isOperationProfitable').mockReturnValueOnce(true)
      const calculateOperationProfitSpy = jest.spyOn(wallet as any, 'calculateOperationProfit')

      wallet.executeTradingHistory()
      const operation = wallet.getWallet().history[0]

      expect(isOperationProfitableSpy).toHaveBeenCalled();
      expect(calculateOperationProfitSpy).toHaveBeenCalled();
      expect(calculateOperationProfitSpy.mock.calls[0]).toEqual([operation.unitcost, operation.quantity]);
    });

    it("must check if wallet has any uncharged debt", () => {
      jest.spyOn(wallet as any, 'isPurchase').mockReturnValueOnce(false)
      jest.spyOn(wallet as any, 'isOperationNotProfitable').mockReturnValueOnce(false)

      const isOperationProfitableSpy = jest.spyOn(wallet as any, 'isOperationProfitable').mockReturnValueOnce(true)
      const hasDebtToBeChargedSpy = jest.spyOn(wallet as any, 'hasDebtToBeCharged').mockReturnValueOnce(false)

      wallet.executeTradingHistory()

      expect(isOperationProfitableSpy).toHaveBeenCalled();
      expect(hasDebtToBeChargedSpy).toHaveBeenCalled();
    });
  });

  describe("if operation is profitable and there is not uncharged debt in wallet", () => {
    it("must calculate tax return for operation", () => {
      const taxReturn = 1500
      jest.spyOn(wallet as any, 'isPurchase').mockReturnValueOnce(false)
      jest.spyOn(wallet as any, 'isOperationNotProfitable').mockReturnValueOnce(false)
      jest.spyOn(wallet as any, 'isOperationProfitable').mockReturnValueOnce(true)

      const handleTaxReturnSpy = jest.spyOn(wallet as any, 'handleTaxReturn')
      const hasDebtToBeChargedSpy = jest.spyOn(wallet as any, 'hasDebtToBeCharged').mockReturnValueOnce(false)
      const calculateTaxForOperationSpy = jest.spyOn(wallet as any, 'calculateTaxForOperation').mockReturnValueOnce(taxReturn)

      wallet.executeTradingHistory()

      expect(hasDebtToBeChargedSpy).toHaveBeenCalled();
      expect(hasDebtToBeChargedSpy.mock.results[0]).toBeTruthy()
      expect(handleTaxReturnSpy).toHaveBeenCalled()
      expect(calculateTaxForOperationSpy).toHaveBeenCalled()
    });
  });

  describe("if operation is profitable and there is uncharged debt in wallet", () => {
    it("must charge debt from generated profit", () => {
      jest.spyOn(wallet as any, 'isPurchase').mockReturnValueOnce(false)
      jest.spyOn(wallet as any, 'isOperationNotProfitable').mockReturnValueOnce(false)
      jest.spyOn(wallet as any, 'isOperationProfitable').mockReturnValueOnce(true)

      const chargeDebtSpy = jest.spyOn(wallet as any, 'chargeDebt')
      const hasDebtToBeChargedSpy = jest.spyOn(wallet as any, 'hasDebtToBeCharged').mockReturnValueOnce(true)

      wallet.executeTradingHistory()

      expect(hasDebtToBeChargedSpy).toHaveBeenCalled();
      expect(hasDebtToBeChargedSpy.mock.results[0]).toBeTruthy()
      expect(chargeDebtSpy).toHaveBeenCalled()
    });
  });

  describe("if operation is not profitable", () => {
    it("must calculate generated debt and update wallet debitValue", () => {
      const debitValue = -1500
      jest.spyOn(wallet as any, 'isPurchase').mockReturnValueOnce(false)
      jest.spyOn(wallet as any, 'isOperationProfitable').mockReturnValueOnce(false)
      jest.spyOn(wallet as any, 'calculateOperationShortage').mockReturnValueOnce(debitValue)

      const handleProfitShortageSpy = jest.spyOn(wallet as any, 'handleProfitShortage')
      const setWalletDebitSpy = jest.spyOn(wallet as any, 'setWalletDebit')

      wallet.executeTradingHistory()

      expect(handleProfitShortageSpy).toHaveBeenCalled();
      expect(setWalletDebitSpy.mock.calls[0]).toEqual([debitValue])
    });

    it("tax return must be 0", () => {
      jest.spyOn(wallet as any, 'isPurchase').mockReturnValueOnce(false)
      jest.spyOn(wallet as any, 'isOperationProfitable').mockReturnValueOnce(false)

      const handleProfitShortageSpy = jest.spyOn(wallet as any, 'handleProfitShortage')
      const setTaxReturnForOperationSpy = jest.spyOn(wallet as any, 'setTaxReturnForOperation')

      wallet.executeTradingHistory()
      const operationTax = wallet.getWallet().taxCost[0]

      expect(handleProfitShortageSpy).toHaveBeenCalled();
      expect(setTaxReturnForOperationSpy.mock.calls[0]).toEqual([0])
      expect(operationTax).toEqual(WalletMock.zeroTaxReturnObject())
    });
  });
})