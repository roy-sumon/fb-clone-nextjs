# Facebook Clone (Full-Stack Next.js & Supabase)

A full-stack, fully responsive Facebook web application clone built with **Next.js (App Router)**, **React**, and **Supabase**.

This project started as a static HTML/CSS landing page clone and evolved into a dynamic social media application with real-time posts, comments, authentic Facebook reactions, stories, user profiles, and friend management.

> 📌 **Note:** Looking for the original static HTML/CSS version? It is preserved in the [`old-version`](https://github.com/roy-sumon/fb-clone-using-html-css-only/tree/old-version) branch.

---

## 🚀 Key Features

### 1. Authentic Facebook UI & Responsiveness
- **Desktop (1100px+):** Classic 3-column Facebook layout (Navigation, Main Feed, Contacts/Birthdays).
- **Tablet (900px - 1100px):** 2-column view with feed and primary sidebar.
- **Mobile (< 900px):** Full-width mobile experience with responsive navigation, collapsible search, and touch-friendly stories.
- Official Facebook favicon and meta branding.

### 2. News Feed & Post Creation
- **Create Post Modal:** Text formatting, feeling/activity selector (`blessed`, `happy`, `excited`), and image upload with instant preview.
- **Post Actions Menu:** Copy post link to clipboard, delete own posts.
- **Real-Time Feed:** Feed updates dynamically with fallback sample data so it's interactive immediately out of the box.

### 3. Facebook Reactions & Comments
- **7 Reaction Types:** 👍 Like, ❤️ Love, 🥰 Care, 😆 Haha, 😮 Wow, 😢 Sad, 😡 Angry.
- Floating reaction picker on hover/touch with animations and colored indicators.
- Live reaction counts and reaction icon combinations (e.g. 👍 ❤️ 😆).
- Expandable comment drawer with author avatars, timestamps, and comment deletion.

### 4. Stories & Reels
- Stories carousel with horizontal scrolling.
- **Create Story:** Upload photos directly from your device; persists across page reloads.
- **Story Viewer Modal:** Full-screen story player with animated progress bars, author info, and quick profile visit link.
- Switch between **Stories** and **Reels** tabs.

### 5. Profiles (`/profile/[id]` & `/profile/me`)
- Dedicated profile page for every user and friend.
- **Customization:** Upload and change your Profile Picture and Cover Photo directly with instant preview.
- **Intro & Bio:** Edit your bio and view details (Work, Education, Location, Joined date).
- **Photos & Friends Grids:** View user photos and friend list thumbnails.
- Timeline feed showing posts filtered to that specific profile.

### 6. Friends Hub (`/friends`) & Suggestions
- **People You May Know:** Horizontal suggestion carousel right in the feed + dedicated Friends Hub page.
- **Friend Requests:** Working "Confirm" and "Delete" actions with real-time UI feedback.
- Clickable avatars and names across the entire site that navigate straight to user profiles.

### 7. Floating Messenger Chat
- Mini floating chat window at the bottom right.
- Accessible by clicking any friend in Contacts, Messenger dropdown, or profile.
- Real-time conversation view with simulated instant replies.

### 8. Dropdown Menus & Settings
- **Search Bar:** Real-time search that filters posts by content or author name.
- **Notifications Dropdown:** Displays recent alerts and links directly to relevant profiles.
- **Messenger Dropdown:** Quick access to chat threads.
- **Settings & Privacy Modal:** Change your display name, toggle **Dark Mode**, customize notification sounds, and adjust default post privacy.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Frontend Library:** [React](https://react.dev/)
- **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage, Realtime)
- **Icons:** [FontAwesome 6](https://cdnjs.com/libraries/font-awesome)
- **Styling:** Custom Vanilla CSS (Responsive Flexbox & CSS Grid)

---

## 📦 Project Structure

```text
fb-landingpage-clone/
├── app/
│   ├── layout.jsx            # Root layout with FontAwesome and favicon
│   ├── globals.css           # Global stylesheet and responsive media queries
│   ├── page.jsx              # Main home feed page
│   ├── friends/
│   │   └── page.jsx          # Dedicated Friends Hub page
│   ├── profile/
│   │   ├── page.jsx          # Redirect to current user profile (/profile/me)
│   │   └── [id]/page.jsx     # Dynamic user profile page
│   ├── login/
│   │   └── page.jsx          # Login page
│   └── signup/
│       └── page.jsx          # Registration page
├── components/
│   ├── Navbar.jsx            # Top navigation bar with dropdowns & search
│   ├── LeftSidebar.jsx       # Left navigation shortcuts and shortcuts list
│   ├── RightSidebar.jsx      # Contacts list, friend requests, birthdays
│   ├── CreatePost.jsx        # Post creation modal with feeling tags
│   ├── PostCard.jsx          # Feed post card with 7 reactions & comments
│   ├── StoryReels.jsx        # Stories/Reels carousel and story viewer
│   ├── FriendSuggestions.jsx # "People You May Know" carousel component
│   └── FloatingChat.jsx      # Floating Messenger popup chat box
├── lib/
│   ├── supabaseClient.js     # Supabase client initialization
│   └── mockUsers.js          # Shared user directory & profiles helper
├── public/
│   ├── favicon.ico           # Facebook favicon
│   ├── images/               # Friend photos, post images, emojis, icons
├── static_pages/             # Original static HTML/CSS files archive
├── supabase_schema.sql       # PostgreSQL database schema & RLS policies
└── package.json
```

---

## ⚡ Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or newer recommended)
- `npm` or `yarn`

### 2. Clone the repository
```bash
git clone https://github.com/roy-sumon/fb-clone-using-html-css-only.git
cd fb-clone-using-html-css-only
```

### 3. Install dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-publishable-key
```
*(Reference values are provided in `.env.example`)*

### 5. Setup Database (Supabase)
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) and open your project.
2. Navigate to **SQL Editor** (`>_`).
3. Copy the contents of [`supabase_schema.sql`](./supabase_schema.sql) and paste it into the editor.
4. Click **Run** to set up tables (`profiles`, `posts`, `likes`, `comments`), triggers, and storage buckets.

### 6. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🌿 Branches

- **`main`**: Full-stack Next.js + Supabase dynamic application.
- **`old-version`**: Original static HTML and CSS version.

---

## 📄 License

This project is open-source and available under the [ISC License](LICENSE).
