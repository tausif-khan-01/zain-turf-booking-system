# Expenses Management Documentation

## Overview
The Expenses Management system allows tracking and managing all business expenses, including Razorpay payment fees, maintenance costs, utilities, and salaries. This documentation covers the API endpoints, data structures, and implementation details.

## Table of Contents
1. [Data Structures](#data-structures)
2. [API Endpoints](#api-endpoints)
3. [Frontend Implementation](#frontend-implementation)
4. [Error Handling](#error-handling)
5. [Examples](#examples)

## Data Structures

### Expense Model
```typescript
interface Expense {
  expenseId: string;      // Unique expense ID (EXP-{timestamp})
  amount: number;         // Expense amount
  category: string;       // Expense category
  description: string;    // Expense description
  vendor: string;         // Vendor name
  paymentMethod: string;  // Payment method used
  status: "Paid" | "Pending" | "Failed";  // Payment status
  relatedTransaction: string;  // Reference to transaction record
  createdAt: string;      // Creation timestamp
  updatedAt: string;      // Last update timestamp
}

interface Transaction {
  txnId: string;          // Unique transaction ID (TRX-{timestamp})
  amount: number;         // Transaction amount
  type: "income" | "expense";  // Transaction type
  category: string;       // Transaction category
  description: string;    // Transaction description
  paymentMethod: string;  // Payment method used
  status: "Paid" | "Pending" | "Failed";  // Payment status
  vendor: string;         // Vendor name
  razorpayDetails?: {     // Razorpay specific details
    orderId?: string;
    paymentId?: string;
    feePayedBy?: "business" | "customer";
  };
  createdAt: string;      // Creation timestamp
  updatedAt: string;      // Last update timestamp
}
```

### Expense Categories
- `RazorpayFee`: Payment gateway fees
- `Maintenance`: Turf maintenance costs
- `Utility`: Utility bills (electricity, water, etc.)
- `Salary`: Staff salary payments

### Payment Methods
- `Razorpay`: Online payment gateway
- `Cash`: Cash payments
- `BankTransfer`: Direct bank transfers

## API Endpoints

### Expense Routes

All expense routes are prefixed with `/api/expenses` and require authentication.

#### 1. Get Expense Summary
```http
GET /api/expenses/summary
```

##### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| period | string | Time period (default: "month") |

##### Response
```json
{
  "status": "success",
  "data": {
    "totalExpenses": 50000,
    "categories": {
      "razorpayfee": 10000,
      "maintenance": 20000,
      "utility": 15000,
      "salary": 5000
    }
  }
}
```

#### 2. List Expenses
```http
GET /api/expenses
```

##### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |
| category | string | Expense category filter |
| startDate | string | Start date filter (ISO format) |
| endDate | string | End date filter (ISO format) |
| status | string | Payment status filter |
| search | string | Search term (searches expenseId, description, vendor) |

##### Response
```json
{
  "status": "success",
  "data": {
    "expenses": [
      {
        "expenseId": "EXP-123456",
        "amount": 1000,
        "category": "RazorpayFee",
        "description": "Razorpay Fee for Booking - BK-789",
        "vendor": "Razorpay",
        "paymentMethod": "Razorpay",
        "status": "Paid",
        "relatedTransaction": "TRX-789012",
        "createdAt": "2024-03-15T10:30:00Z",
        "updatedAt": "2024-03-15T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "pages": 10
    }
  }
}
```

#### 3. Create Expense
```http
POST /api/expenses
```

##### Request Body
```json
{
  "amount": 1000,
  "category": "RazorpayFee",
  "description": "Razorpay Fee for Booking - BK-789",
  "vendor": "Razorpay",
  "paymentMethod": "Razorpay"
}
```

##### Response
```json
{
  "status": "success",
  "data": {
    "expenseId": "EXP-123456",
    "amount": 1000,
    "category": "RazorpayFee",
    "description": "Razorpay Fee for Booking - BK-789",
    "vendor": "Razorpay",
    "paymentMethod": "Razorpay",
    "status": "Paid",
    "relatedTransaction": "TRX-789012",
    "createdAt": "2024-03-15T10:30:00Z",
    "updatedAt": "2024-03-15T10:30:00Z"
  }
}
```

#### 4. Update Expense Status
```http
PUT /api/expenses/:id/status
```

##### Request Body
```json
{
  "status": "Paid"
}
```

##### Response
```json
{
  "status": "success",
  "data": {
    "expenseId": "EXP-123456",
    "status": "Paid",
    "updatedAt": "2024-03-15T10:30:00Z"
  }
}
```

### Related Routes

#### 1. Get Turf Details
```http
GET /api/expenses/turf
```

##### Response
```json
{
  "status": "success",
  "data": {
    "pricePerHour": 1000,
    "advancePercentage": 50,
    "operatingHours": {
      "start": "06:00",
      "end": "22:00"
    },
    "status": "active"
  }
}
```

#### 2. Update Turf Details
```http
PUT /api/expenses/turf
```

##### Request Body
```json
{
  "pricePerHour": 1200,
  "advancePercentage": 40,
  "operatingHours": {
    "start": "07:00",
    "end": "23:00"
  }
}
```

##### Response
```json
{
  "status": "success",
  "data": {
    "pricePerHour": 1200,
    "advancePercentage": 40,
    "operatingHours": {
      "start": "07:00",
      "end": "23:00"
    },
    "status": "active"
  }
}
```

#### 3. Update Turf Status
```http
PUT /api/expenses/turf/status
```

##### Request Body
```json
{
  "status": "maintenance"
}
```

##### Response
```json
{
  "status": "success",
  "data": {
    "pricePerHour": 1200,
    "advancePercentage": 40,
    "operatingHours": {
      "start": "07:00",
      "end": "23:00"
    },
    "status": "maintenance"
  }
}
```

## Frontend Implementation

### 1. Expense List Component
```typescript
// ExpenseList.tsx
import React, { useState, useEffect } from 'react';
import { Table, Card, DatePicker, Input, Select, Button } from 'antd';

const ExpenseList: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filters, setFilters] = useState<ExpenseFilters>({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const [loading, setLoading] = useState(false);

  // Fetch expenses on filter/pagination change
  useEffect(() => {
    fetchExpenses();
  }, [filters, pagination]);

  return (
    <Card title="Expenses">
      <ExpenseFilters
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      <Table
        columns={columns}
        dataSource={expenses}
        loading={loading}
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: totalExpenses,
          onChange: handlePageChange,
        }}
      />
    </Card>
  );
};
```

### 2. Expense Filters Component
```typescript
// ExpenseFilters.tsx
const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <div className="mb-4 grid grid-cols-4 gap-4">
      <DatePicker.RangePicker
        onChange={(dates) =>
          onFilterChange({
            ...filters,
            startDate: dates?.[0]?.toISOString(),
            endDate: dates?.[1]?.toISOString(),
          })
        }
      />
      <Select
        placeholder="Category"
        allowClear
        onChange={(value) =>
          onFilterChange({ ...filters, category: value })
        }
        options={[
          { label: 'RazorpayFee', value: 'RazorpayFee' },
          { label: 'Maintenance', value: 'Maintenance' },
          { label: 'Utility', value: 'Utility' },
          { label: 'Salary', value: 'Salary' },
        ]}
      />
      <Select
        placeholder="Status"
        allowClear
        onChange={(value) =>
          onFilterChange({ ...filters, status: value })
        }
        options={[
          { label: 'Paid', value: 'Paid' },
          { label: 'Pending', value: 'Pending' },
          { label: 'Failed', value: 'Failed' },
        ]}
      />
      <Input.Search
        placeholder="Search expenses..."
        onSearch={(value) =>
          onFilterChange({ ...filters, search: value })
        }
      />
    </div>
  );
};
```

## Error Handling

### Common Error Responses
```json
{
  "status": "error",
  "message": "Error message description"
}
```

### Error Codes
| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Expense not found |
| 500 | Internal Server Error |

## Examples

### 1. Fetching Expenses
```typescript
const fetchExpenses = async (
  filters: ExpenseFilters,
  pagination: PaginationParams
) => {
  try {
    const queryParams = new URLSearchParams({
      ...filters,
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
    });

    const response = await axios.get(`/api/expenses?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
};
```

### 2. Creating an Expense
```typescript
const createExpense = async (expenseData: CreateExpenseData) => {
  try {
    const response = await axios.post('/api/expenses', expenseData);
    return response.data;
  } catch (error) {
    console.error('Error creating expense:', error);
    throw error;
  }
};
```

### 3. Updating Expense Status
```typescript
const updateExpenseStatus = async (expenseId: string, status: string) => {
  try {
    const response = await axios.patch(`/api/expenses/${expenseId}/status`, {
      status,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating expense status:', error);
    throw error;
  }
};
```

## Best Practices

1. **Data Validation**
   - Always validate expense data before submission
   - Use proper type checking for amounts and dates
   - Sanitize user inputs to prevent injection attacks

2. **Error Handling**
   - Implement proper error boundaries in React components
   - Show user-friendly error messages
   - Log errors for debugging purposes

3. **Performance**
   - Implement pagination for large datasets
   - Use debouncing for search inputs
   - Cache frequently accessed data

4. **Security**
   - Implement proper authentication
   - Use HTTPS for all API calls
   - Validate user permissions for sensitive operations

5. **User Experience**
   - Provide clear loading states
   - Show meaningful error messages
   - Implement proper form validation
   - Use consistent date and currency formatting

# Dashboard API Documentation

## Overview
The Dashboard API provides real-time statistics and insights about bookings, revenue, customers, and occupancy rates. It supports different time periods (week/month/year) for trend analysis and comparison.

## Base URL
```
/api/dashboard
```

## Authentication
All dashboard endpoints require authentication. Include the authentication token in the request header:
```http
Authorization: Bearer <your_token>
```

## Endpoints

### Get Dashboard Statistics
```http
GET /api/dashboard/stats
```

Fetches comprehensive dashboard statistics including bookings, revenue, customers, occupancy rate, recent bookings, and today's schedule.

#### Query Parameters
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| period | string | Time period for statistics ("week", "month", "year") | "week" |

#### Response Format
```typescript
interface DashboardResponse {
  status: "success";
  data: {
    totalBookings: {
      count: number;        // Total number of bookings in the period
      change: number;       // Percentage change from previous period
    };
    revenue: {
      amount: number;       // Total revenue in the period (in INR)
      change: number;       // Percentage change from previous period
    };
    customers: {
      count: number;        // Number of unique customers
      change: number;       // Percentage change from previous period
    };
    occupancyRate: {
      rate: number;         // Current occupancy rate (0-100)
      change: number;       // Percentage change from previous period
    };
    recentBookings: Array<{
      bookingId: string;    // Unique booking identifier
      customer: {
        name: string;       // Customer name
        phone: string;      // Customer phone number
      };
      date: string;         // Booking date (ISO format)
      startTime: string;    // Start time (HH:mm format)
      duration: number;     // Duration in hours
      amount: number;       // Booking amount
      status: string;       // Booking status
    }>;
    todaySchedule: Array<{
      bookingId: string;    // Unique booking identifier
      customer: {
        name: string;       // Customer name
        phone: string;      // Customer phone number
      };
      date: string;         // Booking date (ISO format)
      startTime: string;    // Start time (HH:mm format)
      duration: number;     // Duration in hours
      amount: number;       // Booking amount
      status: string;       // Booking status
    }>;
  };
}
```

#### Example Response
```json
{
  "status": "success",
  "data": {
    "totalBookings": {
      "count": 128,
      "change": 12
    },
    "revenue": {
      "amount": 76800,
      "change": 8
    },
    "customers": {
      "count": 85,
      "change": 5
    },
    "occupancyRate": {
      "rate": 72,
      "change": -3
    },
    "recentBookings": [
      {
        "bookingId": "BK-123",
        "customer": {
          "name": "John Doe",
          "phone": "+91XXXXXXXXXX"
        },
        "date": "2024-03-15",
        "startTime": "17:00",
        "duration": 1,
        "amount": 1200,
        "status": "confirmed"
      }
    ],
    "todaySchedule": [
      {
        "bookingId": "BK-124",
        "customer": {
          "name": "Team Alpha",
          "phone": "+91XXXXXXXXXX"
        },
        "date": "2024-03-15",
        "startTime": "17:00",
        "duration": 1,
        "amount": 1200,
        "status": "confirmed"
      }
    ]
  }
}
```

#### Error Responses

##### Unauthorized (401)
```json
{
  "status": "error",
  "message": "Please authenticate"
}
```

##### Server Error (500)
```json
{
  "status": "error",
  "message": "Internal Server Error"
}
```

## Statistics Calculation

### Time Periods
- **Week**: Sunday to Saturday of the current week
- **Month**: 1st to last day of the current month
- **Year**: January 1st to December 31st of the current year

### Metrics Calculation
1. **Total Bookings**
   - Count of all bookings in the selected period
   - Percentage change compared to previous period

2. **Revenue**
   - Sum of all income transactions in the period
   - Percentage change compared to previous period

3. **Customers**
   - Count of unique customer phone numbers
   - Percentage change compared to previous period

4. **Occupancy Rate**
   - Calculated as: (Total Bookings / Total Available Slots) × 100
   - Total Available Slots = 14 slots per day × number of days in period
   - Percentage change compared to previous period

## Usage Examples

### Fetch Weekly Statistics
```javascript
const fetchWeeklyStats = async () => {
  const response = await axios.get('/api/dashboard/stats?period=week', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};
```

### Fetch Monthly Statistics
```javascript
const fetchMonthlyStats = async () => {
  const response = await axios.get('/api/dashboard/stats?period=month', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};
```

### Fetch Yearly Statistics
```javascript
const fetchYearlyStats = async () => {
  const response = await axios.get('/api/dashboard/stats?period=year', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};
```

## Best Practices

1. **Caching**
   - Consider caching dashboard responses for 1-5 minutes
   - Implement client-side caching for better performance

2. **Error Handling**
   - Always handle network errors gracefully
   - Implement retry logic for failed requests
   - Show appropriate loading states

3. **Data Refresh**
   - Implement periodic auto-refresh (e.g., every 5 minutes)
   - Provide manual refresh option
   - Show last updated timestamp

4. **Performance**
   - Use appropriate indexes on date fields
   - Consider implementing pagination for large datasets
   - Optimize queries for better response times
