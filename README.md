# ==================== GameItemComparing ============================

## Install
nvm install 18.14.1
npm install -g @angular/cli
npm install -g firebase-tools

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.0.

## Build project
ng build ## npm start build


## Init firebase, first time only
firebase init

- Are you ready to proceed? Yes
- Hosting: Configure files for Firebase Hosting and (optionally) set up GitHub Action deploys
- Use an existing project.
  Select a Firebase project in Firebase console.
- What do you want to use as your public directory? dist/game-item-comparing
- Configure as a single-page app (rewrite all urls to /index.html)? (y/N) yes
- Set up automatic builds and deploys with GitHub? (y/N) Y to go to config Github deployment, N if no need
- File build/index.html already exists. Overwrite? (y/N) No
- Visit this URL on this device to log in:...
- For which GitHub repository would you like to set up a GitHub workflow? (format: user/repository) trungitnt95/base
- Set up the workflow to run a build script before every deploy? (y/N) N
- Set up automatic deployment to your site's live channel when a PR is merged? n
- Created workflow file C:\TRUNG\projects\base\.github/workflows/firebase-hosting-pull-request.yml
- Set up automatic deployment to your site's live channel when a PR is merged? (Y/n) n

## every deployment
ng build ## npm start build
firebase deploy

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
