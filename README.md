## MarBot - Islamic Prayer Reminder Chatbot

### Overview

MarBot, integrated into the SeaTalk App, is a digital call to prayer chatbot that sends timely reminders and provides prayer times, enabling users to stay connected with their daily rituals. Built with Express.js, Prisma, and PostgreSQL, MarBot ensures smooth interactions and persistent storage of each subscriber's configuration.

### Features

- Digital Call to Prayer: MarBot sends timely reminders to users through the SeaTalk App.
- Daily Prayer Times: Users can easily access prayer times for the day using the `/today` command.
- Customizable Prayer Reminders: Set reminders a few minutes before the prayer time with the `/reminder [1-10 minutes]` command.
- Activation/Deactivation: Take control of MarBot's notifications. Activate notifications using `/start` and deactivate them with `/stop`.
- Feedback System: Send feedback or report issues with the `/feedback [message]` command.
- Help Command: A helpful list of available commands for users with the `/help` command.

### Credits

This project is built upon the boilerplate from [prisma-express-typescript-boilerplate](https://github.com/antonio-lazaro/prisma-express-typescript-boilerplate).
