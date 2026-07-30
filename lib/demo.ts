export const MOCK_USER = {
  id: "demo-user-id",
  email: "demo@finnova.com",
  user_metadata: {
    first_name: "Demo User",
  },
}

export const MOCK_PROFILE = {
  id: "demo-user-id",
  first_name: "Demo",
  last_name: "User",
  email: "demo@finnova.com",
  user_type: "personal",
  kyc_status: "verified",
}

export const MOCK_ACCOUNTS = [
  {
    id: "acc_1",
    name: "Checking Account",
    account_type: "checking",
    balance: 12450.8,
    account_number: "****4321",
    created_at: new Date().toISOString(),
  },
  {
    id: "acc_2",
    name: "Savings Vault",
    account_type: "savings",
    balance: 34200.5,
    account_number: "****8765",
    created_at: new Date().toISOString(),
  },
  {
    id: "acc_3",
    name: "Investment Portfolio",
    account_type: "investment",
    balance: 18900.0,
    account_number: "****9912",
    created_at: new Date().toISOString(),
  },
]

export const MOCK_TRANSACTIONS = [
  {
    id: "tx_1",
    description: "Salary Deposit",
    amount: 4500.0,
    transaction_type: "income",
    category: "Salary",
    transaction_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    merchant: "Tech Corp Inc",
  },
  {
    id: "tx_2",
    description: "Whole Foods Market",
    amount: 154.2,
    transaction_type: "expense",
    category: "Food & Dining",
    transaction_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    merchant: "Whole Foods",
  },
  {
    id: "tx_3",
    description: "Electric & Utility Bill",
    amount: 89.5,
    transaction_type: "expense",
    category: "Utilities",
    transaction_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    merchant: "City Power Co",
  },
  {
    id: "tx_4",
    description: "Monthly Gym Membership",
    amount: 55.0,
    transaction_type: "expense",
    category: "Health & Fitness",
    transaction_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    merchant: "Fitness Club",
  },
  {
    id: "tx_5",
    description: "Freelance Project Payment",
    amount: 1200.0,
    transaction_type: "income",
    category: "Freelance",
    transaction_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    merchant: "Design Studio",
  },
]

export const MOCK_LOANS = [
  {
    id: "loan_1",
    loan_type: "Personal Loan",
    principal_amount: 5000,
    remaining_amount: 3200,
    status: "active",
    interest_rate: 4.5,
    due_date: "2026-08-15",
    created_at: new Date().toISOString(),
  },
  {
    id: "loan_2",
    loan_type: "Auto Financing",
    principal_amount: 15000,
    remaining_amount: 11500,
    status: "active",
    interest_rate: 3.9,
    due_date: "2026-08-20",
    created_at: new Date().toISOString(),
  },
]

export const MOCK_BUDGETS = [
  {
    id: "b_1",
    category: "Food & Dining",
    amount_limit: 600,
    spent: 340,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "b_2",
    category: "Entertainment",
    amount_limit: 200,
    spent: 120,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "b_3",
    category: "Utilities & Bills",
    amount_limit: 400,
    spent: 289.5,
    is_active: true,
    created_at: new Date().toISOString(),
  },
]

export function isDemoMode() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  return !supabaseUrl || supabaseUrl.includes("placeholder")
}
