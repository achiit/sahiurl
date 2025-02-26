# 🔗 SahiURL - Modern URL Shortener

<div align="center">
  <img src="public/logo.png" alt="SahiURL Logo" width="200"/>
  <p><strong>A powerful, modern, and feature-rich URL shortener built with Next.js 14</strong></p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
  [![Next.js](https://img.shields.io/badge/Next.js-14.0-black.svg)](https://nextjs.org/)
  [![Firebase](https://img.shields.io/badge/Firebase-10.x-orange.svg)](https://firebase.google.com/)
</div>

## ✨ Features

- **🚀 Modern Stack**: Built with Next.js 14, TypeScript, and Firebase
- **🎨 Beautiful UI**: Sleek design using Tailwind CSS and Shadcn UI
- **📊 Advanced Analytics**: Track clicks, locations, devices, and more
- **💰 Monetization Ready**: Built-in ad system and earning tracking
- **🔒 Secure**: Password protection for links
- **⚡ Fast**: Edge-ready with optimal performance
- **📱 Responsive**: Works perfectly on all devices
- **🌍 Custom Domains**: Support for custom domains
- **📈 Campaign Tracking**: Create and track marketing campaigns
- **🔍 SEO Optimized**: Best practices for search engines

## 🚀 Quick Start

1. **Clone the repository**
bash
git clone https://github.com/yourusername/sahiurl.git
cd sahiurl
2. **Install dependencies**
bash
npm install
or
yarn install

3. **Set up environment variables**
bash
cp .env.example .env.local
Edit `.env.local` with your Firebase credentials

4. **Run the development server**
bash
npm run dev
or
yarn dev

## 🏗️ Architecture

SahiURL follows a modern, scalable architecture:

mermaid
graph TD
A[Client] --> B[Next.js App Router]
B --> C[API Routes]
C --> D[Firebase Services]
D --> E[Firestore]
D --> F[Firebase Auth]
B --> G[Edge Functions]
G --> H[Link Redirection]
H --> I[Analytics Collection]

## 🔧 Tech Stack

- **Frontend**
  - Next.js 14
  - TypeScript
  - Tailwind CSS
  - Shadcn UI
  - Framer Motion

- **Backend**
  - Firebase Admin SDK
  - Firestore
  - Firebase Authentication

- **Infrastructure**
  - Vercel
  - Edge Functions
  - Firebase Cloud Platform

## 📚 Documentation

### Link Creation
typescript
POST /api/links/create
{
"originalUrl": "https://example.com",
"title": "My Link",
"customCode": "custom-url", // optional
"expiresAt": "2024-12-31", // optional
"password": "secretpass" // optional
}


### Analytics
Track comprehensive metrics including:
- Click counts
- Unique visitors
- Geographic data
- Device information
- Browser statistics
- Referrer tracking

## 🔐 Security Features

- **JWT Authentication**: Secure user sessions
- **Rate Limiting**: Prevent abuse
- **Input Validation**: Sanitize all user inputs
- **CORS Protection**: Configured security headers
- **Password Protection**: Optional link security

## 💻 Development

bash
Install dependencies
npm install
Run development server
npm run dev
Run tests
npm run test
Build for production
npm run build

## 🌟 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Vercel](https://vercel.com/)

## 📞 Support

For support, email support@sahiurl.in or join our [Discord community](https://discord.gg/sahiurl).

---

<div align="center">
  <p>Made with ❤️ by <a href="https://sahiurl.in">SahiURL Team</a></p>
</div>
