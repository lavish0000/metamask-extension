import { TransactionMeta } from '@metamask/transaction-controller';
import { BigNumber } from 'bignumber.js';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Hex } from '@metamask/utils';
import { calcTokenAmount } from '../../../../../../../../shared/lib/transactions-controller-utils';
import { getIntlLocale } from '../../../../../../../ducks/locale/locale';
import { formatAmount } from '../../../../simulation-details/formatAmount';
import { TOKEN_VALUE_UNLIMITED_THRESHOLD } from '../../shared/constants';
import { parseApprovalTransactionData } from '../../../../../../../../shared/modules/transaction.utils';
import { useIsNFT } from './use-is-nft';

export function isSpendingCapUnlimited(decodedSpendingCap: number) {
  return decodedSpendingCap >= TOKEN_VALUE_UNLIMITED_THRESHOLD;
}

export const useApproveTokenSimulation = (
  transactionMeta: TransactionMeta,
  decimals: string | undefined,
) => {
  const locale = useSelector(getIntlLocale);
  const { isNFT, pending: isNFTPending } = useIsNFT(transactionMeta);
  const transactionData = transactionMeta?.txParams?.data as Hex | undefined;

  const { amountOrTokenId: parsedValue } =
    parseApprovalTransactionData(transactionData ?? '0x') ?? {};

  const value = parsedValue ?? new BigNumber(0);

  const decodedSpendingCap = calcTokenAmount(
    value,
    Number(decimals ?? '0'),
  ).toFixed();

  const tokenPrefix = isNFT ? '#' : '';

  const formattedSpendingCap = useMemo(() => {
    return isNFT
      ? `${tokenPrefix}${decodedSpendingCap}`
      : formatAmount(locale, new BigNumber(decodedSpendingCap));
  }, [decodedSpendingCap, isNFT, locale]);

  const { spendingCap, isUnlimitedSpendingCap } = useMemo(() => {
    if (!isNFT && isSpendingCapUnlimited(parseInt(decodedSpendingCap, 10))) {
      return { spendingCap: decodedSpendingCap, isUnlimitedSpendingCap: true };
    }
    return {
      spendingCap: `${tokenPrefix}${decodedSpendingCap}`,
      isUnlimitedSpendingCap: false,
    };
  }, [decodedSpendingCap, formattedSpendingCap, isNFT]);

  return {
    isUnlimitedSpendingCap,
    spendingCap,
    formattedSpendingCap,
    value,
    pending: isNFTPending,
  };
};
