import {
  Github,
  Twitter,
  Mail,
  MapPin,
  Calendar,
  Code,
  Server,
  Database,
  Smartphone,
  Shield,
  Zap,
  Award,
  Heart,
  Star,
  ExternalLink
} from 'lucide-react';

export default function AboutPage() {
  const technologies = [
    { name: 'React', description: 'Modern UI framework for building interactive interfaces', icon: Code },
    { name: 'TypeScript', description: 'Type-safe JavaScript for better development experience', icon: Code },
    { name: 'Hono', description: 'Lightweight web framework for Cloudflare Workers', icon: Server },
    { name: 'Cloudflare D1', description: 'Serverless SQLite database for global scale', icon: Database },
    { name: 'Tailwind CSS', description: 'Utility-first CSS framework for rapid styling', icon: Smartphone },
    { name: 'Cloudflare Workers', description: 'Edge computing platform for global performance', icon: Shield }
  ];

  const features = [
    {
      title: 'YouTube Video Embedding',
      description: 'Secure integration with YouTube\'s official embed system for safe video streaming',
      icon: Code,
      color: 'text-red-500'
    },
    {
      title: 'External Link Directory',
      description: 'Curated collection of external resources with security validation',
      icon: ExternalLink,
      color: 'text-blue-500'
    },
    {
      title: 'Advanced Search & Filtering',
      description: 'Powerful search capabilities with category, tag, and content type filters',
      icon: Zap,
      color: 'text-yellow-500'
    },
    {
      title: 'Content Moderation',
      description: 'AI-powered admin panel for reviewing and managing user submissions',
      icon: Shield,
      color: 'text-green-500'
    },
    {
      title: 'Responsive Design',
      description: 'Optimized experience across desktop, tablet, and mobile devices',
      icon: Smartphone,
      color: 'text-purple-500'
    },
    {
      title: 'User Analytics',
      description: 'Comprehensive analytics and insights for content performance',
      icon: Award,
      color: 'text-orange-500'
    }
  ];

  const achievements = [
    { number: '50+', label: 'Features Implemented', icon: Star },
    { number: '100%', label: 'Security Compliant', icon: Shield },
    { number: '99.9%', label: 'Uptime Guarantee', icon: Zap },
    { number: '24/7', label: 'Support Available', icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
              alt="Roshan - Developer"
              className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-purple-500/50"
            />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Built by <span className="gradient-text">Roshan</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              StreamFlow is a cutting-edge video directory platform featuring YouTube integration,
              external link management, and AI-powered content moderation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a
              href="https://github.com/roshan"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-full transition-colors"
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </a>
            <a
              href="https://twitter.com/roshan"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-colors"
            >
              <Twitter className="w-5 h-5" />
              <span>Twitter</span>
            </a>
            <a
              href="mailto:roshan@streamflow.com"
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span>Contact</span>
            </a>
          </div>
        </div>
      </section>

      {/* About Developer */}
      <section className="py-16 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">About the Developer</h2>
              <div className="space-y-6 text-gray-300">
                <p className="text-lg leading-relaxed">
                  Hi, I'm Roshan, a passionate full-stack developer with expertise in modern web technologies
                  and cloud infrastructure. I specialize in building scalable, secure, and user-friendly applications
                  that solve real-world problems.
                </p>
                <p className="leading-relaxed">
                  StreamFlow represents my vision of a modern content directory platform that prioritizes security,
                  performance, and user experience. Built with cutting-edge technologies like Cloudflare Workers,
                  React, and TypeScript, it demonstrates best practices in web development.
                </p>
                <p className="leading-relaxed">
                  When I'm not coding, I enjoy contributing to open-source projects, writing technical articles,
                  and exploring new technologies that push the boundaries of what's possible on the web.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-purple-400 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">Location</span>
                  </div>
                  <p className="text-white">San Francisco, CA</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-blue-400 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Experience</span>
                  </div>
                  <p className="text-white">5+ Years</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Key Expertise</h3>
              <div className="space-y-4">
                {[
                  'Full-Stack Web Development',
                  'Cloud Infrastructure (Cloudflare, AWS)',
                  'React & TypeScript',
                  'API Design & Development',
                  'Database Architecture',
                  'Security & Performance Optimization'
                ].map((skill, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-300">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Platform Features</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              StreamFlow includes 50+ professional features designed for modern content management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-gray-900/50 rounded-xl p-6 hover:bg-gray-900/70 transition-all hover-glow">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center mb-4`}>
                    <IconComponent className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Technology Stack</h2>
            <p className="text-xl text-gray-400">
              Built with modern, industry-leading technologies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologies.map((tech, index) => {
              const IconComponent = tech.icon;
              return (
                <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all">
                  <div className="flex items-center space-x-3 mb-3">
                    <IconComponent className="w-6 h-6 text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">{tech.name}</h3>
                  </div>
                  <p className="text-gray-400 text-sm">{tech.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Project Achievements</h2>
            <p className="text-xl text-gray-400">
              Building excellence through innovation and dedication
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{achievement.number}</div>
                  <div className="text-gray-400">{achievement.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Let's Connect</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Interested in collaborating or have questions about StreamFlow?
            I'd love to hear from you and discuss how we can work together.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a
              href="mailto:roshan@streamflow.com"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all hover-glow flex items-center space-x-2"
            >
              <Mail className="w-5 h-5" />
              <span>Get in Touch</span>
            </a>
            <a
              href="https://github.com/roshan/streamflow"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all flex items-center space-x-2"
            >
              <Github className="w-5 h-5" />
              <span>View Source</span>
            </a>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-700">
            <p className="text-gray-400">
              © 2024 StreamFlow. Built with ❤️ by Roshan using cutting-edge web technologies.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
