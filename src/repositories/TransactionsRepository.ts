import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const { income, outcome } = transactions.reduce(
      (balance: Balance, transaction: Transaction) => {
        const currentBalance: Balance = balance;

        switch (transaction.type) {
          case 'income':
            currentBalance.income += Number(transaction.value);
            break;
          case 'outcome':
            currentBalance.outcome += Number(transaction.value);
            break;
          default:
            break;
        }

        return currentBalance;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    const total = income - outcome;

    return { income, outcome, total };
  }
}

export default TransactionsRepository;
