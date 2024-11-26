# bibliogle
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
## Table of Contents
- [Description](#description)
- [Installation](#installation-instructions)
- [Usage](#usage)
- [License](#license)
- [Credits](#credits)
- [Tests](#tests)
- [Questions](#questions)

## Deployed Website
https://bibliogle.onrender.com/

## Description
The Book Search Application is a full-stack web application that allows users to search for books, view details, and save their favorite books to their profile. It utilizes modern web technologies, including React, Apollo Client, and GraphQL on the frontend, and Node.js, Express, and MongoDB on the backend.

## Features
	•	Book Search: Users can search for books using the Google Books API.
	•	User Authentication: Users can sign up, log in, and log out.
	•	Saved Books: Logged-in users can save books to their profile and view them later.
    •	Delete Books: Logged-in users can remove books from their Saved Books inventory.
	•	Responsive Design: A seamless user experience on both desktop and mobile devices.
	•	GraphQL Integration: Efficient querying and mutation operations.

## Installation Instructions
1. Clone the repository:
```bash
git clone https://github.com/ikebyers/bibliogle
```
2. Install dependencies:
```bash
npm install
```
3. Create .env file with associated variables:
```bash
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/bibliogle
JWT_SECRET=your_secret_key
PORT=3001
```

## Usage
1. Run the back end:
```bash
cd server
npm run build
npm start
```
2. Run the front end:
```bash
cd client
npm start
```
3. Open the application in your browser:
```bash
http://localhost:3000
```

## License 
MIT

## Credits
** Ike Byers - Primary development and testing **

## Sources
- EdX's Teaching Assistants
- Google AI and OpenAI
- Documentation
    •	React Official Docs
	•	Apollo Client Documentation
	•	Node.js Documentation
	•	Express.js Documentation
	•	Mongoose Documentation
- StkacOverflow Discussion Forums
    •	Cannot find module '/dist/server.js'
	•	Deploying full-stack apps with Render
- Official Tutorials
	•	Render Deployment Guide
    •	Full-Stack Blog

## Questions
If you have any questions, please contact me at:
- GitHub: [ikebyers](https://github.com/ikebyers)
- Email: ikebyersmgmt@gmail.com
