import faker from 'faker/locale/en';

export const weightedArrayElement = (values: any, weights: any) =>
  faker.random.arrayElement(
    values.reduce(
      (acc: any, value: any, index: any) =>
        acc.concat(new Array(weights[index]).fill(value)),
      []
    )
  );

export const weightedBoolean = (likelyhood: any) =>
  faker.random.number(99) < likelyhood;

export const randomDate = (minDate?: Date, maxDate?: Date) => {
  const minTs =
    minDate instanceof Date
      ? minDate.getTime()
      : Date.now() - 5 * 365 * 24 * 60 * 60 * 1000; // 5 years
  const maxTs = maxDate instanceof Date ? maxDate.getTime() : Date.now();
  const range = maxTs - minTs;
  const randomRange = faker.random.number({ max: range });
  // move it more towards today to account for traffic increase
  const ts = Math.sqrt(randomRange / range) * range;
  return new Date(minTs + ts);
};

export const randomFloat = (min: any, max: any) =>
  parseFloat(faker.random.number({ min, max, precision: 0.01 }).toFixed(2));
