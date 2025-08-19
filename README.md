# MemberHub - Church Member Management System

A modern, responsive web application for managing church members across multiple locations. Built with FastAPI backend and React frontend.

![MemberHub Dashboard](https://via.placeholder.com/800x400?text=MemberHub+Dashboard)

## 🚀 Features

### 📊 Dashboard & Analytics
- **Comprehensive Dashboard** with member statistics and growth metrics
- **Interactive Charts** showing demographics, age distribution, and trends
- **Church Performance** rankings and engagement metrics
- **Real-time Analytics** with member activity tracking

### 👥 Member Management
- **Complete CRUD Operations** for member records
- **Photo Upload** support for member profiles
- **Multi-Church Support** for different locations
- **Advanced Filtering** by church, gender, and other criteria

### 📱 Responsive Design
- **Mobile-First** approach with touch-friendly interface
- **Adaptive Sidebar** that collapses on mobile devices
- **Touch Gestures** for mobile navigation
- **Cross-Device** compatibility

### 🏛️ Multi-Church Architecture
- Support for multiple church locations:
  - Suphan Buri
  - Kanchanaburi 
  - Uthai Thani
  - Sing Buri

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - Database ORM
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server
- **Python 3.8+**

### Frontend
- **React 18** - User interface library
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Data visualization
- **React Router** - Client-side routing
- **Axios** - HTTP client

## 📦 Installation

### Prerequisites
- **Python 3.8+**
- **Node.js 16+** 
- **npm or yarn**

### Backend Setup

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/memberhub.git
   cd memberhub
   \`\`\`

2. **Create Python virtual environment**
   \`\`\`bash
   python -m venv .venv
   \`\`\`

3. **Activate virtual environment**
   \`\`\`bash
   # Windows
   .venv\\Scripts\\activate
   
   # macOS/Linux
   source .venv/bin/activate
   \`\`\`

4. **Install Python dependencies**
   \`\`\`bash
   pip install fastapi uvicorn sqlalchemy pydantic python-multipart
   \`\`\`

5. **Start the backend server**
   \`\`\`bash
   cd backend
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   \`\`\`

### Frontend Setup

1. **Install Node.js dependencies**
   \`\`\`bash
   cd frontend
   npm install
   \`\`\`

2. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

### 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 📁 Project Structure

\`\`\`
memberhub/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application
│   │   ├── schemas.py           # Pydantic models
│   │   ├── db/
│   │   │   ├── database.py      # Database configuration
│   │   │   └── models.py        # SQLAlchemy models
│   │   └── services/
│   │       └── crud.py          # Database operations
│   └── static/                  # Static files
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Sidebar.jsx      # Navigation sidebar
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx    # Main dashboard
│   │   │   └── Members.jsx      # Member management
│   │   ├── services/
│   │   │   └── api.js           # API client
│   │   ├── App.jsx              # Root component
│   │   └── main.jsx             # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
\`\`\`

## 🔧 API Endpoints

### Members
- \`GET /api/members/\` - Get all members
- \`POST /api/members/\` - Create new member
- \`GET /api/members/{id}\` - Get member by ID
- \`PUT /api/members/{id}\` - Update member
- \`DELETE /api/members/{id}\` - Delete member

### File Upload
- \`POST /api/members/{id}/upload\` - Upload member photo

## 🎨 Key Components

### Dashboard Features
- **Executive Summary** with key metrics
- **Action Required** section for member follow-ups
- **Opportunities** for engagement and recognition
- **Church Performance** rankings
- **Demographics** with interactive charts
- **Recent Activity** and member growth trends

### Responsive Sidebar
- **Collapsible** design for different screen sizes
- **Touch gestures** for mobile devices
- **Tooltips** for collapsed state
- **Smooth animations** and transitions

## 🚀 Deployment

### Development
Both servers support hot-reload for development:
- Backend: Changes to Python files auto-restart the server
- Frontend: Vite provides instant updates for React components

### Production
For production deployment:
1. Build the frontend: \`npm run build\`
2. Configure environment variables
3. Use a production ASGI server like Gunicorn
4. Set up a reverse proxy (Nginx)
5. Configure SSL certificates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **FastAPI** for the excellent Python web framework
- **React** team for the powerful UI library
- **Tailwind CSS** for the utility-first CSS framework
- **Chart.js** for beautiful data visualizations

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team

---

**MemberHub** - Empowering churches with modern member management tools 🏛️✨
