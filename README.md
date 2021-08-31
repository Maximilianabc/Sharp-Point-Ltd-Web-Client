# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:9027](http://localhost:9027) to view it in the browser.

To change the port, go to [package.json](./package.json) and find "start" property within "script" property.
Add SET PORT=*The-port-number-you-want* && before react-scripts start

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm install`

Run this first before running the app to ensure missing modules are installed.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Project Structure

### Components
Folder [Components](./Components) contains reusable components such as forms, input fields etc.\
File [Appbar.tsx](./Components/Appbar.tsx) contains the appbar component.\
File [Button.tsx](./Components/Button.tsx) contains a styled button component. So far isn't used.\
File [Drawer.tsx](./Components/Drawer.tsx) contains the drawer component of the appbar.\
File [Dropdown.tsx](./Components/Dropdown.tsx) contains a styled drop down menu component. So far isn't used.\
File [Form.tsx](./Components/Form.tsx) contains the add order form and filter form components.\
File [Icon.tsx](./Components/Icon.tsx) contains all icon buttons used accross the website.\
File [InputField.tsx](./Components/InputField.tsx) contains a few different styled input fields, numeric updowns, and datetime pickers.\
File [Label.tsx](./Components/Label.tsx) contains a few different types of labels, default, stacked, and composite.\
File [Tab.tsx](./Components/Tab.tsx) contains the tab components for old design. So far deprecated.\
File [Table.tsx](./Components/Table.tsx) contains components of data table.\
File [WebSocket.tsx](./Components/WebSocket.tsx) contains websocket components for account update and price server.


### Containers
Folder [Containers](./Containers) contains major containers of the web client, such as summary, positions, orders etc.\
File [Cash.tsx](./Containers/Cash.tsx) contains the tab of cash page of old design.\
File [ClearTrade.tsx](./Containers/ClearTrade.tsx) contains the tab of clear trade page of old design.\
File [Dashboard.tsx](./Containers/Dashboard.tsx) contains dashbaord component.\
File [FxRate.tsx](./Containers/FxRate.tsx) contains the tab of FX rate page of old design.\
File [LoginPage.tsx](./Containers/LoginPage.tsx) contains components of login page, including login form, 2FA form and account number form.\
File [LogOut.tsx](./Containers/LogOut.tsx) contains a dummy component for loggin out.\
File [Orders.tsx](./Containers/Orders.tsx) contains the component for displaying today's, working orders and order history.\
File [Positions.tsx](./Containers/Positions.tsx) contains the component for displaying positions.\
File [Profile.tsx](./Containers/Profile.tsx) contains the component for displaying accoutn summary.

### Utility
Folder [Util](./Util) contains script files that are NOT related to any of the above, such as helper functions, css layout classes, locale translations etc.
File [Action.ts](./Util/Actions.ts)
File [Layout.ts](./Util/Layout.ts)
File [Locales.ts](./Util/Locales.ts)
File [Reducers.ts](./Util/Reducers.ts)
File [Store.ts](./Util/Store.ts)
File [Util.ts](./Util/Util.ts)