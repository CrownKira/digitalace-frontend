import { TranslationMessages } from "react-admin";
import englishMessages from "ra-language-english";

/**
 * This is from Microsoft
 * Title Caps:
 * Capitalize the first letter of the first and last words. Capitalize the first letter of all words in between, with the exception of articles (a, an, and the); coordinating conjunctions (and, but, for, nor, or, so, and yet); and prepositions of four letters or fewer (at, for, with, into, etc.).
 * Examples: Insert Object. Go To. Always on Top. By Name
 * Use title caps for:
 * - Button names
 * - Column headings
 * - Command button labels
 * - Floating toolbars
 * - Icon labels
 * - Menu names and menu commands
 * - Palette titles
 * - Tab titles
 *
 * Sentence Caps:
 * Capitalize only the first letter of the first word, and capitalize only those other words that are normally capitalized in sentences, such as proper nouns.
 * Examples: Working folder. Print to. Use PostScript driver.
 * Use sentence caps for:
 * - Alternate text (ALT text) used to describe images
 * - Check box labels
 * - Dialog box introductory or explanatory text
 * - File names
 * - Group box labels
 * - InfoTips
 * - List box entries
 * - List box labels
 * - Messages
 * - Option (radio) button labels
 * - Status bar tips
 * - Text box labels (form labels)
 *
 * form label:
 * (<=3): Title case
 * (>3): Sentence case
 *
 * error message:
 * following mui alert format
 * https://material-ui.com/components/alert/
 * eg:
 * <error_title> - <error_message>
 */

