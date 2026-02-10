// Shared categories list for the application
export const CATEGORIES = [
    'Automotive',
    'Education & Training',
    'Electronics & Technology',
    'Entertainment',
    'Fashion & Accessories',
    'Food & Dining',
    'Health & Beauty',
    'Home & Garden',
    'Professional Services',
    'Real Estate',
    'Shopping & Retail',
    'Sports & Fitness',
    'Travel & Hotels',
  ];
  
  // Helper to validate category
  export function isValidCategory(category) {
    return CATEGORIES.includes(category);
  }
  
  // Helper to get category display name
  export function getCategoryDisplayName(category) {
    return category || 'Uncategorized';
  }