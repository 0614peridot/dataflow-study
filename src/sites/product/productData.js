// Fictional product content. Facts shared with the AI chat (price, CSV import, CRM connection,
// manual mapping, no automatic cleanup) must stay consistent with config.js and the PRD.
// Everything else here (plan limits, requirements, stories) is invented for the study.

export const USE_CASES = [
  {
    tab: 'Weekly sales review',
    summary:
      'Replace the weekly copy-and-paste between your sales spreadsheet, CRM and billing export with one dashboard the whole team reviews.',
    inputs: [
      { name: 'Sales pipeline spreadsheet', detail: 'CSV · updated by the sales team each week' },
      { name: 'CRM customer records', detail: 'Accounts, regions and owners' },
      { name: 'Monthly billing export', detail: 'CSV · invoices and amounts' },
    ],
    steps: [
      'Upload the pipeline spreadsheet and billing export',
      'Connect your CRM',
      'Map customer names and account IDs across the three sources',
      'Build the dashboard and set a weekly refresh',
    ],
    manual:
      'matching customer names and IDs between the spreadsheet, billing export and CRM, and fixing any names that are spelled differently.',
    outputTitle: 'Weekly sales dashboard',
    outputs: ['Revenue by month and by region', 'Top customers this quarter', 'Deals expected to close this month'],
  },
  {
    tab: 'Customer health check',
    summary:
      'See which customers are spending less or opening more support requests, using data your team already keeps.',
    inputs: [
      { name: 'CRM customer records', detail: 'Accounts and contract dates' },
      { name: 'Support request log', detail: 'CSV · exported from your help desk' },
      { name: 'Monthly billing export', detail: 'CSV · invoices and amounts' },
    ],
    steps: [
      'Connect your CRM',
      'Upload the support log and billing export',
      'Map account IDs across all three sources',
      'Build a customer health view and refresh it daily',
    ],
    manual:
      'lining up account IDs between the support log and the CRM. If your help desk uses different customer names, you fix those yourself.',
    outputTitle: 'Customer health dashboard',
    outputs: [
      'Customers with declining monthly spend',
      'Open support requests by customer',
      'Contracts renewing in the next 60 days',
    ],
  },
  {
    tab: 'Team target tracking',
    summary: 'Track each salesperson’s progress against their targets without rebuilding a spreadsheet every month.',
    inputs: [
      { name: 'Targets spreadsheet', detail: 'CSV · monthly target per salesperson' },
      { name: 'CRM deals', detail: 'Closed deals with owner and amount' },
    ],
    steps: [
      'Upload the targets spreadsheet',
      'Connect your CRM',
      'Map salesperson names between the spreadsheet and CRM owners',
      'Build the progress view and share it with the team',
    ],
    manual:
      'matching salesperson names between the targets sheet and CRM deal owners, for example “Sam Lee” and “Samuel Lee”.',
    outputTitle: 'Target progress dashboard',
    outputs: ['Closed revenue vs target, per person', 'Team total for the month', 'Gap to target with days remaining'],
  },
];

export const FEATURES = [
  {
    title: 'Data integration',
    icon: 'M10 16h12M18 12l4 4-4 4',
    desc: 'Bring spreadsheets and CRM data into one workspace.',
    points: ['Upload CSV spreadsheets', 'Connect your CRM', 'Map fields between sources'],
  },
  {
    title: 'Analytics',
    icon: 'M9 20l4-5 4 3 6-8',
    desc: 'Answer everyday questions about your data without code.',
    points: ['Filter and group by any field', 'Compare periods, regions and segments', 'Combine fields from different sources'],
  },
  {
    title: 'Dashboards',
    icon: 'M11 21v-5M16 21v-9M21 21v-7',
    desc: 'Turn combined tables into charts your team can read at a glance.',
    points: ['Charts, tables and summary tiles', 'Scheduled data refreshes', 'Unlimited dashboards'],
  },
  {
    title: 'Collaboration',
    icon: 'M12 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM20 14a3 3 0 1 0 0-6M7 23c0-3 2.5-5 5-5s5 2 5 5M18 18c2.5 0 5 2 5 5',
    desc: 'Keep everyone looking at the same numbers.',
    points: ['Share dashboards with workspace members', 'Set who can view or edit', 'One shared source instead of many files'],
  },
];

export const STORIES = [
  {
    company: 'Harbor Bikes',
    profile: 'Bike retailer · 3 stores · 9 people',
    sources: 'store sales exports (CSV), CRM, inventory spreadsheet',
    worked:
      'One weekly sales dashboard replaced three separate spreadsheets, and store managers stopped emailing numbers to the owner.',
    planFor:
      'Mapping store codes between the sales exports and the CRM took most of the first week. Product names were inconsistent across stores and had to be cleaned in the source spreadsheets.',
  },
  {
    company: 'Cedar Studio',
    profile: 'Design agency · 14 people',
    sources: 'project tracker spreadsheet, CRM, invoice export (CSV)',
    worked:
      'The partners got a client profitability view they review every month, built from data the team was already keeping.',
    planFor:
      'Because pricing is per user, they gave seats to 6 people rather than all 14. Everyone else sees the numbers in the monthly meeting.',
  },
  {
    company: 'Fern Outdoor Co.',
    profile: 'Online outdoor gear shop · 5 people',
    sources: 'store order exports (CSV), CRM, ad spend spreadsheet',
    worked: 'They can see revenue by sales channel each week and compare it with ad spend in one place.',
    planFor:
      'During seasonal sales they wanted updates more than once a day, but the Team plan refreshes daily. They are weighing whether that is worth moving to Business.',
  },
];

export const DEMO_ROWS = [
  ['SO-1041', 'Jul', 'North', 'Maple Dental', 1200],
  ['SO-1042', 'Jul', 'West', 'Harbor Bikes', 3400],
  ['SO-1043', 'Jul', 'South', 'Cedar Bakery', 900],
  ['SO-1044', 'Aug', 'North', 'Pine & Co. Legal', 3100],
  ['SO-1045', 'Aug', 'West', 'Harbor Bikes', 650],
  ['SO-1046', 'Aug', 'South', 'Lark Fitness', 2800],
  ['SO-1047', 'Sep', 'North', 'Birch Vet Clinic', 1100],
  ['SO-1048', 'Sep', 'West', 'Tidewater Tours', 3600],
  ['SO-1049', 'Sep', 'South', 'Cedar Bakery Inc.', 2400],
  ['SO-1050', 'Oct', 'North', 'Maple Dental', 3300],
  ['SO-1051', 'Oct', 'West', 'Fern Studio', 1000],
  ['SO-1052', 'Oct', 'South', 'Lark Fitness', 2900],
].map(([id, month, region, customer, revenue]) => ({ id, month, region, customer, revenue }));

export const DEMO_MONTHS = ['Jul', 'Aug', 'Sep', 'Oct'];

export const DEMO_MAPPINGS = [
  { id: 'cust', from: 'sales_pipeline.csv · Customer', to: 'CRM · Account name' },
  { id: 'reg', from: 'sales_pipeline.csv · Region', to: 'CRM · Territory' },
  { id: 'bill', from: 'billing_export.csv · Client ID', to: 'CRM · Account ID' },
];

export const DEMO_SOURCES = [
  { name: 'sales_pipeline.csv', detail: '12 rows · order, month, region, customer, revenue' },
  { name: 'CRM accounts', detail: '11 accounts · name, territory, account ID' },
  { name: 'billing_export.csv', detail: '12 rows · client ID, invoice month, amount' },
];
