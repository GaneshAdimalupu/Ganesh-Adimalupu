// FILE: src/content_option.js

const logotext = "GANESH";
const meta = {
  title: "Ganesh Adimalupu - Machine Learning Engineer",
  description: "AI/ML Specialist with expertise in Python, Deep Learning, NLP, and Data Engineering. Creating intelligent solutions for real-world problems.",
};

const introdata = {
  title: "Ganesh Adimalupu",
  animated: {
    first: "Machine Learning Engineer",
    second: "AI Solutions Developer",
    third: "Data Science Enthusiast",
  },
  description: "Passionate about building intelligent systems that solve real-world problems. Specializing in machine learning, deep learning, and natural language processing with hands-on experience in developing end-to-end AI solutions.",
};

const dataabout = {
  title: "My Journey in AI",
  aboutme: "I'm an AI/ML enthusiast with a strong foundation in computer science and a passion for artificial intelligence. Currently pursuing a BTech in Computer Science from St Thomas Institution of Science and Technology, I've been focusing on applying machine learning to real-world problems through internships and projects. My experience includes developing custom ML models, implementing deep learning solutions, and building data processing pipelines. I'm dedicated to staying at the cutting edge of AI advancements and leveraging these technologies to create impactful solutions in fields like healthcare, education, and business.",
};

const worktimeline = [
  {
    jobtitle: "AI and Machine Learning Intern",
    where: "HDLC Info Technologies",
    date: "May 2023 - July 2023",
    description: "Developed machine learning models for predictive analytics and implemented natural language processing solutions for text classification.",
    achievements: [
      "Built a sentiment analysis model with 87% accuracy using BERT",
      "Developed a data preprocessing pipeline for unstructured text data",
      "Created visualizations to communicate model performance to stakeholders"
    ]
  },
  {
    jobtitle: "Data Science & ML Intern",
    where: "1Stop.ai",
    date: "Aug 2022 - Oct 2022",
    description: "Worked on data analysis and visualization projects, focusing on extracting insights from large datasets and building predictive models.",
    achievements: [
      "Analyzed customer data to identify patterns and trends",
      "Developed a recommendation system using collaborative filtering",
      "Created interactive dashboards for data visualization"
    ]
  },
  {
    jobtitle: "Research Assistant",
    where: "St Thomas Institution of Science and Technology",
    date: "Jan 2022 - May 2022",
    description: "Assisted in research on applying machine learning techniques to solve problems in healthcare domains.",
    achievements: [
      "Implemented image classification models for medical diagnostics",
      "Collaborated on a research paper on ML applications in healthcare",
      "Developed Python scripts for data collection and preprocessing"
    ]
  }
];

const skills = [
  {
    name: "Python",
    value: 90,
  },
  {
    name: "TensorFlow & Keras",
    value: 85,
  },
  {
    name: "Scikit-learn",
    value: 80,
  },
  {
    name: "Data Preprocessing",
    value: 85,
  },
  {
    name: "NLP",
    value: 75,
  },
  {
    name: "Deep Learning",
    value: 80,
  },
  {
    name: "SQL",
    value: 70,
  },
  {
    name: "Java",
    value: 65,
  },
  {
    name: "Git",
    value: 75,
  },
  {
    name: "Docker",
    value: 60,
  },
  {
    name: "Flask/FastAPI",
    value: 65,
  },
  {
    name: "Data Visualization",
    value: 80,
  },
];

const services = [
  {
    title: "Machine Learning Solutions",
    description: "Custom machine learning models for classification, regression, clustering, and time series forecasting tailored to your specific business needs.",
  },
  {
    title: "Natural Language Processing",
    description: "Text analysis, sentiment detection, named entity recognition, topic modeling, and chatbot development for understanding and leveraging textual data.",
  },
  {
    title: "Data Engineering & ETL",
    description: "Building robust data pipelines for collecting, cleaning, transforming, and storing data to enable effective analytics and machine learning applications.",
  },
  {
    title: "AI Consultation",
    description: "Strategic advice on implementing AI in your organization, identifying opportunities for automation, and selecting the right technologies for your goals.",
  },
];

