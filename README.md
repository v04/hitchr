# smileback

Hitchr App: Developer's Manual
1. Introduction
Welcome to the Hitchr project. This document serves as a guide for developers, detailing the current state of the application, implemented features, and future development areas. Hitchr is a community-driven carpooling application built on the Base44 platform, designed to foster sustainable travel and social connections through gamification.

2. Base44 Development Model Explained
Hitchr is built on Base44, which significantly simplifies backend development. As a developer, you primarily focus on the frontend (React components, UI/UX) and defining your application's data structure (entities).

Key Base44 Backend Abstractions:

Automated Backend APIs: For every entity you define (e.g., Ride.json, User.json), Base44 automatically generates a full suite of RESTful API endpoints. This means you do not write any server-side code for CRUD (Create, Read, Update, Delete) operations on your data.
Entity SDK: You interact with these auto-generated APIs directly from your React components using the Base44 Entity SDK (e.g., User.me(), Story.create(), Reward.update()). This SDK handles all HTTP requests, data serialization, and error handling.
Managed Integrations: For common external services (e.g., file storage, AI models, email), Base44 provides pre-built integrations. You use these through a simple function call in your frontend (e.g., UploadFile()), and Base44 handles the underlying API calls and service management.
Infrastructure Management: Base44 manages databases, servers, scaling, security, and authentication, allowing developers to concentrate on product features.
What this means for you: Your primary development effort will be in entities/, pages/, components/, and Layout.js.

3. Project Structure
The application follows a standard React project structure, leveraging Base44's conventions:

entities/: Contains JSON Schema definitions for all data models (e.g., User.json, Ride.json).
pages/: React components representing individual screens of the application (e.g., Dashboard.js, Map.js).
components/: Reusable React components used across pages (e.g., StatsGrid.js, StoryForm.js).
Layout.js: The main application layout component, including navigation and global styling.
utils.js: Utility functions (e.g., createPageUrl).
integrations/Core.js: Wrapper for Base44's built-in integrations.
4. Entities Overview
These JSON files define the data models used throughout the application. Base44 automatically generates APIs for each.

User.json: Extends the built-in Base44 User entity with app-specific attributes like display_name, tokens, badges, rto_collection, completed_trails, active_quests, redeemed_rewards, co2_saved, location, bio, avatar_url, etc.
Ride.json: Represents a carpooling ride, including pilot_id, rider_id, pickup_location, destination, status, distance_km, tokens_earned, and ratings.
Story.json: Defines a user-generated story about a ride, with ride_id, author_id, title, content, image_url, likes, and tags.
Reward.json: Details items available for token redemption in the Rewards Store, including name, token_cost, image_url, and stock_available.
RTOPlate.json: Represents an RTO license plate for the "RTO Hunt" gamification feature, with code, state, region, rarity, bonus_tokens, and discovered_by.
Quest.json: Defines challenges or quests users can undertake, specifying title, description, type, requirements, rewards, and participants.
HitchTrail.json: Defines specific scenic or cultural routes for users to complete, with name, category, route_points, token_reward, and special_badge unlocks.
Badge.json: Defines collectible achievements, specifying name, title, description, category, icon, rarity, requirements for unlocking, and reward_tokens.
5. Implemented Features (Done)
This section details the features that are fully functional from a frontend and Base44 backend interaction perspective.

