// list(Permission.objects.values('id', 'codename'))
// TODO: limit permissions
export const permissions = [
  { id: 29, codename: "add_user", name: "Can add employee" },
  { id: 30, codename: "change_user", name: "Can change employee" },
  { id: 31, codename: "delete_user", name: "Can delete employee" },
  { id: 32, codename: "view_user", name: "Can view employee" },
  // { id: 33, codename: 'add_company', name: 'Can add company' },
  // { id: 34, codename: 'change_company', name: 'Can change company' },
  // { id: 35, codename: 'delete_company', name: 'Can delete company' },
  // { id: 36, codename: 'view_company', name: 'Can view company' },
  // { id: 37, codename: 'add_userconfig', name: 'Can add user config' },
  // { id: 38, codename: 'change_userconfig', name: 'Can change user config' },
  // { id: 39, codename: 'delete_userconfig', name: 'Can delete user config' },
  // { id: 40, codename: 'view_userconfig', name: 'Can view user config' },
  { id: 41, codename: "add_department", name: "Can add department" },
  { id: 42, codename: "change_department", name: "Can change department" },
  { id: 43, codename: "delete_department", name: "Can delete department" },
  { id: 44, codename: "view_department", name: "Can view department" },
  { id: 45, codename: "add_role", name: "Can add role" },
  { id: 46, codename: "change_role", name: "Can change role" },
  { id: 47, codename: "delete_role", name: "Can delete role" },
  { id: 48, codename: "view_role", name: "Can view role" },
  { id: 49, codename: "add_supplier", name: "Can add supplier" },
  { id: 50, codename: "change_supplier", name: "Can change supplier" },
  { id: 51, codename: "delete_supplier", name: "Can delete supplier" },
  { id: 52, codename: "view_supplier", name: "Can view supplier" },
  { id: 53, codename: "add_productcategory", name: "Can add product category" },
  {
    id: 54,
    codename: "change_productcategory",
    name: "Can change product category",
  },
  {
    id: 55,
    codename: "delete_productcategory",
    name: "Can delete product category",
  },
  {
    id: 56,
    codename: "view_productcategory",
    name: "Can view product category",
  },
  { id: 57, codename: "add_customer", name: "Can add customer" },
  { id: 58, codename: "change_customer", name: "Can change customer" },
  { id: 59, codename: "delete_customer", name: "Can delete customer" },
  { id: 60, codename: "view_customer", name: "Can view customer" },
  { id: 61, codename: "add_product", name: "Can add product" },
  { id: 62, codename: "change_product", name: "Can change product" },
  { id: 63, codename: "delete_product", name: "Can delete product" },
  { id: 64, codename: "view_product", name: "Can view product" },
  { id: 65, codename: "add_invoice", name: "Can add invoice" },
  { id: 66, codename: "change_invoice", name: "Can change invoice" },
  { id: 67, codename: "delete_invoice", name: "Can delete invoice" },
  { id: 68, codename: "view_invoice", name: "Can view invoice" },
  { id: 69, codename: "add_salesorder", name: "Can add sales order" },
  { id: 70, codename: "change_salesorder", name: "Can change sales order" },
  { id: 71, codename: "delete_salesorder", name: "Can delete sales order" },
  { id: 72, codename: "view_salesorder", name: "Can view sales order" },
  // { id: 73, codename: 'add_salesorderitem', name: 'Can add sales order item' },
  // {
  //   id: 74,
  //   codename: 'change_salesorderitem',
  //   name: 'Can change sales order item',
  // },
  // {
  //   id: 75,
  //   codename: 'delete_salesorderitem',
  //   name: 'Can delete sales order item',
  // },
  // {
  //   id: 76,
  //   codename: 'view_salesorderitem',
  //   name: 'Can view sales order item',
  // },
  // { id: 77, codename: 'add_invoiceitem', name: 'Can add invoice item' },
  // { id: 78, codename: 'change_invoiceitem', name: 'Can change invoice item' },
  // { id: 79, codename: 'delete_invoiceitem', name: 'Can delete invoice item' },
  // { id: 80, codename: 'view_invoiceitem', name: 'Can view invoice item' },
  { id: 81, codename: "add_purchaseorder", name: "Can add purchase order" },
  {
    id: 82,
    codename: "change_purchaseorder",
    name: "Can change purchase order",
  },
  {
    id: 83,
    codename: "delete_purchaseorder",
    name: "Can delete purchase order",
  },
  { id: 84, codename: "view_purchaseorder", name: "Can view purchase order" },
  { id: 85, codename: "add_receive", name: "Can add receive" },
  { id: 86, codename: "change_receive", name: "Can change receive" },
  { id: 87, codename: "delete_receive", name: "Can delete receive" },
  { id: 88, codename: "view_receive", name: "Can view receive" },
  // { id: 89, codename: 'add_receiveitem', name: 'Can add receive item' },
  // { id: 90, codename: 'change_receiveitem', name: 'Can change receive item' },
  // { id: 91, codename: 'delete_receiveitem', name: 'Can delete receive item' },
  // { id: 92, codename: 'view_receiveitem', name: 'Can view receive item' },
  // {
  //   id: 93,
  //   codename: 'add_purchaseorderitem',
  //   name: 'Can add purchase order item',
  // },
  // {
  //   id: 94,
  //   codename: 'change_purchaseorderitem',
  //   name: 'Can change purchase order item',
  // },
  // {
  //   id: 95,
  //   codename: 'delete_purchaseorderitem',
  //   name: 'Can delete purchase order item',
  // },
  // {
  //   id: 96,
  //   codename: 'view_purchaseorderitem',
  //   name: 'Can view purchase order item',
  // },
  { id: 97, codename: "add_payslip", name: "Can add payslip" },
  { id: 98, codename: "change_payslip", name: "Can change payslip" },
  { id: 99, codename: "delete_payslip", name: "Can delete payslip" },
  { id: 100, codename: "view_payslip", name: "Can view payslip" },
  { id: 101, codename: "add_stockbalance", name: "Can add stock balance" },
  {
    id: 102,
    codename: "change_stockbalance",
    name: "Can change stock balance",
  },
  {
    id: 103,
    codename: "delete_stockbalance",
    name: "Can delete stock balance",
  },
  { id: 104, codename: "view_stockbalance", name: "Can view stock balance" },
  { id: 105, codename: "add_designation", name: "Can add designation" },
  { id: 106, codename: "change_designation", name: "Can change designation" },
  { id: 107, codename: "delete_designation", name: "Can delete designation" },
  { id: 108, codename: "view_designation", name: "Can view designation" },
  { id: 109, codename: "add_paymentmethod" },
  { id: 110, codename: "change_paymentmethod" },
  { id: 111, codename: "delete_paymentmethod" },
  { id: 112, codename: "view_paymentmethod" },
  { id: 113, codename: "add_adjustment" },
  { id: 114, codename: "change_adjustment" },
  { id: 115, codename: "delete_adjustment" },
  { id: 116, codename: "view_adjustment" },
  { id: 117, codename: "add_creditsapplication" },
  { id: 118, codename: "change_creditsapplication" },
  { id: 119, codename: "delete_creditsapplication" },
  { id: 120, codename: "view_creditsapplication" },
  { id: 121, codename: "add_deliveryorder" },
  { id: 122, codename: "change_deliveryorder" },
  { id: 123, codename: "delete_deliveryorder" },
  { id: 124, codename: "view_deliveryorder" },
  { id: 125, codename: "add_creditnote" },
  { id: 126, codename: "change_creditnote" },
  { id: 127, codename: "delete_creditnote" },
  { id: 128, codename: "view_creditnote" },
  { id: 129, codename: "add_adjustmentitem" },
  { id: 130, codename: "change_adjustmentitem" },
  { id: 131, codename: "delete_adjustmentitem" },
  { id: 132, codename: "view_adjustmentitem" },
  { id: 133, codename: "add_creditnoteitem" },
  { id: 134, codename: "change_creditnoteitem" },
  { id: 135, codename: "delete_creditnoteitem" },
  { id: 136, codename: "view_creditnoteitem" },
];
