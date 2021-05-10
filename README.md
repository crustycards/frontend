# [Crusty Cards](https://crusty.cards/) Frontend Service
[![Prod CI/CD](https://github.com/crustycards/frontend/actions/workflows/prod-ci.yml/badge.svg?branch=master)](https://github.com/crustycards/frontend/actions/workflows/prod-ci.yml)

Contains the React app and Frontend Service. This service is mainly an API gateway which handles the connection between the browser and backend services. Specifically its responsibilities include:

* Serving up the React app
* Handling incoming Socket.IO connections from the React app and piping real-time updates from RabbitMQ
* Handling all end-user authentication
  * Communicating with Google OAuth servers to authenticate users (Google OAuth is currently the only supported login method)
  * Generating JWT-based tokens that are stored as cookies in the browser (and verifying them with each subsequent request)

See the full inter-service architectural diagram [here](https://app.moqups.com/Syjv300SBW/view/page/a46483b7c?fit_width=1).