import { Record } from 'ra-core';

import generateCustomers from './customers';
import generateCategories from './categories';
import generateProducts from './products';
import generateCommands from './commands';
import generateInvoices from './invoices';
import generateReviews from './reviews';
import finalize from './finalize';

export interface Db {
  customers: Record[];
  suppliers: Record[];
  products: Record[];
  invoices: Record[];
  sales_orders: Record[];
  receives: Record[];
  purchase_orders: Record[];
  categories: Record[];
  commands: Record[];
  reviews: Record[];
}

export default (options = { serializeDate: true }): Db => {
  const db = {} as Db;

  // order matters
  db.categories = generateCategories();
  db.customers = generateCustomers(db, options);
  db.suppliers = generateCustomers(db, options);
  db.products = generateProducts(db);
  db.commands = generateCommands(db, options);
  db.reviews = generateReviews(db, options);
  db.invoices = generateInvoices(db);
  db.sales_orders = generateInvoices(db);
  db.receives = generateInvoices(db);
  db.purchase_orders = generateInvoices(db);
  finalize(db);

  return db;
};
