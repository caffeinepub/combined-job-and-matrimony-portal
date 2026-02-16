# Combined Job and Matrimony Portal

A unified platform that provides both job search and matrimonial services, allowing users to maintain dual profiles and access both functionalities from a single application.

## Authentication
- Internet Identity integration for secure login and registration
- Single account access for both job and matrimony features

## User Profiles
- Dual-profile system where each user can maintain:
  - Job profile: professional background, skills, experience, career preferences
  - Matrimony profile: personal details, partner preferences, lifestyle information
- Profile photo upload with blob storage
- Resume upload functionality for job profiles
- Privacy controls for profile visibility

## Job Portal Features
- Job listing creation and management by employers
- Job application system with application tracking
- Save jobs functionality for later review
- Company profile pages with job management dashboard
- Advanced job filtering by:
  - Category/industry
  - Location
  - Salary range
  - Experience level
  - Job type (full-time, part-time, contract)

## Matrimony Portal Features
- Partner search with comprehensive filtering:
  - Age range
  - Location/city
  - Profession
  - Religion
  - Education level
  - Other personal preferences
- Matchmaking suggestions based on user preferences
- Interest system (send/receive interest requests)
- Favorites list for potential matches
- Private messaging system for matched users

## AI Match Engine
- AI-powered recommendation system that analyzes user profiles for enhanced matching
- For matrimonial matches: considers occupation, location, age preferences, and interests to suggest compatible partners
- For job recommendations: analyzes job seeker profiles against available listings considering experience, education, and salary expectations
- Provides reasoning explanations for each recommendation (e.g., "Similar education and location")

## Dashboards
### User Dashboard
- Job applications tracking and status
- Matrimonial matches and conversations
- Profile management for both job and matrimony
- **Recommendations section** displaying:
  - Top 5 AI-driven job suggestions with explanations
  - Top 5 AI-driven matrimonial match suggestions with compatibility reasons
- Notification center
- Saved jobs and favorite profiles

### Admin Dashboard
- User account management
- Job posting moderation and approval
- Matrimonial profile verification
- Content reporting and moderation
- Platform analytics and user statistics

## Recommendation System
- AI-enhanced job recommendations based on user skills, experience, education, and salary preferences
- AI-powered matrimonial match suggestions using advanced compatibility algorithms
- Preference-based ranking system for both job and partner matches
- Explanation system providing reasoning for each recommendation

## Messaging System
- Private messaging between matched matrimonial users
- Message history and conversation management
- Basic message filtering and reporting

## Notifications
- In-app notifications for:
  - New job matches and applications
  - Matrimonial interest received/accepted
  - New messages
  - Profile views and interactions

## Data Storage (Backend)
- User profiles (job and matrimony data)
- Job listings and applications
- Company information
- Messages and conversations
- User preferences and settings
- Notification history
- Match history and favorites
- AI recommendation data and compatibility scores
- Blob storage for photos and resumes

## Core Operations (Backend)
- User authentication and profile management
- Job posting and application processing
- AI-powered matchmaking algorithm execution
- AI-driven job recommendation processing
- `getRecommendedJobsForCaller()` endpoint returning AI-matched job listings
- `getRecommendedMatchesForCaller()` endpoint returning AI-ranked matrimonial profiles
- Message routing and storage
- Notification delivery
- Search and filtering operations
- Admin content moderation tools
