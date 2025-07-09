# **App Name**: CampusCompanion

## Core Features:

- GDG Events Display: Display upcoming and past GDG events with titles, dates, descriptions, winners, speakers, and resource links.
- Academic Resource Hub: Allow students to filter and access academic notes and previous year's question papers by branch, semester, and subject.
- Placement Prep Guide: Provide segmented placement preparation content (DSA practice, HR questions, company-specific guides) tailored for 2nd, 3rd, and 4th-year students.
- AI Assistant UI: A placeholder chatbot UI as a tool to be used by the assistant. The real chatbot function will come later, after Gemini API integration.
- User Authentication: Implement Firebase Google Sign-In for user authentication, storing user data (uid, name, email, role, branch, year, joinedAt) in Firestore's `users` collection.
- Global Navigation: Include a reusable Navbar component, visible across all routes.
- Admin Content Management: Provide an admin dashboard to upload GDG events, notes, papers, and placement content.

## Style Guidelines:

- Primary color: Deep Indigo (#6639A6) for a sense of knowledge, sophistication, and focus, resonating well with the academic environment.
- Background color: Very light grey (#F0F0F5), provides a neutral backdrop that ensures readability and focuses attention on the content.
- Accent color: A soft Violet (#8560A8), complements the deep indigo, providing visual interest and highlighting key interactive elements without overwhelming the primary tone.
- Font pairing: 'Space Grotesk' (sans-serif) for headlines and short amounts of text, paired with 'Inter' (sans-serif) for body text.
- Use minimalist and consistent icons for navigation and key actions throughout the app, ensuring clarity and ease of use. For example, icons can signify download, upload, event types, document categories, and user roles.
- Maintain a clean and structured layout, utilizing a grid system to align content, particularly in the events list, resource hub, and placement guide sections, to facilitate easy browsing and scanning.
- Incorporate subtle transitions and animations to provide feedback on user interactions (e.g., button presses, content loading) and improve overall user experience. Use smooth animations that add delight without distracting.