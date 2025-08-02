# Spark - Creative Prompt Generator

Spark is a web application that generates creative prompts for various categories, including character, technical, and design.
<img width="1867" height="1079" alt="image" src="https://github.com/user-attachments/assets/a9dbc97d-c787-4a31-a35b-88e4c72999fd" />

## Features

- **Character Prompts:** Generate random character and scenario combinations.
- **Technical Prompts:** Get AI-powered technical application ideas based on your interests.
- **Design Prompts:** Generate typography and color harmonies based on a design theme.

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd Spark
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install
    # or pnpm install
    # or bun install
    ```
3.  **Set up environment variables:**
    Create a `.env.local` file in the root of your project and add your Gemini API key:
    ```
    GEMINI_API_KEY=your_gemini_api_key_here
    ```
    You can obtain a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This project can be easily deployed to Vercel. Remember to set your `GEMINI_API_KEY` as an environment variable in your Vercel project settings.
