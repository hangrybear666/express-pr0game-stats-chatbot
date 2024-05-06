
# Express Pr0game Stats Chatbot

## Technologies Used

- **TypeScript:** Statically typed JS with high strictness level and compile target ESNext.
- **Express:** A minimalist web framework for Node.js used to build the server-side application.
- **Axios:** A promise-based HTTP client for making requests to the backend API and handling asynchronous operations.
- **fs:** File system module for Node.js.
- **Morgan:** HTTP request logger middleware for Node.js.
- **Node.js:** A JavaScript runtime environment used for executing server-side code.
- **Telegram Bot API:** Used for creating a Telegram chatbot to communicate extracted data from the JSON files to users.
- **Discord.js:** A powerful JavaScript library for interacting with the Discord API, used for creating a Discord chatbot to communicate extracted data from the JSON files to users.
- **Nodemon:** Hot Reload upon file changes of the server during development, enhancing the development workflow.
- **ts-node:** Executing TypeScript files directly without the need for compilation, enhancing the development workflow.
- **ESLint and Prettier:** Linter and Formatter for ensuring code quality and enforcing coding standards.

## Setup

**Dependencies**

1. **Node.js:** Ensure that Node.js is installed on your local machine, with a minimum version of 14.x. You can download Node.js from [here](https://nodejs.org/).

**Installation**

1. **Clone the Repository:**

```bash
git clone https://github.com/your-username/express-pr0game-stats-chatbot.git
```

2. **Navigate to the Project Folder:**

```bash
cd express-pr0game-stats-chatbot
```

3. **Install Dependencies:**

```bash
npm install
```

4. **Configure Environment Variables:**

   - Create a `.env` file in the root directory.
   - Define the following variables:
     - REST_PW
     - TELEGRAM_ADMIN_BOT_TOKEN
     - TELEGRAM_ADMIN_USER_CHAT_ID
     - TELEGRAM_ADMIN_BOT_USERNAME
     - TELEGRAM_CHAT_BOT_TOKEN
     - TELEGRAM_CHAT_BOT_USERNAME

## Usage

1. **Run the Server:**

```bash
npm run server
```

2. **Telegram Bot:**

   - Start a conversation with your Telegram bot using the provided username.
   - Interact with the bot to receive data extracted from the JSON files.

3. **Discord Bot:**

   - Invite your Discord bot to your server using the provided invite link.
   - Interact with the bot in your Discord server to receive data extracted from the JSON files.

Once the server is up and running, it will be ready to handle HTTP requests containing .json files and interact with users via Telegram and Discord chatbots.

## License

This project is licensed under the [MIT License](LICENSE).

---
