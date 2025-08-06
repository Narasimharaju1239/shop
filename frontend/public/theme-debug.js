// Theme Debug Helper
// Add this to your browser console to debug theme issues

function debugThemes() {
  console.log('=== THEME DEBUG HELPER ===');
  
  // Show all theme-related localStorage keys
  const allKeys = Object.keys(localStorage);
  const themeKeys = allKeys.filter(key => key.startsWith('theme_'));
  
  console.log('All localStorage keys:', allKeys);
  console.log('Theme keys found:', themeKeys);
  
  themeKeys.forEach(key => {
    console.log(`${key}: ${localStorage.getItem(key)}`);
  });
  
  // Show current user
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  console.log('Current user:', user);
  
  if (user) {
    const expectedKey = `theme_${user._id || user.id}`;
    console.log('Expected theme key for this user:', expectedKey);
    console.log('Theme value for this user:', localStorage.getItem(expectedKey));
  } else {
    console.log('No user logged in, should use theme_guest');
    console.log('Guest theme value:', localStorage.getItem('theme_guest'));
  }
}

// Test function to simulate different users
function testUserThemes() {
  console.log('=== TESTING USER THEMES ===');
  
  // Create test scenarios
  const testUsers = [
    { _id: 'user1', name: 'Alice' },
    { _id: 'user2', name: 'Bob' },
    { _id: 'user3', name: 'Charlie' }
  ];
  
  testUsers.forEach((user, index) => {
    const themeKey = `theme_${user._id}`;
    const theme = index % 2 === 0 ? 'dark' : 'light';
    localStorage.setItem(themeKey, theme);
    console.log(`Set ${user.name} (${user._id}) theme to: ${theme}`);
  });
  
  console.log('Test themes created. Use debugThemes() to see all keys.');
}

// Clear all theme data
function clearAllThemes() {
  const themeKeys = Object.keys(localStorage).filter(key => key.startsWith('theme_'));
  themeKeys.forEach(key => localStorage.removeItem(key));
  console.log('Cleared all theme data:', themeKeys);
}

// Instructions
console.log('Theme Debug Helper loaded!');
console.log('Available functions:');
console.log('- debugThemes() - Show all theme data');
console.log('- testUserThemes() - Create test theme data');
console.log('- clearAllThemes() - Clear all theme data');
