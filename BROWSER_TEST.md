# Browser Test Script

Open your browser console (F12 or Cmd+Option+I) on https://happygotchadays.bill-burkey.workers.dev and paste these commands to test functionality:

## Quick Test - All API Endpoints

```javascript
// Test 1: Health Check
fetch('/health')
  .then(r => r.json())
  .then(d => console.log('✅ Health:', d));

// Test 2: Register New User
fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: `test${Date.now()}@example.com`,
    username: `user${Date.now()}`,
    password: 'password123'
  })
})
.then(r => r.json())
.then(d => {
  console.log('✅ Registration:', d);
  window.testToken = d.token;
  window.testUser = d.user;
  return d;
});

// Wait 1 second, then test 3: Verify Token
setTimeout(() => {
  fetch('/api/auth/verify', {
    headers: { 'Authorization': `Bearer ${window.testToken}` }
  })
  .then(r => r.json())
  .then(d => console.log('✅ Token Verify:', d));
}, 1000);

// Wait 2 seconds, then test 4: Create Pet Profile
setTimeout(() => {
  fetch('/api/pets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${window.testToken}`
    },
    body: JSON.stringify({
      name: 'Max',
      species: 'dog',
      breed: 'Golden Retriever',
      gotchaDate: '2020-03-15',
      adoptionStory: 'Found him at the local shelter and it was love at first sight!',
      isPublic: true
    })
  })
  .then(r => r.json())
  .then(d => {
    console.log('✅ Pet Created:', d);
    window.testPet = d.pet;
  });
}, 2000);

// Wait 3 seconds, then test 5: Create Post
setTimeout(() => {
  fetch('/api/social/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${window.testToken}`
    },
    body: JSON.stringify({
      petId: window.testPet.id,
      content: `Happy 5th Gotcha Day to my best friend Max! 🎉🐕`,
      anniversaryYear: 5
    })
  })
  .then(r => r.json())
  .then(d => {
    console.log('✅ Post Created:', d);
    window.testPost = d.post;
  });
}, 3000);

// Wait 4 seconds, then test 6: Get Feed
setTimeout(() => {
  fetch('/api/social/feed', {
    headers: { 'Authorization': `Bearer ${window.testToken}` }
  })
  .then(r => r.json())
  .then(d => console.log('✅ Feed:', d));
}, 4000);

// Wait 5 seconds, then test 7: Search
setTimeout(() => {
  fetch('/api/search?q=Max&type=pets')
  .then(r => r.json())
  .then(d => console.log('✅ Search Results:', d));
}, 5000);

// Final Summary
setTimeout(() => {
  console.log('\n🎉 ALL TESTS COMPLETE!\n');
  console.log('Test Data Created:');
  console.log('- User:', window.testUser);
  console.log('- Pet:', window.testPet);
  console.log('- Post:', window.testPost);
}, 6000);
```

## Expected Console Output

You should see something like:

```
✅ Health: {status: "healthy", timestamp: 1759712296}
✅ Registration: {user: {...}, token: "eyJ..."}
✅ Token Verify: {user: {...}}
✅ Pet Created: {pet: {id: "...", name: "Max", ...}}
✅ Post Created: {post: {id: "...", content: "Happy 5th...", ...}}
✅ Feed: {posts: [{...}]}
✅ Search Results: {pets: [{name: "Max", ...}]}

🎉 ALL TESTS COMPLETE!
```

---

## Manual UI Testing

### Test the UI Elements:

1. **Click "Sign Up" button** - Modal should appear
2. **Fill form and submit** - Should create account
3. **Click "Login" button** - Modal should appear
4. **Submit login** - Should authenticate
5. **Check navigation** - Should show "My Pets", "Profile", "Logout"
6. **Click sections** - Should scroll smoothly
7. **Try search box** - Should search (may show no results if DB empty)

---

## Troubleshooting

### If modals don't appear:
- Check browser console for errors
- Verify CSS loaded: `document.querySelector('.modal')` should return null when no modal open
- Check JavaScript loaded: `typeof showLoginModal` should be "function"

### If API calls fail:
- Check network tab in browser dev tools
- Verify URL is correct
- Check for CORS errors
- Ensure you're on the correct domain

### If you see "Loading..." forever:
- Check browser console for API errors
- Empty database will show "No celebrations" etc. (this is normal!)
- Create data using the test script above

---

## Quick Visual Check

After running the test script, refresh the page. You should now see:

✅ **"Discover Rescue Pets"** - Should show Max the Golden Retriever
✅ **"Gotcha Day Celebrations"** - Should show the post about Max's 5th anniversary
✅ **"Upcoming Gotcha Days"** - Should show Max's upcoming anniversary

This proves the full stack is working: Frontend → API → Database → Frontend!
