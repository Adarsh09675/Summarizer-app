# How to Create a Google Gemini API Key

The `@google/generative-ai` library requires an API key from **Google AI Studio**. If you used Google Cloud Vertex AI or another method, that might be why it's failing.

## Step-by-Step Instructions

1.  **Go to Google AI Studio**
    *   Visit: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

2.  **Sign In**
    *   Sign in with your Google Account.

3.  **Create API Key**
    *   Click the large blue **"Create API key"** button.
    *   Select **"Create API key in new project"** (easiest) OR select an existing project if you have one.
    *   Copy the generated key string (it starts with `AIza...`).

4.  **Update Your App**
    *   Open your `.env.local` file in the project.
    *   Replace the old key with the new one:
        ```
        GEMINI_API_KEY=your_new_key_here
        ```

5.  **Restart Server (Crucial)**
    *   Stop your running server in the terminal (Ctrl+C).
    *   Run `npm run dev` again to load the new key.

## Common Issues
*   **"404 Not Found"**: Usually means the key doesn't have access to the specific model (like `gemini-1.5-flash`), or the project doesn't have billing enabled (though AI Studio has a free tier).
*   **Vertex AI**: If you are using Google Cloud Console manually, you might need to enable the "Generative Language API". Using the AI Studio link above handles this automatically for you.
