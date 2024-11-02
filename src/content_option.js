const logotext = "Ganesh";
const meta = {
    title: "Adimalupu Ganesh",
    description: "I’m Ganesh Adimalupu, a 3rd-year student passionate about coding and developing cool projects.",
};

const introdata = {
    title: "I’m Ganesh Adimalupu",
    animated: {
        first: "I love coding",
        second: "I code cool websites",
        third: "I develop mobile apps",
    },
    description: "I'm passionate about creating impactful software and leveraging technology for innovative solutions.",
};

const dataabout = {
    title: "A bit about myself",
    aboutme: "I'm a 4th-year student studying CSE at St. Thomas Institute for Science & Technology. I'm passionate about technology, coding, and developing innovative solutions. My goal is to continuously learn and grow in the field of software development.",
};

const worktimeline = [
    {
        jobtitle: "Be My Chef AI",
        where: "Self-Directed",
        date: "2024",
        description: "Developed an AI-powered recipe recommendation system that analyzes ingredients and generates recipes using image recognition and NLP techniques.",
        link: "https://github.com/GaneshAdimalupu/Be-My-Chef"
    },
    {
        jobtitle: "Lift Access System",
        where: "Self-Directed",
        date: "2023",
        description: "Designed a Lift Access System to enhance building security and accessibility, integrating user identification and automated controls.",
        link: "https://github.com/GaneshAdimalupu/Lift-Access-System"
    },
    {
        jobtitle: "AFRA Project",
        where: "Self-Directed",
        date: "2024",
        description: "Developed a comprehensive front-end application for AFRA using modern JavaScript frameworks, enhancing user experience and functionality.",
        link: "https://github.com/GaneshAdimalupu/AFRA-master"
    },
    {
        jobtitle: "Chatbot Project",
        where: "Self-Directed",
        date: "2023",
        description: "Created an AI-powered chatbot using Python, implementing NLP for improved user interactions and support.",
        link: "https://github.com/GaneshAdimalupu/chatbot_project"
    },
    {
        jobtitle: "College Management System",
        where: "Self-Directed",
        date: "2023",
        description: "Developed a web-based College Management System to streamline administrative tasks, enhancing operational efficiency.",
        link: "https://github.com/GaneshAdimalupu/College-Management-System"
    },
    {
        jobtitle: "Restaurant Management System",
        where: "Self-Directed",
        date: "2022",
        description: "Designed and implemented a Restaurant Management System to optimize order processing and customer management.",
        link: "https://github.com/GaneshAdimalupu/Restaurant-Management-System"
    },
    {
        jobtitle: "Grocery Inventory System",
        where: "Self-Directed",
        date: "2022",
        description: "Developed a Grocery Inventory System to manage stock efficiently, reducing waste and improving inventory accuracy.",
        link: "https://github.com/GaneshAdimalupu/Grocery-Inventory-System"
    },
    {
        jobtitle: "Web Development Projects",
        where: "Self-Directed",
        date: "2021",
        description: "Completed various web development projects using HTML, CSS, and JavaScript to solidify front-end development skills.",
        link: "https://github.com/GaneshAdimalupu/Web-Development-master"
    },
    // Add more projects as needed
];


const skills = [
    { name: "Python", value: 90 },
    { name: "Django", value: 85 },
    { name: "JavaScript", value: 80 },
    { name: "React", value: 60 },
    { name: "jQuery", value: 85 },
    { name: "HTML/CSS", value: 85 },
    { name: "Node.js", value: 75 },
];

const services = [
    {
        title: "Web Development",
        description: "I develop responsive and user-friendly websites using modern web technologies like HTML, CSS, and JavaScript frameworks.",
    },
    {
        title: "Mobile App Development",
        description: "I have experience in developing mobile applications for Android and iOS platforms using React Native and other frameworks.",
    },
    {
        title: "UI/UX Design",
        description: "I design intuitive and visually appealing user interfaces to enhance the user experience of web and mobile applications.",
    },
];

const dataportfolio = [
    {
        img: "https://example.com/project1_image.jpg", // Replace with actual image URL
        description: "Be My Chef AI: A food recipe recommendation system using image recognition and ingredient detection powered by CNN and NLP. This project allows users to input ingredients or images and generates relevant recipes.",
            features: [
        "Built with TensorFlow and PyTorch",
        "Real-time ingredient detection",
        "User-friendly interface with Next.js and Tailwind CSS"
    ],
        link: "https://be-my-chef-ai.streamlit.app/", 
    },
    {
        img: "https://example.com/project2_image.jpg",
        description: "Recipe Generator from Food Images: Utilizes CNNs to identify ingredients from images and generate recipes accordingly. Built with PyTorch, TensorFlow, and Vite for front-end support.",
        link: "https://github.com/GaneshAdimalupu/Recipe-Generation-from-Food-Image",
    },
    {
        img: "https://example.com/project3_image.jpg",
        description: "FOSS Club Website: Built a website to promote and manage FOSS club activities at St. Thomas College. Used HTML, CSS, JavaScript, and a responsive design approach for accessibility.",
        link: "https://github.com/GaneshAdimalupu/FOSS-Club-Website",
    },
    {
        img: "https://example.com/project4_image.jpg",
        description: "Personal Portfolio Website: A portfolio to showcase my skills, projects, and achievements. Created using React, Tailwind CSS, and hosted on GitHub Pages.",
        link: "https://ganeshadimalupu.github.io/",
    },
    {
        img: "https://example.com/project5_image.jpg",
        description: "AI-Powered Chatbot: Developed a chatbot using NLP techniques to answer FAQs and provide interactive support for users. Built with Python and integrated with a web-based UI.",
        link: "https://github.com/GaneshAdimalupu/AI-Chatbot",
    },
];



const contactConfig = {
    YOUR_EMAIL: "Ganeshjohn253@gmail.com",
    YOUR_FONE: "+91 6303205936",
    description: "Feel free to reach out to me via email or phone. I'm open to collaboration and new opportunities.",
    YOUR_SERVICE_ID: "service_3o9dvkk",
    YOUR_TEMPLATE_ID: "template_cwuaoq7",
    YOUR_USER_ID: "your_user_id_here",
};

const socialprofils = {
    github: "https://github.com/GaneshAdimalupu",
    linkedin: "https://www.linkedin.com/in/ganesh-adimalupu-62b407239/",
    twitter: "https://twitter.com/John56247240",
};

export {
    meta,
    dataabout,
    dataportfolio,
    worktimeline,
    skills,
    services,
    introdata,
    contactConfig,
    socialprofils,
    logotext,
};