5.1. User Authentication & Profile Management
Description: Users can view and update their profile information, including display name, bio, and avatar. User authentication (login/logout) is handled automatically by Base44.
Frontend Flow:
Profile View: Profile.js fetches current user data.
Editing Profile: Profile.js allows users to toggle an edit mode for display_name and bio.
Avatar Upload: AvatarUpload.jsx component allows users to select and upload a new profile picture.
Backend Flow (Base44 Services Used):
User.me(): Fetches the currently authenticated user's data.
User.updateMyUserData(data): Updates the current user's profile fields.
UploadFile({file: file}): Integration used by AvatarUpload to store the image file and return its URL.
Key Files: pages/Profile.js, components/profile/AvatarUpload.jsx, entities/User.json.
5.2. Dashboard & Quick Stats
Description: Provides an overview of the user's key metrics (tokens, rides, streak, trust score) and quick navigation actions. Users can also toggle their role between 'Rider' and 'Pilot'.
Frontend Flow:
Dashboard.js displays various stats and quick action buttons.
StatsGrid.jsx visualizes the main user metrics.
RoleToggle.jsx allows switching between 'rider' and 'pilot' roles.
QuickActions.jsx provides navigation links to other app sections.
RecentActivity.jsx shows a list of the user's recent rides.
Backend Flow (Base44 Services Used):
User.me(): Fetches user stats.
User.updateMyUserData({current_role: newRole}): Updates the user's active role.
Ride.filter({$or: [{pilot_id: user.id}, {rider_id: user.id}]}, ...) : Fetches recent ride data associated with the user.
Key Files: pages/Dashboard.js, components/dashboard/StatsGrid.jsx, components/dashboard/RoleToggle.jsx, components/dashboard/QuickActions.jsx, components/dashboard/RecentActivity.jsx, entities/User.json, entities/Ride.json.
5.3. Rewards Store & Redemption
Description: Users can browse various rewards categorized by type (food, travel, clothing, gear, voucher) and redeem them using their earned tokens.
Frontend Flow:
Rewards.js displays the user's token balance and a grid of available rewards.
Users can filter rewards by category.
"Redeem" button becomes active if the user has enough tokens.
Backend Flow (Base44 Services Used):
User.me(): Fetches the user's current token balance and redeemed_rewards history.
Reward.list(): Fetches all available rewards.
User.updateMyUserData({tokens: newTokens, redeemed_rewards: [...]}): Deducts tokens from the user's balance and records the redemption.
Reward.update(rewardId, {stock_available: newStock}): Decrements the stock of the redeemed reward.
Key Files: pages/Rewards.js, entities/User.json, entities/Reward.json.
5.4. Ride Stories (Creation & Viewing)
Description: Users can create new stories about their rides, including a title, content, image, and tags. They can also view a feed of stories shared by others.
Frontend Flow:
Stories.js displays a feed of recent stories.
"Share Story" button opens StoryForm.jsx.
StoryForm.jsx allows input for title, content, tags, and image upload.
Backend Flow (Base44 Services Used):
Story.list("-created_date"): Fetches stories sorted by creation date.
User.list(): Used to fetch author details for each story.
Story.create(data): Creates a new story record.
UploadFile({file: file}): Integration used by StoryForm to upload story images.
Story.update(storyId, {likes: newLikes}): Updates the like count for a story.
Key Files: pages/Stories.js, components/stories/StoryForm.jsx, entities/Story.json, entities/User.json.
5.5. Leaderboard & User Rankings
Description: Displays user rankings based on various metrics (tokens, rides, trust score, streak), with dynamic accolades.
Frontend Flow:
Leaderboard.js fetches all user data and sorts it based on selected category.
Displays users in a ranked list, with rank icons and dynamic accolades.
Backend Flow (Base44 Services Used):
User.list(): Fetches all user data to populate the leaderboard.
Key Files: pages/Leaderboard.js, entities/User.json.
5.6. Badges & Achievements
Description: A system for users to earn and display achievements based on their activity, with varying rarities and associated titles.
Frontend Flow:
Profile.js displays a section for Recent Achievements.
BadgeGrid.jsx (used in Profile.js) shows all available badges, highlighting which ones the user has earned.
BadgeDisplay.jsx renders individual badge visuals based on rarity and earned status.
Backend Flow (Base44 Services Used):
Badge.list(): Fetches all defined badges.
User.me(): Provides the current user's stats (e.g., total_rides, tokens, rto_collection) to determine if badge requirements are met.
Note: The logic for checking if a badge is earned is currently client-side in isBadgeEarned function in BadgeGrid.jsx. The User.badges array is assumed to be updated externally if the user earns a badge for the purpose of this manual.
Key Files: entities/Badge.json, components/badges/BadgeGrid.jsx, components/badges/BadgeDisplay.jsx, pages/Profile.js.
5.7. RTO Plate Hunt (Collection Viewing)
Description: Users can view a collection of RTO license plates, track their discovery progress, and see rarity.
Frontend Flow:
RTOHunt.js displays overall collection stats and a grid of RTO plates.
Users can filter plates by rarity.
Collected plates are highlighted.
Backend Flow (Base44 Services Used):
RTOPlate.list("-discovery_count"): Fetches all RTO plate data.
User.me(): Provides the current user's rto_collection to mark collected plates.
Key Files: pages/RTOHunt.js, entities/RTOPlate.json, entities/User.json.
5.8. Quests & Challenges
Description: Users can browse various quests (individual, community, trail, event), see their requirements and rewards, and track their progress.
Frontend Flow:
Quests.js displays an overview of active quests and a grid of available quests.
Users can filter quests by type.
Progress bars visually represent user progress towards quest completion.
Backend Flow (Base44 Services Used):
Quest.list(): Fetches all defined quests.
User.me(): Provides the current user's stats (e.g., total_rides, distance_traveled, current_streak) and active_quests to calculate progress and join status.
Note: The "Join Quest" functionality is currently frontend-only. The actual addition of a user to quest.participants and persistence is not yet wired up.
Key Files: pages/Quests.js, entities/Quest.json, entities/User.json.
5.9. HITCH Trails
Description: Users can discover and explore pre-defined scenic or cultural routes.
Frontend Flow:
Trails.js displays a grid of available trails with details like distance, duration, and difficulty.
Completed trails are marked.
Displays special badges unlocked by completing certain trails.
Backend Flow (Base44 Services Used):
HitchTrail.list(): Fetches all defined trails.
User.me(): Provides the current user's completed_trails to mark completion status.
Key Files: pages/Trails.js, entities/HitchTrail.json, entities/User.json.
6. Partially Implemented / Mocked Features
These features have a frontend presence but require further backend logic or external integrations to be fully functional or dynamic.

