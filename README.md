# Rock, paper, scissors!
The motivation behind this game app was to decide who has to take our dog for a walk at nights.
## Key points
- Backend using Pocketbase, used as a framework for SQL triggers and hooks
- Front using sveltekit
## Features
- OAuth using Github
- SSR flow using web sockets. Only one single endpoint needed (web)
- Client flow using Pocketbase SDK and its realtime API. Two reachable endpoints needed (web and pocketbase). However this flows allows for hosting in serverless providers like netlify, vercel, etc...
- Room system for easy multiplayering
- yaimisu original artwork 
- Includes dockerfiles and docker compose file for contenarization
