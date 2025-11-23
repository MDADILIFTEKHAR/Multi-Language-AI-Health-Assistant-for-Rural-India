# **App Name**: Swasthya AI

## Core Features:

- Multi-Language Voice Input: Capture voice input in multiple Indian languages (Hindi, Bhojpuri, Tamil, Bengali, Marathi, Telugu, Odia) using Google ML Kit and Firebase.
- Symptom Checker AI: Use a GenAI model (Gemini) tool for medical reasoning to ask symptom-based questions and detect possible health conditions, responding in the user's language.
- First-Aid Guidance: Fetch and tailor first-aid advice from a Firestore collection (first_aid_help) based on detected symptoms, providing guidance on Do's and Don'ts and when to seek help.
- Nearest Hospital Finder: Use the Google Maps Places API to find the nearest hospitals and PHCs. The AI fetches information like distance, directions, and emergency contact, storing hospital data in Firestore and is exposed via a Cloud Function.
- Offline Data Caching: Cache hospital data and store first-aid information locally for offline access. The database synchronizes with Firestore when the application returns to online access.
- Emergency Assistance: Provide an emergency 'Call Ambulance' button for immediate assistance.
- Language selector: Users can select from available list of languages that is most suitable to them to interface with application.

## Style Guidelines:

- Primary color: A warm, earthy orange (#E07A5F) to convey health, vitality, and connection to the Indian context.
- Background color: Light beige (#F2E8D5), providing a calming and neutral backdrop.
- Accent color: A muted teal (#3D405B) for interactive elements and important information.
- Body and headline font: 'PT Sans', a humanist sans-serif that combines a modern look and a little warmth or personality; suitable for both headlines and body text.
- Use simple, clear icons that are easily understood across different languages and literacy levels.
- Simple, chat-style interface to facilitate easy interaction and readability with a prominent voice input button.
- Subtle transitions and animations to provide feedback during voice input and data loading, ensuring a smooth user experience.