// FILE: src/content_option.js (continued)

const dataportfolio = [
  {
    title: "Be My Chef AI",
    description: "AI-Powered Recipe Recommendation System using OCR and NLP",
    img: "https://via.placeholder.com/600x400?text=Be+My+Chef+AI",
    link: "https://github.com/GaneshAdimalupu/be-my-chef-ai",
    githubLink: "https://github.com/GaneshAdimalupu/be-my-chef-ai",
    categories: ["AI", "Machine Learning", "NLP", "Computer Vision"],
    technologies: [
      "Python",
      "TensorFlow",
      "OCR",
      "NLP",
      "Image Processing",
      "Flask"
    ],
    fullDescription: "An intelligent food assistant that recommends personalized recipes based on available ingredients detected through image recognition. The system uses OCR to extract text from images of ingredients, NLP to understand user preferences and dietary restrictions, and a recommendation engine to suggest relevant recipes. Features include ingredient detection from photos, personalized recommendations, and user profiles for tracking preferences."
  },
  {
    title: "Smart Lift Access Control System",
    description: "RFID-based access control system with mobile app integration",
    img: "https://via.placeholder.com/600x400?text=Smart+Lift+System",
    link: "https://github.com/GaneshAdimalupu/smart-lift-control",
    githubLink: "https://github.com/GaneshAdimalupu/smart-lift-control",
    categories: ["IoT", "Mobile Development", "Flutter"],
    technologies: [
      "Flutter",
      "Dart",
      "RFID",
      "Firebase",
      "Real-time Database",
      "Arduino"
    ],
    fullDescription: "A comprehensive elevator access control system that provides secure, contactless entry using RFID technology. The solution includes a mobile application for administrators to manage access permissions, monitor user activity, and generate security reports. The system features RFID card authentication, real-time user tracking, comprehensive access logs, and an admin dashboard for user management. This project combines hardware integration with software development to create a complete security solution."
  },
  {
    title: "ML Model Performance Analyzer",
    description: "Tool for evaluating and visualizing machine learning model metrics",
    img: "https://via.placeholder.com/600x400?text=ML+Analyzer",
    link: "https://github.com/GaneshAdimalupu/ml-model-analyzer",
    githubLink: "https://github.com/GaneshAdimalupu/ml-model-analyzer",
    categories: ["AI", "Machine Learning", "Data Visualization"],
    technologies: [
      "Python",
      "Scikit-learn",
      "Matplotlib",
      "Pandas",
      "Jupyter Notebook",
      "Seaborn"
    ],
    fullDescription: "A comprehensive toolkit for data scientists to analyze and compare machine learning model performance. The tool automates the calculation of various performance metrics, generates interactive visualizations of confusion matrices, ROC curves, and precision-recall curves, performs feature importance analysis, and provides functionality for comparing multiple models. It streamlines the model evaluation process and helps data scientists make informed decisions about model selection and optimization."
  },
  {
    title: "Sentiment Analysis for Product Reviews",
    description: "NLP system for analyzing customer sentiment in product reviews",
    img: "https://via.placeholder.com/600x400?text=Sentiment+Analysis",
    link: "https://github.com/GaneshAdimalupu/sentiment-analysis",
    githubLink: "https://github.com/GaneshAdimalupu/sentiment-analysis",
    categories: ["NLP", "Machine Learning", "Data Analysis"],
    technologies: [
      "Python",
      "NLTK",
      "Transformers",
      "BERT",
      "Pandas",
      "Flask"
    ],
    fullDescription: "A sophisticated natural language processing system that analyzes customer reviews to extract sentiment, key topics, and actionable insights. The solution uses BERT-based models for context-aware sentiment analysis, topic modeling to identify common themes, and aspect-based sentiment analysis to provide detailed insights about specific product features. The system includes a user-friendly dashboard for visualizing sentiment trends over time and comparing products or features."
  },
  {
    title: "Healthcare Data Analysis Platform",
    description: "Platform for analyzing healthcare data to improve patient outcomes",
    img: "https://via.placeholder.com/600x400?text=Healthcare+Analysis",
    link: "https://github.com/GaneshAdimalupu/healthcare-analytics",
    githubLink: "https://github.com/GaneshAdimalupu/healthcare-analytics",
    categories: ["Data Analysis", "Machine Learning", "Healthcare"],
    technologies: [
      "Python",
      "TensorFlow",
      "SQL",
      "Tableau",
      "Scikit-learn",
      "Flask"
    ],
    fullDescription: "A comprehensive platform for healthcare providers to analyze patient data, predict outcomes, and identify opportunities for improving care. The system includes predictive models for patient readmission risk, length of stay estimation, and treatment effectiveness analysis. Features include data integration from multiple sources, interactive dashboards for visualizing key metrics, and automated reporting for tracking progress over time. The platform adheres to HIPAA compliance standards for secure handling of sensitive healthcare data."
  },
  {
    title: "Smart Agriculture Monitoring System",
    description: "IoT-based system for monitoring and optimizing agricultural conditions",
    img: "https://via.placeholder.com/600x400?text=Smart+Agriculture",
    link: "https://github.com/GaneshAdimalupu/smart-agriculture",
    githubLink: "https://github.com/GaneshAdimalupu/smart-agriculture",
    categories: ["IoT", "Machine Learning", "Agriculture"],
    technologies: [
      "Python",
      "TensorFlow",
      "Raspberry Pi",
      "Arduino",
      "MQTT",
      "React"
    ],
    fullDescription: "An intelligent agriculture system that uses IoT sensors to monitor soil moisture, temperature, humidity, and other environmental factors. The solution includes machine learning models for predicting optimal irrigation schedules, detecting plant diseases from images, and forecasting crop yields. The system features a mobile and web application for farmers to monitor conditions remotely, receive alerts about potential issues, and get recommendations for optimizing crop growth. This project combines hardware sensors with data analytics to improve agricultural efficiency and sustainability."
  }
];

