import { random, lorem } from 'faker/locale/en';
import sub_days from 'date-fns/sub_days';
import is_after from 'date-fns/is_after';

import { randomDate, weightedArrayElement, weightedBoolean } from './utils';

export default (
  db: any,
  {
    serializeDate,
  }: {
    serializeDate: any;
  }
) => {
  const today = new Date();
  const aMonthAgo = sub_days(today, 30);

  let id = 0;
  const reviewers = db.customers
    .filter((customer: any) => customer.has_ordered)
    .filter(() => weightedBoolean(60)) // only 60% of buyers write reviews
    .map((customer: any) => customer.id);

  return db.commands
    .filter((command: any) => reviewers.indexOf(command.customer_id) !== -1)
    .reduce(
      (acc: any, command: any) => [
        ...acc,
        ...command.basket
          .filter(() => weightedBoolean(40)) // reviewers review 40% of their products
          .map((product: any) => {
            const date = randomDate(command.date);
            const status = is_after(aMonthAgo, date)
              ? weightedArrayElement(['accepted', 'rejected'], [3, 1])
              : weightedArrayElement(
                  ['pending', 'accepted', 'rejected'],
                  [5, 3, 1]
                );

            return {
              id: id++,
              date: serializeDate ? date.toISOString() : date,
              status: status,
              command_id: command.id,
              product_id: product.product_id,
              customer_id: command.customer_id,
              rating: random.number({ min: 1, max: 5 }),
              comment: Array.apply(
                null,
                Array(random.number({ min: 1, max: 5 }))
              )
                .map(() => lorem.sentences())
                .join('\n \r'),
            };
          }),
      ],
      []
    );
};
