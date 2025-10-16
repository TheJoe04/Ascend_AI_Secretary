# Test Checklist - Day 1 Checkpoint

## ✅ Authentication & Database Setup
- [ ] PostgreSQL database running
- [ ] Environment variables configured
- [ ] Database migration completed: `npx prisma migrate dev --name init`
- [ ] Demo data seeded: `npm run db:seed`

## ✅ Login & Authentication
- [ ] Login page loads at `/login`
- [ ] Can login with demo credentials:
  - Email: `demo@ascendai.com`
  - Password: `Demo2024!`
- [ ] Redirects to `/dashboard` after successful login
- [ ] Shows error message for invalid credentials
- [ ] Loading state works during login

## ✅ Route Protection
- [ ] Cannot access `/dashboard` without login (redirects to `/login`)
- [ ] Cannot access `/calls` without login
- [ ] Cannot access `/leads` without login
- [ ] Cannot access `/messages` without login
- [ ] Cannot access `/settings` without login
- [ ] API routes return 401 without authentication

## ✅ Calls API & Data
- [ ] Dashboard loads after login
- [ ] Calls page shows real data from database
- [ ] Search functionality works (try searching for "John" or "Smith")
- [ ] Status filter works (try filtering by "answered" or "missed")
- [ ] Sentiment filter works (try filtering by "positive" or "negative")
- [ ] Pagination works (if more than 10 calls)
- [ ] Call details modal opens and shows transcript
- [ ] Data is properly scoped to organization (multi-tenant)

## ✅ Error Handling
- [ ] API returns 401 for unauthenticated requests
- [ ] API returns 500 for server errors (check console)
- [ ] Frontend shows loading states
- [ ] Frontend shows error messages appropriately
- [ ] No console errors in browser

## 🎯 Demo Data Verification
- [ ] 8 demo calls visible in calls page
- [ ] Mix of statuses: answered, missed, voicemail
- [ ] Mix of sentiments: positive, neutral, negative
- [ ] Realistic timestamps (last 7 days)
- [ ] Transcripts visible for answered calls
- [ ] Tags and notes displayed correctly

## 📱 UI/UX
- [ ] All pages load without errors
- [ ] Responsive design works on different screen sizes
- [ ] Dark/light mode toggle works
- [ ] Navigation between pages works
- [ ] Loading spinners appear during data fetching

## 🔧 Technical
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Build completes successfully: `npm run build`
- [ ] Development server runs without errors: `npm run dev`

---

## 🚨 Common Issues & Solutions

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env` file
- Run `npx prisma generate` if schema changes

### Authentication Issues
- Clear browser cookies/localStorage
- Check NEXTAUTH_SECRET is set
- Verify session provider is wrapped around app

### API Issues
- Check browser Network tab for failed requests
- Verify middleware is protecting routes
- Check server console for error logs

### Data Issues
- Run `npm run db:seed` to reset demo data
- Check database with `npx prisma studio`
- Verify organizationId is being passed correctly

---

**Status**: ⏳ Ready for testing
**Next**: Complete all checklist items before moving to Day 2