export const customEnglishMessages: TranslationMessages = {
  ...englishMessages,
  pos: {
    // nouns
    search: "Search",
    configuration: "Configuration",
    profile: "Profile",
    language: "Language",
    theme: {
      name: "Theme",
      light: "Light",
      dark: "Dark",
    },
    message: {
      coming_soon:
        "We are currently working on this feature and will launch soon!",
    },
    notification: {
      tip: "Tip",
      work_in_progress: "Work in progress",
    },
    action: {
      pdf: "PDF",
      print: "Print",
    },
    validation: {
      password_mismatch:
        "The password confirmation is not the same as the password.",
      email_mismatch: "The email confirmation is not the same as the email.",
    },
    // components
    async_autocomplete_input: {
      data_provider_error:
        // TODO: better message
        "async_autocomplete_input - dataProvider error. Check the console for details.",
    },
    use_validate_unicity: {
      data_provider_error:
        "use_validate_unicity - dataProvider error. Check the console for details.",
    },
    auth: {
      // auth component
      company_name: "Company Name",
      email: "Email",
      confirm_email: "Confirm Email",
      confirm_password: "Confirm Password",
      register: "Create Account",
      register_title: "Create your account.",
      register_error: "Registration failed, please retry",
      validation: {
        passwordMinLength: "Must be 5 characters at least",
      },
    },
    dashboard: {
      welcome: {
        title: "Site under construction",
        subtitle:
          "Welcome to DigitaLAce, an all-in-one business management software. Feel free to explore and modify the data. Want to contribute to our project? Create a pull request on GitHub!",
        ra_button: "GitHub repo",
        demo_button: "Source for this demo",
      },
      monthly_revenue: "Monthly Revenue",
      month_history: "30 Day Cash Flow",
      new_orders: "New Orders",
      new_invoices: "This Month's Invoices",
      pending_reviews: "Pending Reviews",
      receivables: "Total Receivables",
      payables: "Total Payables",
      all_reviews: "See all reviews",
      all_unpaid_invoices: "See all unpaid invoices",
      all_unpaid_receives: "See all unpaid receives",
      new_customers: "New Customers",
      all_customers: "See all customers",
      pending_orders: "Pending Orders",
      invoice: {
        items:
          "by %{customer_name}, one item |||| by %{customer_name}, %{nb_items} items",
      },
      receive: {
        items:
          "to %{supplier_name}, one item |||| to %{supplier_name}, %{nb_items} items",
      },
    },
    menu: {
      // menu on the left
      organization: "Organization",
      maintenance: "Maintenance",
      transactions: "Transactions",
      orders: "Orders",
      miscellaneous: "Miscellaneous",
      payroll: "Payroll",
    },
    user_menu: {
      // menu on the top right
      profile: {
        success: "Your profile has been updated",
        failure:
          "A technical error occurred while updating your profile. Please try later.",
        validation: {
          email_already_used: "Email already used",
        },
      },
      user_config: {
        success: "Your configurations have been updated",
        failure:
          "A technical error occurred while updating your configurations. Please try later.",
        data_provider_error:
          "user_config - dataProvider error. Check the console for details.",
      },
    },
  },
  resources: {
    users: {
      name: "User |||| Users",
      fields: {
        first_name: "First Name",
        last_name: "Last Name",
        name: "Username",
        email: "Email",
        phone_no: "Phone",
        residential_address: "Residential Address",
        postal_code: "Postal Code",
        ic_no: "IC Number",
        nationality: "Nationality",
        gender: "Gender",
        date_of_birth: "Date of Birth",
        company_name: "Company",
        date_of_commencement: "Date of Commencement",
        date_of_cessation: "Date of Cessation",
        department: "Department",
        designation: "Designation",
        roles: "Roles",
        password: "Password",
        confirm_password: "Confirm Password",
        is_staff: "Is Staff",
        image: "Image",
      },
      fieldGroups: {
        avatar: "Avatar",
        account: "Account",
        personal_details: "Personal Details",
        company_details: "Company Details",
        change_password: "Change Password",
      },
      page: {
        delete: "Delete User",
      },
      errors: {
        password_mismatch:
          "The password confirmation is not the same as the password.",
      },
      data: {
        genders: {
          male: "Male",
          female: "Female",
        },
      },
      validation: {
        email_already_used: "Email already used",
      },
    },
    user_configs: {
      name: "User Config |||| User Configs",
      fields: {
        gst_rate: "Default GST Rate",
        discount_rate: "Default Discount Rate",
        theme: "Theme",
        language: "Language",
      },
      fieldGroups: {
        general: "General",
        transactions: "Transactions",
      },
      notification: {
        admin: "You are logged in as an admin.",
        employee: "You are logged in as an employee.",
      },
      tabs: {
        general: "General",
        transactions: "Transactions",
      },
    },
    employees: {
      name: "Employee |||| Employees",
      fields: {
        first_name: "First Name",
        last_name: "Last Name",
        name: "Username",
        email: "Email",
        phone_no: "Phone",
        residential_address: "Residential Address",
        postal_code: "Postal Code",
        ic_no: "IC Number",
        nationality: "Nationality",
        gender: "Gender",
        date_of_birth: "Date of Birth",
        company_name: "Company",
        date_of_commencement: "Date of Commencement",
        date_of_cessation: "Date of Cessation",
        department: "Department",
        designation: "Designation",
        roles: "Roles",
        password: "Password",
        confirm_password: "Confirm Password",
        customer_set: "Manage Customers",
        product_set: "Manage Products",

        is_staff: "Is Staff",

        image: "Image",
        resume: "Resume",
      },
      filters: {
        department: "Department",
        designation: "Designation",
        role: "Role",
      },
      tabs: {
        details: "Details",
        documents: "Documents",
        account_login: "Account Login",
        manage_access: "Manage Access",
      },
      fieldGroups: {
        avatar: "Avatar",
        account: "Account",
        personal_details: "Personal Details",
        company_details: "Company Details",
        password: "Password",
        change_password: "Change Password",
        financial_details: "Financial Details",
        bank_account_details: "Bank Account Details",
      },
      page: {
        delete: "Delete Employee",
      },
      errors: {
        password_mismatch:
          "The password confirmation is not the same as the password.",
        email_mismatch: "The email confirmation is not the same as the email.",
      },
      data: {
        genders: {
          male: "Male",
          female: "Female",
        },
      },
    },
    customers: {
      name: "Customer |||| Customers",
      unused_credits: "%{amount} unused credits",
      receivables: "%{amount} receivables",
      fields: {
        attention: "Attention",
        address: "Address",
        city: "City",
        zipcode: "Zip Code",
        contact: "Contact",
        term: "Term",
        email: "Email",
        image: "Image",
        name: "Name",
        receivables: "Receivables",
        password: "Password",
        confirm_password: "Confirm Password",
        state: "State",
        phone_no: "Phone",
        first_seen: "First seen",
        groups: "Segments",
        last_seen: "Last seen",
        last_seen__gte: "Visited Since",
        total_spent: "Total spent",
        unused_credits: "Unused Credits",
      },
      filters: {
        agent: "Agent",
        last_visited: "Last visited",
        today: "Today",
        this_week: "This week",
        last_week: "Last week",
        this_month: "This month",
        last_month: "Last month",
        earlier: "Earlier",
        has_ordered: "Has ordered",
        has_newsletter: "Has newsletter",
        group: "Segment",
      },
      fieldGroups: {
        avatar: "Avatar",
        identity: "Identity",
        address: "Address",
        other_details: "Other Details",
        manage_access: "Manage Access",
        history: "History",
        stats: "Stats",
        password: "Password",
        change_password: "Change Password",
      },
      page: {
        delete: "Delete Customer",
      },
      errors: {
        password_mismatch:
          "The password confirmation is not the same as the password.",
      },
      validation: {
        reference_already_used: "Reference already used",
      },
    },
    suppliers: {
      name: "Supplier |||| Suppliers",
      payables: "%{amount} payables",
      fields: {
        attention: "Attention",
        address: "Address",
        city: "City",
        zipcode: "Zip Code",
        contact: "Contact",
        term: "Term",
        phone_no: "Phone",
        email: "Email",
        image: "Image",
        payables: "Payables",
        password: "Password",
        confirm_password: "Confirm Password",
        state: "State",
        product_set: "Products",
        first_seen: "First seen",
        groups: "Segments",
        last_seen: "Last seen",
        last_seen__gte: "Visited Since",
        name: "Name",
        total_spent: "Total spent",
      },
      filters: {
        last_visited: "Last visited",
        today: "Today",
        this_week: "This week",
        last_week: "Last week",
        this_month: "This month",
        last_month: "Last month",
        earlier: "Earlier",
        has_ordered: "Has ordered",
        has_newsletter: "Has newsletter",
        group: "Segment",
      },
      fieldGroups: {
        history: "History",
        password: "Password",
        change_password: "Change Password",
        avatar: "Avatar",
        identity: "Identity",
        address: "Address",
        stats: "Stats",
        other_details: "Other Details",
      },
      page: {
        delete: "Delete Customer",
      },
      errors: {
        password_mismatch:
          "The password confirmation is not the same as the password.",
      },
      validation: {
        reference_already_used: "Reference already used",
      },
    },
    products: {
      name: "Product |||| Products",
      fields: {
        supplier: "Supplier",
        name: "Name",
        unit: "Unit",
        unit_price: "Unit Price",
        cost: "Cost",
        description: "Description",
        category: "Category",
        image: "Image",
        sales: "Sales",
        stock: "Stock",
        stock__lte: "Low Stock",
        thumbnail: "Thumbnail",
        height__gte: "Min height",
        height__lte: "Max height",
        height: "Height",
        price: "Price",
        reference: "Reference",
        width__gte: "Min width",
        width__lte: "Max width",
        width: "Width",
      },
      tabs: {
        image: "Image",
        details: "Details",
        description: "Description",
        reviews: "Reviews",
        stock: "Stock",
        transactions: "Transactions",
      },
      filters: {
        categories: "Categories",
        stock: "Stock",
        no_stock: "Out of stock",
        low_stock: "1 - 9 items",
        average_stock: "10 - 49 items",
        enough_stock: "50 items & more",
        sales: "Sales",
        best_sellers: "Best sellers",
        average_sellers: "Average",
        low_sellers: "Low",
        never_sold: "Never sold",
      },
      validation: {
        reference_already_used: "Reference already used",
      },
    },
    credits_applications: {
      name: "Credit Applied |||| Credits Applied",
      fields: {
        id: "Credits Applied ID",
        date: "Date",
        invoice: "Invoice",
        credit_note: "Credit Note",
        amount_to_credit: "Amount to Credit",
      },
      errors: {
        no_customer: "Please select a customer first.",
      },
      action: {
        apply_credits: "Apply Credits",
        create_credit_note: "Create Credit Note",
      },
    },
    credit_notes: {
      name: "Credit Note |||| Credit Notes",
      fields: {
        id: "Credit Note ID",
        reference: "Reference",
        payment_date: "Payment Date",
        payment_method: "Payment Method",
        payment_note: "Payment Note",
        gst_rate: "GST Rate",
        discount_rate: "Discount Rate",
        gst_amount: "GST Amount",
        discount_amount: "Discount Amount",
        net: "Net",
        total_amount: "Total Amount",
        status: "Status",
        salesperson: "Salesperson",
        date: "Date",
        customer: "Customer",
        customer_id: "Customer Reference",
        date__gte: "Passed Since",
        date__lte: "Passed Before",
        total__gte: "Min amount",
        address: "Address",
        grand_total: "Credit Amount",
        credits_remaining: "Credits Available",
        credits_used: "Credits Used",
        amount_to_credit: "Amount to Credit",
        total_lines: "Total Lines",
        creditnoteitem_set: "Credit Note Items",
        creditsapplication_set: "Apply to Invoice",
        created_from: "Associated Invoice",
        description: "Notes",
      },
      nb_items: "1 item |||| %{smart_count} items",
      data: {
        statuses: {
          draft: "Draft",
          open: "Open",
          closed: "Closed",
        },
      },
      validation: {
        reference_already_used: "Reference already used",
      },
      tabs: {
        details: "Details",
        invoices_credited: "Invoices Credited",
      },
      notification: {
        created_from: "Credit note created from",
        no_invoice: "No invoice credited so far.",
        total_invoices:
          "Credits applied to 1 invoice. |||| Credits applied to %{smart_count} invoices.",
      },
      action: {
        print: "Print",
        pdf: "PDF",
        add_item_header: "Add Item Header",
        apply_to_invoice: "Apply to Invoice",
        view: "View",
      },
      data_provider_error:
        "details_alert_section - dataProvider error. Check the console for details.",
    },
    credit_note_items: {
      name: "Credit Note Item |||| Credit Note Items",
      fields: {
        id: "ID",
        product: "Product",
        unit: "Unit",
        cost: "Cost",
        quantity: "Quantity",
        unit_price: "Unit Price",
        amount: "Amount",
        credit_note: "Credit Note",
      },
    },
    payment_methods: {
      name: "Payment Method |||| Payment Methods",
      fields: {
        id: "ID",
        name: "Name",
      },
    },
    announcements: {
      name: "Announcement |||| Announcements",
      fields: {
        id: "ID",
        title: "Title",
        message: "Message",
        status: "Status",
        severity: "Severity",
      },
      data: {
        severities: {
          success: "Success",
          info: "Info",
          warning: "Warning",
          error: "Error",
        },
        statuses: {
          draft: "Draft",
          open: "Open",
        },
      },
    },
    payslips: {
      name: "Payslip |||| Payslips",
      fields: {
        id: "ID",
      },
    },
    invoices: {
      name: "Invoice |||| Invoices",
      fields: {
        id: "Invoice ID",
        reference: "Reference",
        payment_date: "Payment Date",
        payment_method: "Payment Method",
        payment_note: "Payment Note",
        gst_rate: "GST Rate",
        discount_rate: "Discount Rate",
        gst_amount: "GST Amount",
        discount_amount: "Discount Amount",
        net: "Net",
        total_amount: "Total Amount",
        status: "Status",
        salesperson: "Salesperson",
        date: "Date",
        customer: "Customer",
        customer_id: "Customer Reference",
        date__gte: "Passed Since",
        date__lte: "Passed Before",
        total__gte: "Min amount",
        address: "Address",
        sales_order: "Sales Order",
        grand_total: "Grand Total",
        total_lines: "Total Lines",
        invoiceitem_set: "Invoice Items",
        creditsapplication_set: "Apply Credits",
        credits_available: "Credits Available",
        credits_applied: "Credits Applied",
        balance_due: "Balance Due",
        description: "Notes",
      },
      fieldGroups: {
        apply_credits_for: "Apply Credits for %{reference}",
        apply_credits: "Apply Credits",
        credits_applied: "Credits Applied",
      },
      nb_items: "1 item |||| %{smart_count} items",
      data: {
        statuses: {
          draft: "Draft",
          paid: "Paid",
          unpaid: "Unpaid",
        },
      },
      validation: {
        reference_already_used: "Reference already used",
        invalid_credits: "Credits Applied cannot be more than Grand Total",
      },
      tabs: {
        details: "Details",
        credits_applied: "Credits",
        record_payment: "Record Payment",
        delivery_order: "Delivery Order",
        credit_notes: "Credit Notes",
      },
      action: {
        print: "Print",
        pdf: "PDF",
        print_delivery_order: "Print Delivery Order",
        add_item_header: "Add Item Header",
        apply_credits: "Apply Now",
        view: "View",
      },
      notification: {
        // use sentence cap
        select_customer_tip:
          "Remember to select a customer first before applying credits.",
        amount_to_credit: "Amount to credit",
        created_credit_note: "successfully created from %{reference}",
        no_credit_note: "No Credit Note created so far.",
        total_credit_notes:
          "1 credit note created from this invoice. |||| %{smart_count} credit notes created from this invoice.",
      },
    },
    invoice_items: {
      name: "Invoice Item |||| Invoice Items",
      fields: {
        id: "ID",
        product: "Product",
        unit: "Unit",
        cost: "Cost",
        quantity: "Quantity",
        unit_price: "Unit Price",
        amount: "Amount",
        invoice: "Invoice",
      },
    },
    sales_orders: {
      name: "Sales Order |||| Sales Orders",
      fields: {
        reference: "Reference",
        payment_date: "Payment Date",
        payment_method: "Payment Method",
        payment_note: "Payment Note",
        gst_rate: "GST Rate",
        discount_rate: "Discount Rate",
        gst_amount: "GST Amount",
        discount_amount: "Discount Amount",
        net: "Net",
        total_amount: "Total Amount",
        status: "Status",
        salesperson: "Salesperson",
        date: "Date",
        customer: "Customer",
        customer_id: "Customer Reference",
        date__gte: "Passed Since",
        date__lte: "Passed Before",
        total__gte: "Min amount",
        address: "Address",
        invoice: "Invoice",
        invoice_set: "Invoices",
        grand_total: "Grand Total",
        total_lines: "Total Lines",
        salesorderitem_set: "Sales Order Items",
        description: "Notes",
      },
      nb_items: "1 item |||| %{smart_count} items",
      data: {
        statuses: {
          draft: "Draft",
          completed: "Completed",
          pending: "Pending",
          cancelled: "Cancelled",
        },
      },
      validation: {
        reference_already_used: "Reference already used",
      },
      tabs: {
        details: "Details",
        invoices: "Invoices",
      },
      action: {
        create_invoice: "Create Invoice",
        view: "View",
        convert_to_invoice: "Convert to Invoice",
      },
      notification: {
        created_invoice: "successfully created from %{reference}",
        fulfill_order_tip:
          "You can create invoices to complete this sales order.",
        no_invoice: "No associated invoice so far.",
        total_invoices:
          "1 invoice associated to this sales order. |||| %{smart_count} invoices associated to this sales order.",
      },
    },
    sales_order_items: {
      name: "Sales Order Item |||| Sales Order Items",
      fields: {
        id: "ID",
        product: "Product",
        unit: "Unit",
        cost: "Cost",
        quantity: "Quantity",
        unit_price: "Unit Price",
        amount: "Amount",
        sales_order: "Sales Order",
      },
    },
    adjustments: {
      name: "Adjustment |||| Adjustments",
      fields: {
        reference: "Reference",
        status: "Status",
        mode: "Mode",
        date: "Date",
        date__gte: "Passed Since",
        date__lte: "Passed Before",
        address: "Address",
        total_lines: "Total Lines",
        adjustmentitem_set: "Adjustment Items",
        description: "Notes",
        reason: "Reason",
      },
      data: {
        statuses: {
          draft: "Draft",
          adjusted: "Adjusted",
        },
        modes: {
          increase: "Increase",
          decrease: "Decrease",
        },
      },
      validation: {
        reference_already_used: "Reference already used",
      },
      tabs: {
        details: "Details",
      },
      action: {},
      notification: {},
    },
    adjustment_items: {
      name: "Adjustment Item |||| Adjustment Items",
      fields: {
        id: "ID",
        product: "Product",
        unit: "Unit",
        cost: "Cost",
        quantity: "Quantity",
        unit_price: "Unit Price",
        amount: "Amount",
        adjustment: "Adjustment",
      },
    },
    receives: {
      name: "Receive |||| Receives",
      fields: {
        reference: "Reference",
        payment_date: "Payment Date",
        payment_method: "Payment Method",
        payment_note: "Payment Note",
        gst_rate: "GST Rate",
        discount_rate: "Discount Rate",
        gst_amount: "GST Amount",
        discount_amount: "Discount Amount",
        net: "Net",
        total_amount: "Total Amount",
        status: "Status",
        date: "Date",
        supplier: "Supplier",
        supplier_id: "Supplier Reference",
        date__gte: "Passed Since",
        date__lte: "Passed Before",
        total__gte: "Min amount",
        address: "Address",
        purchase_order: "Purchase Order",
        grand_total: "Grand Total",
        total_lines: "Total Lines",
        receiveitem_set: "Receive Items",

        description: "Notes",
      },
      nb_items: "1 item |||| %{smart_count} items",
      validation: {
        reference_already_used: "Reference already used",
      },
      data: {
        statuses: {
          draft: "Draft",
          paid: "Paid",
          unpaid: "Unpaid",
        },
      },
      tabs: {
        details: "Details",
      },
    },
    receive_items: {
      name: "Receive Item |||| Receive Items",
      fields: {
        id: "ID",
        product: "Product",
        unit: "Unit",
        cost: "Cost",
        quantity: "Quantity",
        unit_price: "Unit Price",
        amount: "Amount",
        receive: "Receive",
      },
    },
    purchase_orders: {
      name: "Purchase Order |||| Purchase Orders",
      fields: {
        reference: "Reference",
        payment_date: "Payment Date",
        payment_method: "Payment Method",
        payment_note: "Payment Note",
        gst_rate: "GST Rate",
        discount_rate: "Discount Rate",
        gst_amount: "GST Amount",
        discount_amount: "Discount Amount",
        net: "Net",
        total_amount: "Total Amount",
        status: "Status",
        date: "Date",
        supplier: "Supplier",
        supplier_id: "Supplier Reference",
        date__gte: "Passed Since",
        date__lte: "Passed Before",
        total__gte: "Min amount",
        address: "Address",
        purchase_order: "Purchase Order",
        grand_total: "Grand Total",
        total_lines: "Total Lines",
        purchaseorderitem_set: "Purchase Order Items",
        description: "Notes",
      },
      nb_items: "1 item |||| %{smart_count} items",
      data: {
        statuses: {
          draft: "Draft",
          completed: "Completed",
          pending: "Pending",
          cancelled: "Cancelled",
        },
      },
      validation: {
        reference_already_used: "Reference already used",
      },
      tabs: {
        details: "Details",
      },
    },
    purchase_order_items: {
      name: "Purchase Order Item |||| Purchase Order Items",
      fields: {
        id: "ID",
        product: "Product",
        unit: "Unit",
        cost: "Cost",
        quantity: "Quantity",
        unit_price: "Unit Price",
        amount: "Amount",
        purchase_order: "Purchase Order",
      },
    },
    categories: {
      name: "Category |||| Categories",
      fields: {
        name: "Name",
        image: "Image",
        product_set: "Products",
      },
    },
    departments: {
      name: "Department |||| Departments",
      fields: {
        name: "Name",
        image: "Image",
        user_set: "Employees",
        designation_set: "Designations",
      },
    },
    designations: {
      name: "Designation |||| Designations",
      fields: {
        name: "Name",
        user_set: "Employees",
        department: "Department",
      },
    },
    roles: {
      name: "Role |||| Roles",
      fields: {
        name: "Name",
        image: "Image",
        permissions: "Manage Permissions",
        user_set: "Employees",
      },
    },
    commands: {
      name: "Order |||| Orders",
      amount: "1 order |||| %{smart_count} orders",
      title: "Order %{reference}",
      fields: {
        basket: {
          delivery: "Delivery",
          reference: "Reference",
          quantity: "Quantity",
          sum: "Sum",
          tax_rate: "Tax Rate",
          taxes: "Tax",
          total: "Total",
          unit_price: "Unit Price",
        },
        address: "Address",
        customer: "Customer",
        date__gte: "Passed Since",
        date__lte: "Passed Before",
        nb_items: "Nb Items",
        total__gte: "Min amount",
        status: "Status",
        returned: "Returned",
      },
      section: {
        order: "Order",
        customer: "Customer",
        shipping_address: "Shipping Address",
        items: "Items",
        total: "Totals",
      },
    },
    reviews: {
      name: "Review |||| Reviews",
      amount: "1 review |||| %{smart_count} reviews",
      relative_to_poster: "Review on poster",
      detail: "Review detail",
      fields: {
        customer: "Customer",
        command_id: "Order",
        product_id: "Product",
        date__gte: "Posted since",
        date__lte: "Posted before",
        date: "Date",
        comment: "Comment",
        rating: "Rating",
      },
      action: {
        accept: "Accept",
        reject: "Reject",
      },
      notification: {
        approved_success: "Review approved",
        approved_error: "Error: Review not approved",
        rejected_success: "Review rejected",
        rejected_error: "Error: Review not rejected",
      },
    },
    segments: {
      name: "Segment |||| Segments",
      fields: {
        customers: "Customers",
        name: "Name",
      },
      data: {
        compulsive: "Compulsive",
        collector: "Collector",
        ordered_once: "Ordered once",
        regular: "Regular",
        returns: "Returns",
        reviewer: "Reviewer",
      },
    },
  },
};
