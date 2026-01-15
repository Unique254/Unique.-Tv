# Unique TV - AI Powered Cinematic Experience

A premium Android TV application (Leanback) integrated with Google Gemini AI for advanced content discovery, real-time industry grounding, and generative cinematic experiments.

## Architecture
- **DI**: Custom Service Locator for lightweight dependency management.
- **Repository Pattern**: Unified data access for local cache, API, and Gemini AI services.
- **MVVM**: Separation of concerns using ViewModels to handle business logic and UI state.
- **AI Core**: Powered by Gemini 3 Flash and Gemini 2.5 series for multimodal interactions.

## Key Features
- **Leanback Navigation**: Optimized for D-pad/Remote control.
- **AI Recommendation Engine**: Context-aware film discovery.
- **Video Lab**: Generative AI video creation using Veo models.
- **Live EPG**: Real-time program guide with live news grounding.

## Build Requirements
- Android Studio Iguana or newer.
- Gradle 8.2+
- Gemini API Key (set in environment).