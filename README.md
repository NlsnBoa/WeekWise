# WeekWise

WeekWise is an AI-powered weekly task scheduler that helps you organize your tasks, prioritize them, and seamlessly integrate the schedule into your Google Calendar. Users can enter their tasks and priorities in natural language, and WeekWise generates a weekly plan that can be exported to Google Calendar.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Features
- Enter tasks and priorities in natural language
- AI-powered task scheduling using OpenAI GPT-4
- Customizable wake and sleep times
- JSON output of the weekly schedule
- Export the schedule to Google Calendar
- Responsive design with Tailwind CSS

## Installation

### Prerequisites
- Node.js (v14.x or later)
- npm (v6.x or later) or yarn (v1.x or later)
- Git

### Steps
1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/WeekWise.git
    cd WeekWise
    ```

2. Install dependencies:
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```

3. Create a `.env.local` file in the root directory and add your environment variables:
    ```plaintext
    OPENAI_API_KEY=your-openai-api-key
    GOOGLE_CLIENT_ID=your-google-client-id
    GOOGLE_CLIENT_SECRET=your-google-client-secret
    NEXT_PUBLIC_BASE_URL=http://localhost:3000
    ```

## Usage
1. Start the development server:
    ```bash
    npm run dev
    ```
    or
    ```bash
    yarn dev
    ```

2. Open your web browser and go to `http://localhost:3000`.

3. Enter your tasks and priorities in natural language, and click "Generate Schedule".

4. View the generated schedule and click "Export to Google Calendar" to add it to your Google Calendar.

## Configuration
### Environment Variables
- `OPENAI_API_KEY`: Your OpenAI API key for accessing GPT-4.
- `GOOGLE_CLIENT_ID`: Your Google client ID for OAuth2 authentication.
- `GOOGLE_CLIENT_SECRET`: Your Google client secret for OAuth2 authentication.
- `NEXT_PUBLIC_BASE_URL`: The base URL of your application, e.g., `http://localhost:3000` for local development.

### Tailwind CSS
Tailwind CSS is used for styling the application. You can customize the Tailwind configuration in `tailwind.config.js`.

## Development

### Project Structure
- `pages/`: Contains the Next.js pages, including API routes.
- `styles/`: Contains global styles and Tailwind CSS configuration.
- `utils/`: Contains utility functions, e.g., for creating `.ics` files.

### API Routes
- `pages/api/generate-schedule.js`: Handles generating the weekly schedule using GPT-4.
- `pages/api/export-to-google-calendar.js`: Handles exporting the schedule to Google Calendar.

