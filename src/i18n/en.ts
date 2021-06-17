import { TranslationMessages } from 'react-admin';
import englishMessages from 'ra-language-english';

// TODO: update msg
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
      register: 'Create Account',
      register_message: 'Create your account.',
      register_error: 'Registration failed, please retry',
      email: 'Email',
      confirm_email: 'Confirm Email',
      confirm_password: 'Confirm Password',
      company: 'Company',
    },
    user_menu: {
      profile: {
        success: 'Your profile has been updated',
        failure:
          'A technical error occurred while updating your profile. Please try later.',
      },
    },
    dashboard: {
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
      welcome: {
        title: 'Site under construction',
        subtitle: 'Feel free to explore and modify the data.',
        ra_button: 'GitHub repo',
        demo_button: 'Source for this demo',
      },
    },
    menu: {
      organization: 'Organization',
      maintenance: 'Maintenance',
      transactions: 'Transactions',
      orders: 'Orders',
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
        phone_no: 'Phone Number',
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
      },
      fieldGroups: {
        avatar: 'Avatar',
        account: 'Account',
        personal_details: 'Personal Details',
        company_details: 'Company Details',
        password: 'Password',
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
    },

    employees: {
      name: 'Employee |||| Employees',
      fields: {
        first_name: 'First Name',
        last_name: 'Last Name',
        name: 'Username',
        email: 'Email',
        phone_no: 'Phone Number',
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
        commands: 'Orders',
        first_seen: 'First seen',
        groups: 'Segments',
        last_seen: 'Last seen',
        last_seen__gte: 'Visited Since',
        name: 'Name',
        total_spent: 'Total spent',
        receivables: 'Receivables',
        password: 'Password',
        confirm_password: 'Confirm Password',
        state: 'State',
        phone_no: 'Phone',
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
        agent: 'Agent',
      },
      fieldGroups: {
        avatar: 'Avatar',
        identity: 'Identity',
        address: 'Address',
        other_details: 'Other Details',
        stats: 'Stats',
        history: 'History',
        password: 'Password',
        change_password: 'Change Password',
        manage_access: 'Manage Access',
      },
      page: {
        delete: 'Delete Customer',
      },
      errors: {
        password_mismatch:
          'The password confirmation is not the same as the password.',
      },
    },
    suppliers: {
      name: 'Supplier |||| Suppliers',
      fields: {
        commands: 'Orders',
        first_seen: 'First seen',
        groups: 'Segments',
        last_seen: 'Last seen',
        last_seen__gte: 'Visited Since',
        name: 'Name',
        total_spent: 'Total spent',
        payables: 'Payables',
        password: 'Password',
        confirm_password: 'Confirm Password',
        state: 'State',
        product_set: 'Products',
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
        avatar: 'Avatar',
        identity: 'Identity',
        address: 'Address',
        stats: 'Stats',
        other_details: 'Other Details',
        history: 'History',
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
    },
    products: {
      name: 'Product |||| Products',
      fields: {
        category: 'Category',
        height__gte: 'Min height',
        height__lte: 'Max height',
        height: 'Height',
        image: 'Image',
        price: 'Price',
        reference: 'Reference',
        sales: 'Sales',
        stock__lte: 'Low Stock',
        stock: 'Stock',
        thumbnail: 'Thumbnail',
        width__gte: 'Min width',
        width__lte: 'Max width',
        width: 'Width',
        unit_price: 'Unit Price',
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
    },
    invoices: {
      name: 'Invoice |||| Invoices',
      fields: {
        date: 'Date',
        customer: 'Customer',
        date__gte: 'Passed Since',
        date__lte: 'Passed Before',
        total__gte: 'Min amount',
        address: 'Address',
        sales_order: 'Order',
        grand_total: 'Total',
        // command_id: 'Order',
      },
    },
    sales_orders: {
      name: 'Sales Order |||| Sales Orders',
      fields: {
        date: 'Date',
        customer: 'Customer',
        command_id: 'Order',
        date__gte: 'Passed Since',
        date__lte: 'Passed Before',
        total__gte: 'Min amount',
        address: 'Address',
        invoice: 'Invoice',
        grand_total: 'Total',
      },
    },
    receives: {
      name: 'Receive |||| Receives',
      fields: {
        date: 'Date',
        supplier: 'Supplier',
        command_id: 'Order',
        date__gte: 'Passed Since',
        date__lte: 'Passed Before',
        total__gte: 'Min amount',
        address: 'Address',
        purchase_order: 'Order',
        grand_total: 'Total',
      },
    },
    purchase_orders: {
      name: 'Purchase Order |||| Purchase Orders',
      fields: {
        date: 'Date',
        supplier: 'Supplier',
        command_id: 'Order',
        date__gte: 'Passed Since',
        date__lte: 'Passed Before',
        total__gte: 'Min amount',
        address: 'Address',
        receive: 'Receive',
        grand_total: 'Total',
      },
    },
    categories: {
      name: 'Category |||| Categories',
      fields: {
        products: 'Products',
      },
    },
    departments: {
      name: 'Department |||| Departments',
      fields: {
        user_set: 'Employees',
      },
    },
    roles: {
      name: 'Role |||| Roles',
      fields: {
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
