# Micio-AI-Assistant

Micio-AI-Assistant is a versatile application that allows you to access and utilize multiple AI providers through a single, streamlined interface. Empowering you to leverage the unique strengths of various AI models without the hassle of managing multiple accounts and APIs.
![Micio Logo](src/icons/micio-ai-pink.png)

## Features

* **Unified AI Access:** Seamlessly integrate and switch between different AI providers.
* **User-Friendly Interface:** An intuitive design for easy interaction with various AI services.
* **Flexibility:** Use your own API keys to maintain control and security.
* **Extensibility:** Designed to be easily expandable with support for more AI providers in the future.

## Getting Started

To get started with Micio-AI-Assistant, follow these steps:

### Prerequisites

* Node.js and Yarn installed on your machine.

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/davidesamp/micio-ai-assistant.git
    cd micio-ai-assistant
    ```

2.  Install dependencies:

    ```bash
    yarn install
    ```

### Configuration

1.  Create an `.env` file at the root of your project.

2.  Add your API keys to the `.env` file:

    ```
    GOOGLE_GEMINI_KEY=<your gemini key here>
    DEEP_SEEK_KEY=<your deepseek key here>
    MISTRAL_KEY=<your mistral key here>
    ```

    * Replace `<your gemini key here>`, `<your deepseek key here>`, and `<your mistral key here>` with your actual API keys.
    * **Important:** Keep your API keys secure and do not commit them to version control.

### Running the Application

1.  Start the development server:

    ```bash
    yarn start
    ```

2.  Open your browser and navigate to `http://localhost:4242` (or the port displayed in your terminal).

## Future Development

This project is actively being developed. Future updates will include the integration of additional AI providers, thorough bug fixes, and the implementation of numerous new features to enhance the user experience and expand the application's capabilities.

## License

This project is licensed under the Apache 2.0 License - see the `LICENSE` file for details.
