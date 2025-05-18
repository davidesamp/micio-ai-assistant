# 🐾 Micio-AI-Assistant

**Micio-AI-Assistant** is a versatile and extensible AI assistant that brings multiple AI providers together into one streamlined, user-friendly interface. Forget juggling between platforms—Micio empowers you to interact with a variety of AI models effortlessly, all while keeping full control over your data.

🌐 **Try the live demo:** [https://www.micio-ai.com/](https://www.micio-ai.com/)

![Micio Logo](src/icons/logo/micio-ai-large.svg)

---

## 🚀 Features

* **Unified AI Access:** Seamlessly switch between multiple top-tier AI providers from one central hub.
* **Native Firebase Support:** Plug in your Firebase credentials to sync data to the cloud—or let Micio fall back to local storage if Firebase is not configured.
* **User-Friendly Interface:** Clean, modern UI for intuitive use across all supported models.
* **Extensible by Design:** Architected to easily integrate more providers and features in the future.

---

## 🤖 Currently Supported AI Providers

* **OpenAI**
* **Gemini (Google)**
* **DeepSeek**
* **Mistral**
* **Perplexity**

*More providers will be added in future releases.*

---

## 🛠 Getting Started

### 📦 Prerequisites

* Node.js
* Yarn

### 📥 Installation

```bash
git clone https://github.com/davidesamp/micio-ai-assistant.git
cd micio-ai-assistant
yarn install
```

### ⚙️ Configuration

Create a `.env` file at the root of the project and include your **Firebase credentials** (optional):

```env
FIREBASE_API_KEY=<your_firebase_api_key>
FIREBASE_AUTH_DOMAIN=<your_firebase_auth_domain>
FIREBASE_PROJECT_ID=<your_firebase_project_id>
FIREBASE_STORAGE_BUCKET=<your_firebase_storage_bucket>
FIREBASE_MESSAGING_SENDER_ID=<your_firebase_messaging_sender_id>
FIREBASE_APP_ID=<your_firebase_app_id>
```

> 🔒 **Note:** If Firebase credentials are not provided, all data will be stored locally in your browser using local storage.

---

### 🧪 Running the App

```bash
yarn start
```

Then open your browser and navigate to [http://localhost:4242](http://localhost:4242).

---

## 🌱 Contributing

**Contributions are very welcome!**
If you’d like to add a new feature, improve the UI, fix bugs, or suggest an idea—feel free to open a pull request or start a discussion in the issues.

---

## 🗺️ Roadmap

* 🔌 Support more AI providers to expand compatibility and flexibility
* 🧠 Add **reasoning** support where available
* 🎙️ Enable **speech support** (text-to-speech / speech-to-text)
* 🧩 Integrate a **Canvas-style editor** for organizing and editing multi-part content/code
* 💅 Continuously **improve the UI** and user experience

---

## 📄 License

Licensed under the **Apache 2.0 License**. See the [LICENSE](./LICENSE) file for details.

---

## 🔗 Demo

👉 Check out the live app here: [https://www.micio-ai.com/](https://www.micio-ai.com/)

---

Let me know if you'd like a "Screenshots" section or badges to further enhance the README’s visual appeal.
