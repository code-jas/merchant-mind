<div align="center">
    <a href="https://github.com/code-jas/merchant-mind">
        <img
            src="/src/assets/images/logo.png"
            alt="Logo" width="80" height="80">
    </a>
    <h3 align="center">Merchant Mind</h3>
    <p align="center">
        An admin dashboard application integrating the FakeAPI from Platzi to manage products and categories efficiently.
        <br /> <br />
        <a href="https://github.com/code-jas/merchant-mind/issues/new?labels=bug&template=bug-report---.md">Report Bug</a> ·
        <a href="https://github.com/code-jas/merchant-mind/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
    </p>
</div>

### About The Project

<div style="display: flex; justify-content: center; align-items: center; max-width: 1920px; margin: 0 auto;">
    <img src="https://github.com/code-jas/merchant-mind/blob/main/assets/screenshots/dashboard.png?raw=true" alt="Product Screenshot" style="max-width: 100%; height: auto;">
</div>

Merchant Mind is an admin dashboard application designed to manage products and categories efficiently by integrating the [FakeAPI from Platzi](https://fakeapi.platzi.com/). The application provides a robust platform for administrators to perform CRUD operations, visualize data through charts, and manage inventory seamlessly. It features dynamic components, state management with Pinia, and a sleek UI powered by Shadcn and Tailwind CSS.

### Features

-  **Authentication**: Secure admin login with validation.
-  **Dashboard**:
   -  **Summary Cards**: Quick overview of key metrics.
   -  **Charts**: Visual representation of products over categories.
   -  **Recent Activity**: List of recently created products.
-  **Product Management**:
   -  **Product Listing**: View all products in a dynamic data table.
   -  **CRUD Operations**: Create, read, update, delete, and duplicate products.
   -  **Filters**: Search products by name, category, and price range.
-  **Category Management**:
   -  **Category Listing**: View all categories.
   -  **CRUD Operations**: Create, read, update, and delete categories.
-  **Form Validations**: Robust form validation using Vee-validate.
-  **Dynamic Components**: Flexible components that adapt to various contexts.
-  **State Management**: Efficient data handling using Pinia.
-  **Light and Dark Mode**: Toggle between light and dark themes.

### Built With

This project was developed using the following technologies:

-  [Vue.js 3](https://vuejs.org/)
-  [Vite](https://vitejs.dev/)
-  [TypeScript](https://www.typescriptlang.org/)
-  [Pinia](https://pinia.vuejs.org/)
-  [Tailwind CSS](https://tailwindcss.com/)
-  [Shadcn](https://www.shadcn-vue.com/)
-  [Axios](https://axios-http.com/)
-  [Vee-validate](https://vee-validate.logaretm.com/v4/)
-  [ESLint](https://eslint.org/)
-  [Prettier](https://prettier.io/)
-  [FakeAPI from Platzi](https://fakeapi.platzi.com/)

### Getting Started

To set up the Merchant Mind application locally, follow these steps:

### Prerequisites

Ensure you have Node.js and npm installed:

-  **Node.js** (v14.x or later)
-  **npm** (v6.x or later)

You can check your Node.js and npm versions by running:

### Installation

**1. Clone the repository**

```sh
git clone https://github.com/code-jas/merchant-mind.git
```

**2. Navigate to the project directory**

```sh
cd merchant-mind
```

**3. Install dependencies**

```sh
npm install
```

**4. Start the development server**

```sh
npm run dev
```

**5. Open the application**
Open your browser and navigate to `http://localhost:5173/`.

## Building for Production

To compile and minify the application for production, run:

```sh
npm run build
```

The built files will be in the dist folder.

### Roadmap

-  [x] Implement admin authentication with validation.
-  [x] Develop dashboard with summary cards and charts.
-  [x] Implement product listing with CRUD operations.
-  [x] Add product filters by search, category, and price range.
-  [x] Implement category management with CRUD operations.
-  [x] Integrate form validations using Vee-validate.
-  [x] Utilize dynamic components for flexibility.
-  [x] Implement pagination and advanced filters.
-  [x] Enhance the UI/UX with more Shadcn components.
-  [x] Deploy the application for live preview.

### Challenges and Learnings

**Reactivity of Components**
Handling component reactivity was crucial to ensure the UI updates correctly with state changes. Understanding Vue's reactivity system helped in optimizing component performance.

**State Management**
Implementing Pinia for state management eliminated the need for prop drilling, making data flow more manageable across components. One challenge was structuring the stores efficiently, which was resolved by modularizing the state.

**Structuring the Front-End Architecture**
Designing a front-end architecture required careful planning. Organizing components, views, and services in a logical manner improved maintainability.

**Implementing ESLint**
Setting up ESLint helped in identifying and fixing errors early in development. Configuring ESLint with TypeScript and Vue 3 ensured code consistency and quality.

**Implementing Shadcn UI**
Shadcn UI is popular in the React community, and integrating it with Vue posed some challenges. For example, certain components required adaptation to work with Vue's reactivity and lifecycle hooks. By referring to the Shadcn Vue documentation and community forums, these issues were resolved. The result is a set of visually appealing, flexible, and lightweight UI components.

The advantage of using Shadcn is the good-looking component interfaces, flexibility, and lightweight front-end components.
