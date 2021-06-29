import { TranslationMessages } from 'react-admin';
import englishMessages from 'ra-language-english';

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
 */

const customEnglishMessages: TranslationMessages = {
  ...englishMessages,
  pos: {
    search: 'Search',
    configuration: 'Configuration',
    profile: 'Profile',
    language: 'Language',
    theme: {
      name: 'Theme',
      light: 'Light',
      dark: 'Dark',
    },
    auth: {
      company_name: 'Company Name',
      email: 'Email',
      confirm_email: 'Confirm Email',
      confirm_password: 'Confirm Password',
      register: 'Create Account',
      register_title: 'Create your account.',
      register_error: 'Registration failed, please retry',
    },
    dashboard: {
      welcome: {
        title: 'Site under construction',
        subtitle: 'Feel free to explore and modify the data.',
        ra_button: 'GitHub repo',
        demo_button: 'Source for this demo',
      },

      monthly_revenue: 'Monthly Revenue',
      month_history: '30 Day Revenue History',
      new_orders: 'New Orders',
      pending_reviews: 'Pending Reviews',
      all_reviews: 'See all reviews',
      new_customers: 'New Customers',
      all_customers: 'See all customers',
      pending_orders: 'Pending Orders',
      order: {
        items:
          'by %{customer_name}, one item |||| by %{customer_name}, %{nb_items} items',
      },
    },
    menu: {
      organization: 'Organization',
      maintenance: 'Maintenance',
      transactions: 'Transactions',
      orders: 'Orders',
    },
    user_menu: {
      profile: {
        success: 'Your profile has been updated',
        failure:
          'A technical error occurred while updating your profile. Please try later.',
        validation: {
          email_already_used: 'Email already used',
        },
      },
      user_config: {
        success: 'Your configurations have been updated',
        failure:
          'A technical error occurred while updating your configurations. Please try later.',
      },
    },
  },
  resources: {
    users: {
      name: 'User |||| Users',
      fields: {
        first_name: 'First Name',
        last_name: 'Last Name',
        name: 'Username',
        email: 'Email',
        phone_no: 'Phone',
        residential_address: 'Residential Address',
        postal_code: 'Postal Code',
        ic_no: 'IC Number',
        nationality: 'Nationality',
        gender: 'Gender',
        date_of_birth: 'Date of Birth',
        company_name: 'Company',
        date_of_commencement: 'Date of Commencement',
        date_of_cessation: 'Date of Cessation',
        department: 'Department',
        designation: 'Hello',
        roles: 'Roles',
        password: 'Password',
        confirm_password: 'Confirm Password',

        is_staff: 'Is Staff',
        image: 'Image',
      },
      fieldGroups: {
        avatar: 'Avatar',
        account: 'Account',
        personal_details: 'Personal Details',
        company_details: 'Company Details',
        change_password: 'Change Password',
      },
      page: {
        delete: 'Delete User',
      },
      errors: {
        password_mismatch:
          'The password confirmation is not the same as the password.',
      },
      data: {
        genders: {
          male: 'Male',
          female: 'Female',
        },
      },
      validation: {
        email_already_used: 'Email already used',
      },
    },
    user_configs: {
      name: 'User Config |||| User Configs',
      fields: {
        gst_rate: 'GST Rate',
        discount_rate: 'Discount Rate',
        theme: 'Theme',
        language: 'Language',
      },
      fieldGroups: {
        general: 'General',
        transactions: 'Transactions',
      },
    },
    employees: {
      name: 'Employee |||| Employees',
      fields: {
        first_name: 'First Name',
        last_name: 'Last Name',
        name: 'Username',
        email: 'Email',
        phone_no: 'Phone',
        residential_address: 'Residential Address',
        postal_code: 'Postal Code',
        ic_no: 'IC Number',
        nationality: 'Nationality',
        gender: 'Gender',
        date_of_birth: 'Date of Birth',
        company_name: 'Company',
        date_of_commencement: 'Date of Commencement',
        date_of_cessation: 'Date of Cessation',
        department: 'Department',
        designation: 'Designation',
        roles: 'Roles',
        password: 'Password',
        confirm_password: 'Confirm Password',
        customer_set: 'Manage Customers',
        product_set: 'Manage Products',

        is_staff: 'Is Staff',

        image: 'Image',
        resume: 'Resume',
      },
      filters: {
        department: 'Department',
        designation: 'Designation',
        role: 'Role',
      },
      tabs: {
        details: 'Details',
        documents: 'Documents',
        account_login: 'Account Login',
        manage_access: 'Manage Access',
      },
      fieldGroups: {
        avatar: 'Avatar',
        account: 'Account',
        personal_details: 'Personal Details',
        company_details: 'Company Details',
        password: 'Password',
        change_password: 'Change Password',
        financial_details: 'Financial Details',
        bank_account_details: 'Bank Account Details',
      },
      page: {
        delete: 'Delete Employee',
      },
      errors: {
        password_mismatch:
          'The password confirmation is not the same as the password.',
        email_mismatch: 'The email confirmation is not the same as the email.',
      },
      data: {
        genders: {
          male: 'Male',
          female: 'Female',
        },
      },
    },
    customers: {
      name: 'Customer |||| Customers',
      fields: {
        attention: 'Attention',
        address: 'Address',
        city: 'City',
        zipcode: 'Zip Code',
        contact: 'Contact',
        term: 'Term',
        email: 'Email',
        image: 'Image',
        name: 'Name',
        receivables: 'Receivables',
        password: 'Password',
        confirm_password: 'Confirm Password',
        state: 'State',
        phone_no: 'Phone',
        commands: 'Orders',
        first_seen: 'First seen',
        groups: 'Segments',
        last_seen: 'Last seen',
        last_seen__gte: 'Visited Since',
        total_spent: 'Total spent',
      },
      filters: {
        agent: 'Agent',
        last_visited: 'Last visited',
        today: 'Today',
        this_week: 'This week',
        last_week: 'Last week',
        this_month: 'This month',
        last_month: 'Last month',
        earlier: 'Earlier',
        has_ordered: 'Has ordered',
        has_newsletter: 'Has newsletter',
        group: 'Segment',
      },
      fieldGroups: {
        avatar: 'Avatar',
        identity: 'Identity',
        address: 'Address',
        other_details: 'Other Details',
        manage_access: 'Manage Access',
        history: 'History',
        stats: 'Stats',
        password: 'Password',
        change_password: 'Change Password',
      },
      page: {
        delete: 'Delete Customer',
      },
      errors: {
        password_mismatch:
          'The password confirmation is not the same as the password.',
      },
      validation: {
        reference_already_used: 'Reference already used',
      },
    },
    suppliers: {
      name: 'Supplier |||| Suppliers',
      fields: {
        attention: 'Attention',
        address: 'Address',
        city: 'City',
        zipcode: 'Zip Code',
        contact: 'Contact',
        term: 'Term',
        phone_no: 'Phone',
        email: 'Email',
        image: 'Image',
        payables: 'Payables',
        password: 'Password',
        confirm_password: 'Confirm Password',
        state: 'State',
        product_set: 'Products',
        commands: 'Orders',
        first_seen: 'First seen',
        groups: 'Segments',
        last_seen: 'Last seen',
        last_seen__gte: 'Visited Since',
        name: 'Name',
        total_spent: 'Total spent',
      },
      filters: {
        last_visited: 'Last visited',
        today: 'Today',
        this_week: 'This week',
        last_week: 'Last week',
        this_month: 'This month',
        last_month: 'Last month',
        earlier: 'Earlier',
        has_ordered: 'Has ordered',
        has_newsletter: 'Has newsletter',
        group: 'Segment',
      },
      fieldGroups: {
        history: 'History',
        password: 'Password',
        change_password: 'Change Password',
        avatar: 'Avatar',
        identity: 'Identity',
        address: 'Address',
        stats: 'Stats',
        other_details: 'Other Details',
      },
      page: {
        delete: 'Delete Customer',
      },
      errors: {
        password_mismatch:
          'The password confirmation is not the same as the password.',
      },
      validation: {
        reference_already_used: 'Reference already used',
      },
    },
    products: {
      name: 'Product |||| Products',
      fields: {
        supplier: 'Supplier',
        name: 'Name',
        unit: 'Unit',
        unit_price: 'Unit Price',
        cost: 'Cost',
        description: 'Description',
        category: 'Category',
        image: 'Image',
        sales: 'Sales',
        stock: 'Stock',
        stock__lte: 'Low Stock',
        thumbnail: 'Thumbnail',
        height__gte: 'Min height',
        height__lte: 'Max height',
        height: 'Height',
        price: 'Price',
        reference: 'Reference',
        width__gte: 'Min width',
        width__lte: 'Max width',
        width: 'Width',
      },
      tabs: {
        image: 'Image',
        details: 'Details',
        description: 'Description',
        reviews: 'Reviews',
        stock: 'Stock',
        transactions: 'Transactions',
      },
      filters: {
        categories: 'Categories',
        stock: 'Stock',
        no_stock: 'Out of stock',
        low_stock: '1 - 9 items',
        average_stock: '10 - 49 items',
        enough_stock: '50 items & more',
        sales: 'Sales',
        best_sellers: 'Best sellers',
        average_sellers: 'Average',
        low_sellers: 'Low',
        never_sold: 'Never sold',
      },
      validation: {
        reference_already_used: 'Reference already used',
      },
    },
    invoices: {
      name: 'Invoice |||| Invoices',
      fields: {
        id: 'Invoice ID',
        description: 'Description',
        payment_date: 'Payment Date',
        payment_method: 'Payment Method',
        payment_note: 'Payment Note',
        gst_rate: 'GST Rate',
        discount_rate: 'Discount Rate',
        gst_amount: 'GST Amount',
        discount_amount: 'Discount Amount',
        net: 'Net',
        total_amount: 'Total Amount',
        status: 'Status',
        salesperson: 'Salesperson',
        date: 'Date',
        customer: 'Customer',
        customer_id: 'Customer Reference',
        date__gte: 'Passed Since',
        date__lte: 'Passed Before',
        total__gte: 'Min amount',
        address: 'Address',
        sales_order: 'Order',
        grand_total: 'Grand Total',
        total_lines: 'Total Lines',
        invoiceitem_set: 'Invoice Items',
      },
      data: {
        statuses: {
          paid: 'Paid',
          unpaid: 'Unpaid',
        },
      },
      validation: {
        reference_already_used: 'Reference already used',
      },
    },
    invoice_items: {
      name: 'Invoice Item |||| Invoice Items',
      fields: {
        id: 'ID',
        product: 'Product',
        unit: 'Unit',
        cost: 'Cost',
        quantity: 'Quantity',
        unit_price: 'Unit Price',
        amount: 'Amount',
        invoice: 'Invoice',
      },
    },
    sales_orders: {
      name: 'Sales Order |||| Sales Orders',
      fields: {
        description: 'Description',
        payment_date: 'Payment Date',
        payment_method: 'Payment Method',
        payment_note: 'Payment Note',
        gst_rate: 'GST Rate',
        discount_rate: 'Discount Rate',
        gst_amount: 'GST Amount',
        discount_amount: 'Discount Amount',
        net: 'Net',
        total_amount: 'Total Amount',
        status: 'Status',
        salesperson: 'Salesperson',
        date: 'Date',
        customer: 'Customer',
        customer_id: 'Customer Reference',
        date__gte: 'Passed Since',
        date__lte: 'Passed Before',
        total__gte: 'Min amount',
        address: 'Address',
        invoice: 'Invoice',
        grand_total: 'Grand Total',
        total_lines: 'Total Lines',
        salesorderitem_set: 'Sales Order Items',
      },
      data: {
        statuses: {
          completed: 'Completed',
          pending: 'Pending',
          cancelled: 'Cancelled',
        },
      },
      validation: {
        reference_already_used: 'Reference already used',
      },
    },
    sales_order_items: {
      name: 'Sales Order Item |||| Sales Order Items',
      fields: {
        id: 'ID',
        product: 'Product',
        unit: 'Unit',
        cost: 'Cost',
        quantity: 'Quantity',
        unit_price: 'Unit Price',
        amount: 'Amount',
        sales_order: 'Sales Order',
      },
    },
    receives: {
      name: 'Receive |||| Receives',
      fields: {
        description: 'Description',
        payment_date: 'Payment Date',
        payment_method: 'Payment Method',
        payment_note: 'Payment Note',
        gst_rate: 'GST Rate',
        discount_rate: 'Discount Rate',
        gst_amount: 'GST Amount',
        discount_amount: 'Discount Amount',
        net: 'Net',
        total_amount: 'Total Amount',
        status: 'Status',
        date: 'Date',
        supplier: 'Supplier',
        supplier_id: 'Supplier Reference',
        date__gte: 'Passed Since',
        date__lte: 'Passed Before',
        total__gte: 'Min amount',
        address: 'Address',
        purchase_order: 'Purchase Order',
        grand_total: 'Grand Total',
        total_lines: 'Total Lines',
        receiveitem_set: 'Receive Items',
      },
      validation: {
        reference_already_used: 'Reference already used',
      },
    },
    receive_items: {
      name: 'Receive Item |||| Receive Items',
      fields: {
        id: 'ID',
        product: 'Product',
        unit: 'Unit',
        cost: 'Cost',
        quantity: 'Quantity',
        unit_price: 'Unit Price',
        amount: 'Amount',
        receive: 'Receive',
      },
    },
    purchase_orders: {
      name: 'Purchase Order |||| Purchase Orders',
      fields: {
        description: 'Description',
        payment_date: 'Payment Date',
        payment_method: 'Payment Method',
        payment_note: 'Payment Note',
        gst_rate: 'GST Rate',
        discount_rate: 'Discount Rate',
        gst_amount: 'GST Amount',
        discount_amount: 'Discount Amount',
        net: 'Net',
        total_amount: 'Total Amount',
        status: 'Status',
        date: 'Date',
        supplier: 'Supplier',
        supplier_id: 'Supplier Reference',
        date__gte: 'Passed Since',
        date__lte: 'Passed Before',
        total__gte: 'Min amount',
        address: 'Address',
        purchase_order: 'Purchase Order',
        grand_total: 'Grand Total',
        total_lines: 'Total Lines',
        purchaseorderitem_set: 'Purchase Order Items',
      },
      data: {
        statuses: {
          completed: 'Completed',
          pending: 'Pending',
          cancelled: 'Cancelled',
        },
      },
      validation: {
        reference_already_used: 'Reference already used',
      },
    },
    purchase_order_items: {
      name: 'Purchase Order Item |||| Purchase Order Items',
      fields: {
        id: 'ID',
        product: 'Product',
        unit: 'Unit',
        cost: 'Cost',
        quantity: 'Quantity',
        unit_price: 'Unit Price',
        amount: 'Amount',
        purchase_order: 'Purchase Order',
      },
    },
    categories: {
      name: 'Category |||| Categories',
      fields: {
        name: 'Name',
        image: 'Image',
        product_set: 'Products',
      },
    },
    departments: {
      name: 'Department |||| Departments',
      fields: {
        name: 'Name',
        image: 'Image',
        user_set: 'Employees',
        designation_set: 'Designations',
      },
    },
    designations: {
      name: 'Designation |||| Designations',
      fields: {
        name: 'Name',
        user_set: 'Employees',
        department: 'Department',
      },
    },
    roles: {
      name: 'Role |||| Roles',
      fields: {
        name: 'Name',
        image: 'Image',
        permissions: 'Manage Permissions',
        user_set: 'Employees',
      },
    },
    commands: {
      name: 'Order |||| Orders',
      amount: '1 order |||| %{smart_count} orders',
      title: 'Order %{reference}',
      fields: {
        basket: {
          delivery: 'Delivery',
          reference: 'Reference',
          quantity: 'Quantity',
          sum: 'Sum',
          tax_rate: 'Tax Rate',
          taxes: 'Tax',
          total: 'Total',
          unit_price: 'Unit Price',
        },
        address: 'Address',
        customer: 'Customer',
        date__gte: 'Passed Since',
        date__lte: 'Passed Before',
        nb_items: 'Nb Items',
        total__gte: 'Min amount',
        status: 'Status',
        returned: 'Returned',
      },
      section: {
        order: 'Order',
        customer: 'Customer',
        shipping_address: 'Shipping Address',
        items: 'Items',
        total: 'Totals',
      },
    },
    reviews: {
      name: 'Review |||| Reviews',
      amount: '1 review |||| %{smart_count} reviews',
      relative_to_poster: 'Review on poster',
      detail: 'Review detail',
      fields: {
        customer: 'Customer',
        command_id: 'Order',
        product_id: 'Product',
        date__gte: 'Posted since',
        date__lte: 'Posted before',
        date: 'Date',
        comment: 'Comment',
        rating: 'Rating',
      },
      action: {
        accept: 'Accept',
        reject: 'Reject',
      },
      notification: {
        approved_success: 'Review approved',
        approved_error: 'Error: Review not approved',
        rejected_success: 'Review rejected',
        rejected_error: 'Error: Review not rejected',
      },
    },
    segments: {
      name: 'Segment |||| Segments',
      fields: {
        customers: 'Customers',
        name: 'Name',
      },
      data: {
        compulsive: 'Compulsive',
        collector: 'Collector',
        ordered_once: 'Ordered once',
        regular: 'Regular',
        returns: 'Returns',
        reviewer: 'Reviewer',
      },
    },
  },
};

export default customEnglishMessages;
