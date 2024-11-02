
# React Portfolio Template

A sleek and modern portfolio template for developers and designers, built with React. This template is ideal for showcasing projects, skills, and providing easy access for others to get in touch with you.

### [Live Preview](https://ubaimutl.github.io/react-portfolio/)

[![React Portfolio](src/assets/images/react%20portfolio%20gif.gif)](https://ubaimutl.github.io/react-portfolio/)

---

## Features

- **Fully Responsive Design**: Adapts to all device sizes for a seamless experience across mobile, tablet, and desktop.
- **Multi-Page Layout**: Organized sections to showcase projects, skills, experience, and more.
- **Contact Form with EmailJS**: Integrated contact form powered by [EmailJS](https://www.emailjs.com/) for easy, direct communication.
- **React-Bootstrap Styling**: Styled with React-Bootstrap for a modern and professional look.
- **Easy Content Management**: Edit all page content easily from a single file.

---

## Setup Instructions

### Getting Started

1. **Clone the Repository**

   Clone this repository to your local machine by running:

   ```bash
   git clone https://github.com/ubaimutl/react-portfolio.git
   ```

2. **Navigate into the Project Directory**

   ```bash
   cd react-portfolio
   ```

3. **Install Required Dependencies**

   Install the necessary dependencies by running:

   ```bash
   yarn install
   ```

4. **Start the Development Server**

   Start the local server to view the portfolio on `localhost:3000`:

   ```bash
   yarn start
   ```

---

## Configuration

To modify the portfolio content (such as your personal information, project details, and skills), edit the file `src/content_option.js`. This file contains all the configurable content, allowing you to easily update the information displayed across all portfolio sections.

---

## Project Structure

- `src/assets/images`: Store all images used in the project here.
- `src/components`: Contains the React components for each portfolio section.
- `src/content_option.js`: Configuration file where you can edit all displayed content.

---

## Deployment

To publish this portfolio on GitHub Pages:

1. Run the build command to create the optimized production build:

   ```bash
   yarn build
   ```

2. Deploy the build using GitHub Pages:

   ```bash
   yarn run deploy
   ```

---

## Technologies Used

- **React**: For creating a dynamic and responsive UI.
- **React-Bootstrap**: For styled components and layout structure.
- **EmailJS**: Handles contact form submissions to send emails without needing a back-end server.

---

## Acknowledgments

If you find this portfolio template useful, feel free to give it a ⭐ on GitHub! This simple gesture helps support further development and improvements.

---

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