const contactConfig = {
  YOUR_EMAIL: "ganeshjohn253@gmail.com",
  YOUR_FONE: "+91 6303205936",
  description: "I'm always open to discussing new projects, opportunities in AI/ML research, or potential collaborations. Feel free to reach out if you have questions about my work or how AI solutions could benefit your organization.",
  YOUR_SERVICE_ID: "service_id",
  YOUR_TEMPLATE_ID: "template_id",
  YOUR_USER_ID: "user_id",
};

const socialprofils = {
  github: "https://github.com/GaneshAdimalupu",
  linkedin: "https://linkedin.com/in/ganesh-adimalupu-62b407239",
  twitter: "https://twitter.com/GaneshAdimalupu",
  facebook: "https://facebook.com",
  medium: "https://medium.com/@ganeshjohn253",
  stackoverflow: "https://stackoverflow.com/users/12345678/ganesh-adimalupu",
  kaggle: "https://www.kaggle.com/ganeshadimalupu"
};

// For use in Blog section
const blogPosts = [
  {
    title: "Understanding Neural Networks: A Beginner's Guide",
    excerpt: "Neural networks are the foundation of deep learning. This post explains the basics of how they work and why they're so powerful for AI applications.",
    category: "Deep Learning",
    date: "May 15, 2023",
    image: "https://via.placeholder.com/600x400?text=Neural+Networks",
    link: "/blog/understanding-neural-networks"
  },
  {
    title: "5 Python Libraries Every Data Scientist Should Know",
    excerpt: "Python has become the dominant language for data science. Here are the essential libraries that will boost your productivity and capabilities.",
    category: "Data Science",
    date: "Apr 22, 2023",
    image: "https://via.placeholder.com/600x400?text=Python+Libraries",
    link: "/blog/python-libraries-data-science"
  },
  {
    title: "Building a Recommendation System with TensorFlow",
    excerpt: "Learn how to create a personalized recommendation system using collaborative filtering techniques with TensorFlow and Matrix Factorization.",
    category: "Machine Learning",
    date: "Mar 10, 2023",
    image: "https://via.placeholder.com/600x400?text=Recommendation+System",
    link: "/blog/recommendation-system-tensorflow"
  },
  {
    title: "The Ethics of AI: Challenges and Considerations",
    excerpt: "As AI becomes more prevalent in our society, it's crucial to address the ethical implications. This post explores key ethical challenges in AI development.",
    category: "AI Ethics",
    date: "Feb 18, 2023",
    image: "https://via.placeholder.com/600x400?text=AI+Ethics",
    link: "/blog/ethics-of-ai"
  },
  {
    title: "Data Preprocessing Techniques for Machine Learning",
    excerpt: "Good data preprocessing is essential for successful machine learning models. This article covers key techniques to prepare your data for training.",
    category: "Data Science",
    date: "Jan 05, 2023",
    image: "https://via.placeholder.com/600x400?text=Data+Preprocessing",
    link: "/blog/data-preprocessing-techniques"
  },
  {
    title: "Transfer Learning in Computer Vision",
    excerpt: "Transfer learning allows us to leverage pre-trained models for new tasks. Learn how to apply this powerful technique to computer vision problems.",
    category: "Computer Vision",
    date: "Dec 12, 2022",
    image: "https://via.placeholder.com/600x400?text=Transfer+Learning",
    link: "/blog/transfer-learning-computer-vision"
  }
];

