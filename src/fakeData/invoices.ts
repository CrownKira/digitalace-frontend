export default (db: any) => {
  let id = 0;

  return (
    db.commands
      .filter((command: any) => command.status !== 'delivered')
      // @ts-ignore
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((command: any) => ({
        id: id++,
        date: command.date,
        command_id: command.id,
        customer_id: command.customer_id,
        total_ex_taxes: command.total_ex_taxes,
        delivery_fees: command.delivery_fees,
        tax_rate: command.tax_rate,
        taxes: command.taxes,
        total: command.total,
      }))
  );
};