6.1. Core Ride-Sharing System (Map Page)
Description: The "Map" page is intended for pilots to offer rides and riders to find them.
Frontend State: Displays a mock map with placeholder user markers. The "Offer a Ride" and "Find a Ride" buttons lead to the Map page but do not initiate any ride creation/finding flow.
Backend State (What's Missing/Mocked):
Actual Map Integration: No integration with real mapping services (e.g., Google Maps API, Mapbox) for interactive maps, routing, or real-time location tracking.
Ride Request/Offer Logic: The complex backend logic for pilots to define routes/timings and for riders to search/request rides, including matching algorithms, negotiation, and acceptance flows, is missing.
Real-time Updates: No real-time backend updates for vehicle locations or ride status.
User Location Data: User.location (latitude/longitude) is defined but not dynamically captured from the device or used for proximity matching.
6.2. Token Economy (Dynamic Earning & Breakdown)
Description: Users earn tokens from various activities.
Frontend State:
The TokenEarner.jsx component in Dashboard.js simulates earning tokens for different activities (e.g., "Complete Ride", "Eco Ride").
User.token_breakdown is defined (travel, eco, social, quest tokens).
Backend State (What's Missing/Mocked):
Automated Token Earning: The actual logic to automatically award tokens based on completed rides, eco-rides, social shares, or quest completions is not in place. The TokenEarner is purely for demo.
Categorized Token Updates: The User.token_breakdown is updated by the TokenEarner but not tied to actual ride completion or specific quest types.
6.3. RTO Plate Hunt (Discovery Mechanism)
Description: Users "collect" RTO plates found during their rides.
Frontend State: The RTOHunt.js page lists all possible RTO plates and marks which ones the current user has in their rto_collection.
Backend State (What's Missing/Mocked):
Plate Detection/Recognition: The core mechanism to automatically detect RTO plates from user input (e.g., image recognition from a camera feed during a ride) or external data sources is completely absent.
Automated Collection: The backend logic to automatically add a discovered plate to a user's rto_collection and award bonus_tokens is not implemented.
6.4. Quest Participation & Progress
Description: Users join quests and track their progress.
Frontend State: Quests.js displays quests, calculates a progress percentage for individual quests based on current user stats, and shows a "Join Quest" button.
Backend State (What's Missing/Mocked):
Joining Quests: The "Join Quest" button in Quests.js currently only updates the currentUser.active_quests array client-side. There is no backend logic to persist a user's participation in a quest (i.e., add their user.id to quest.participants) or trigger any server-side quest-specific actions.
Persistent Progress Tracking: While getUserProgress calculates progress client-side, the backend doesn't actively track or aggregate user activities specifically for quest requirements. This means progress would reset if the user refreshes or logs out/in.
Quest Completion & Rewards: The logic for a quest being marked "completed" by a user (or community) and distributing specific quest.rewards (tokens, badges) is not implemented.
7. Not Yet Implemented Features (To Do)
These are features mentioned in the product vision or identified as next steps that have no current implementation in the app.

Real-time Matching/Tracking:
Frontend: Live map displaying nearby pilots/riders, real-time ride tracking interface with ETA.
Backend: Real-time database updates for location, matching engine for ride requests/offers, push notification service for ride status updates.
Rating & Review System:
Frontend: Post-ride interface for rating pilot/rider, viewing aggregated ratings on profiles.
Backend: Storing pilot_rating and rider_rating on the Ride entity, aggregating ratings to update User.trust_score, potential review text storage.
User Verification Flows:
Frontend: UI for users to submit ID documents, verification status display.
Backend: Integration with identity verification services, updating User.verification_status.
In-ride Safety Tools:
Frontend: SOS button, optional PIN entry at pickup.
Backend: Emergency contact integration, real-time ride monitoring (geofencing, route deviation alerts), PIN validation.
Geo-tagged Local Events:
Frontend: Map overlays for events, event discovery page.
Backend: Event entity (or similar) to store event data, location-based querying.
Dynamic Streak Updates:
Frontend: Consistent display of current_streak.
Backend: Automated daily check and update of User.current_streak and User.longest_streak based on ride activity, potentially with cron jobs or scheduled tasks.
Push Notifications:
Frontend: User opt-in/settings for notifications.
Backend: Integration with a push notification service, defining notification triggers (e.g., "ride accepted", "streak warning", "new quest available").
Referral System:
Frontend: UI for generating referral codes, tracking referrals.
Backend: Logic for User.referral_count, generating unique referral codes, tracking sign-ups via referral.
8. General Development Guidelines
Styling: Predominantly uses Tailwind CSS for utility-first styling. The app follows a "glassmorphism" design aesthetic, defined by CSS variables in Layout.js. When adding new UI elements, always ensure they conform to this style.
Componentization: Aim for small, focused, and reusable React components. Break down complex pages into smaller, manageable components for better readability and maintenance.
Error Handling: For Base44 SDK and Integration calls, explicit try/catch blocks are generally not used unless specifically required for a user-facing error message. This allows errors to bubble up to the platform for visibility and debugging.
Navigation: Always use Link from react-router-dom and createPageUrl from @/utils for internal navigation to ensure consistent routing and avoid full page reloads.
Iconography: Uses Lucide React for icons. Ensure any new icons are imported from lucide-react and exist in its library.
Responsiveness: All new UI elements should be designed to be responsive and look good on both mobile and desktop screens. Tailwind's responsive prefixes (md:, lg:, etc.) are crucial.
