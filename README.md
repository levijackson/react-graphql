# React GitHub GraphQL Search

This project was based on [Building a GraphQL Project with React.js](https://github.com/LinkedInLearning/react-graphql-2875095/) by [Ray Villalobos](https://github.com/planetoftheweb).

Key differences:
- Converted to TypeScript
- Added debouncing to ensure we don't fire off too many requests
- Added `db.js.example` to make setup easier

# Setup
1) [Generate a personal access token](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token)

Permissions should be read-only:
- `repo` (all of them)
- `user` (all of them)

2) Copy `db.js.example` to `./src/config/db.ts`
```
cp ./db.js.example ./src/config/db.ts
```

3) Adjust `./src/db.js` to use your auth token where it has the placeholder `<github_auth_token>`

4) Start it up
```
npm start
```