// Education details
const education = [
  {
    degree: "Bachelor of Technology - BTech, Computer Science",
    institution: "St Thomas Institution of Science and Technology",
    location: "Kerala, India",
    period: "2021 - 2025",
    description: "Focused on core computer science subjects along with specialized courses in machine learning, artificial intelligence, and data structures. Participated in research projects and technical competitions."
  },
  {
    degree: "Higher Secondary School, Mathematics",
    institution: "Narayana Junior College",
    location: "India",
    period: "2019 - 2021",
    description: "Specialized in Mathematics, Physics, and Computer Science. Ranked in the top 5% of students in state-level examinations."
  },
  {
    degree: "Secondary School Certificate",
    institution: "Christu Jyothi High School",
    location: "India",
    period: "2019",
    description: "Completed secondary education with distinction in Mathematics and Science."
  }
];

// Certifications
const certifications = [
  {
    title: "AI & ML Internship Certificate",
    issuer: "HDLC Info Technologies",
    date: "Jul 2023",
    link: "#"
  },
  {
    title: "Data Science & ML Internship",
    issuer: "Devtown",
    date: "Oct 2022",
    link: "#"
  },
  {
    title: "Artificial Intelligence Program",
    issuer: "TIITG",
    date: "Aug 2022",
    link: "#"
  },
  {
    title: "Android App Development",
    issuer: "STIST",
    date: "Apr 2022",
    link: "#"
  },
  {
    title: "Machine Learning in Python & R",
    issuer: "Udemy",
    date: "Jan 2022",
    link: "#"
  },
  {
    title: "Automated ML with Google AutoML & Apple CreateML",
    issuer: "Udemy",
    date: "Nov 2021",
    link: "#"
  },
  {
    title: "Deep Learning Specialization",
    issuer: "Coursera",
    date: "Sep 2021",
    link: "#"
  },
  {
    title: "TensorFlow Developer Certificate",
    issuer: "Google",
    date: "Jul 2021",
    link: "#"
  }
];

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
  blogPosts,
  education,
  certifications
};
