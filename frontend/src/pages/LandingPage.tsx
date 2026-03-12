import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Zap, 
  TrendingUp, 
  Users, 
  ArrowRight,
  CheckCircle,
  Star,
  Brain,
  Target,
  Clock,
  Shield,
  Sparkles,
  LineChart,
  ChevronDown,
  ChevronUp,
  Quote
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Header */}
      <header className="fixed w-full bg-white/90 backdrop-blur-md shadow-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-2 rounded-xl">
                <Briefcase className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-700 to-primary-900 bg-clip-text text-transparent">
                TalentAI
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="btn-ghost hidden sm:inline-flex">
                Login
              </Link>
              <Link to="/register" className="btn-primary inline-flex items-center">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[95vh] flex items-center">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 -z-10"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        
        {/* Floating Profile Cards */}
        <div className="absolute top-28 left-8 lg:left-20 animate-float hidden lg:block" style={{animationDelay: '0s'}}>
          <div className="bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-gray-100">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
              MA
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-sm">Tushar Garad</div>
              <div className="text-xs text-gray-500">Product Designer</div>
              <div className="text-xs text-gray-400 mt-1">Start May 12, 2025</div>
            </div>
            <div className="flex gap-1 ml-2">
              <div className="w-4 h-4 bg-red-500 rounded-sm flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">M</span>
              </div>
              <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">in</span>
              </div>
              <div className="w-4 h-4 bg-gradient-to-br from-pink-500 to-orange-500 rounded-sm"></div>
            </div>
          </div>
        </div>

        <div className="absolute top-28 right-8 lg:right-20 animate-float hidden lg:block" style={{animationDelay: '1s'}}>
          <div className="bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-gray-100">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
              MA
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-sm">Mayur Naikwade</div>
              <div className="text-xs text-gray-500">Product Manager</div>
              <div className="text-xs text-gray-400 mt-1">Start May 12, 2025</div>
            </div>
            <div className="flex gap-1 ml-2">
              <div className="w-4 h-4 bg-red-500 rounded-sm flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">M</span>
              </div>
              <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">in</span>
              </div>
              <div className="w-4 h-4 bg-gradient-to-br from-pink-500 to-orange-500 rounded-sm"></div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-12 lg:left-32 animate-float hidden lg:block" style={{animationDelay: '2.5s'}}>
          <div className="bg-gray-900 rounded-2xl shadow-xl p-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-white font-bold text-xs">
              VM
            </div>
            <div>
              <div className="font-semibold text-white text-sm">Vinco Marconzo</div>
              <div className="text-xs text-gray-300">Human Resources</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 right-16 lg:right-32 animate-float hidden lg:block" style={{animationDelay: '1.5s'}}>
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl shadow-xl p-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-xs">
              RW
            </div>
            <div>
              <div className="font-semibold text-white text-sm">Robert Williamson</div>
              <div className="text-xs text-teal-200">Head of HRD</div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 pt-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full mb-8 animate-fade-in">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold">AI-Powered Recruitment Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight animate-slide-up">
              Hire Smarter with
              <span className="block bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 bg-clip-text text-transparent">
                AI Intelligence
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Match top designers, developers, and product managers to your open roles instantly. 
              <span className="font-semibold text-primary-700"> Our AI analyzes skills and experience to find your perfect hire 10x faster.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/register" className="btn-primary text-lg inline-flex items-center justify-center group">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="bg-gray-900 hover:bg-gray-800 text-white px-10 py-4 rounded-xl font-bold text-lg inline-flex items-center justify-center shadow-lg transition-all duration-300">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                </svg>
                Watch Demo
              </button>
            </div>
            
            {/* Stats - with white background */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8 max-w-2xl mx-auto">
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <div className="text-4xl font-bold text-primary-700">10x</div>
                  <div className="text-sm text-gray-600 mt-1">Faster Hiring</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary-700">95%</div>
                  <div className="text-sm text-gray-600 mt-1">Match Accuracy</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary-700">500+</div>
                  <div className="text-sm text-gray-600 mt-1">Companies Trust Us</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-4">
              Powerful Features Built for Modern Hiring
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to transform your recruitment process from good to exceptional
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="h-8 w-8" />}
              title="AI Resume Analysis"
              description="Advanced natural language processing extracts skills, experience, and qualifications from any resume format instantly."
              gradient="from-primary-500 to-primary-700"
            />
            <FeatureCard
              icon={<Target className="h-8 w-8" />}
              title="Smart Candidate Matching"
              description="Our AI scores and ranks every applicant based on job requirements, ensuring you see the best fits first."
              gradient="from-accent-500 to-accent-700"
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8" />}
              title="Dynamic Application Forms"
              description="AI automatically generates custom forms tailored to each job posting, collecting exactly the data you need."
              gradient="from-purple-500 to-purple-700"
            />
            <FeatureCard
              icon={<TrendingUp className="h-8 w-8" />}
              title="Real-Time Rankings"
              description="Watch candidate scores update live as applications come in. Sort, filter, and compare with ease."
              gradient="from-pink-500 to-pink-700"
            />
            <FeatureCard
              icon={<Clock className="h-8 w-8" />}
              title="Time-Saving Automation"
              description="Reduce screening time by 90%. Let AI handle the heavy lifting while you focus on interviewing top talent."
              gradient="from-orange-500 to-orange-700"
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title="Bias-Free Hiring"
              description="AI focuses purely on skills and qualifications, promoting fair and objective candidate evaluation."
              gradient="from-green-500 to-green-700"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              From job posting to perfect hire in three seamless steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting Lines */}
            <div className="hidden md:block absolute top-20 left-1/4 right-1/4 h-1 bg-gradient-to-r from-primary-300 via-accent-300 to-primary-300"></div>
            
            <StepCard
              step={1}
              title="Post Your Job"
              description="Create a detailed job listing with requirements, skills, and qualifications. Our AI instantly generates a custom application form optimized for the role."
              icon={<Briefcase className="h-6 w-6" />}
            />
            <StepCard
              step={2}
              title="AI Analyzes Applications"
              description="As candidates apply, our AI reads their resumes, extracts key information, and scores them against your job criteria in real-time."
              icon={<Brain className="h-6 w-6" />}
            />
            <StepCard
              step={3}
              title="Review Top Matches"
              description="See candidates automatically ranked from best to good fit. Review detailed match scores and make confident hiring decisions faster."
              icon={<CheckCircle className="h-6 w-6" />}
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-black text-gray-900 mb-6">
                Why Leading Companies Choose TalentAI
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join hundreds of forward-thinking companies that have revolutionized their hiring process with our AI platform.
              </p>
              
              <div className="space-y-6">
                <BenefitItem 
                  icon={<LineChart className="h-6 w-6" />}
                  title="Reduce Time-to-Hire by 70%"
                  description="Spend minutes instead of hours screening candidates. Our AI does the heavy lifting."
                />
                <BenefitItem 
                  icon={<Users className="h-6 w-6" />}
                  title="Improve Candidate Quality"
                  description="AI matching ensures you interview only the most qualified candidates for each role."
                />
                <BenefitItem 
                  icon={<Sparkles className="h-6 w-6" />}
                  title="Enhance Candidate Experience"
                  description="Smart forms and fast responses create a professional, modern application process."
                />
              </div>
              
              <Link to="/register" className="btn-primary mt-8 inline-flex items-center">
                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            
            <div className="relative">
              <div className="card-glass p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                        98
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Sarah Johnson</div>
                        <div className="text-sm text-gray-600">Senior Developer</div>
                      </div>
                    </div>
                    <div className="badge badge-success">Perfect Match</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        94
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Mike Chen</div>
                        <div className="text-sm text-gray-600">Full Stack Engineer</div>
                      </div>
                    </div>
                    <div className="badge badge-info">Great Match</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl opacity-60">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                        76
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Alex Rivera</div>
                        <div className="text-sm text-gray-600">Junior Developer</div>
                      </div>
                    </div>
                    <div className="badge">Good Match</div>
                  </div>
                </div>
                
                <div className="mt-6 text-center text-sm text-gray-600">
                  <Zap className="h-4 w-4 inline text-primary-600" /> AI ranked 47 candidates in 3.2 seconds
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-900 to-primary-950 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4">
              Loved by Hiring Teams Everywhere
            </h2>
            <p className="text-xl text-primary-200">
              Don't just take our word for it - hear from recruiters who've transformed their hiring
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="TalentAI cut our screening time by 80%. We're now interviewing better candidates and filling positions twice as fast."
              author="Jessica Martinez"
              role="Head of Talent Acquisition"
              company="TechCorp Inc."
            />
            <TestimonialCard
              quote="The AI matching is incredibly accurate. It's like having an expert recruiter working 24/7, but faster and more consistent."
              author="David Park"
              role="HR Director"
              company="StartupHub"
            />
            <TestimonialCard
              quote="Game-changer for our small team. We can now compete with big companies for top talent without a massive HR department."
              author="Emily Turner"
              role="Founder & CEO"
              company="GrowthLabs"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about TalentAI
            </p>
          </div>
          
          <div className="space-y-4">
            <FAQItem
              question="How does the AI candidate ranking work?"
              answer="Our AI uses advanced natural language processing to analyze resumes and extract key information like skills, experience, education, and qualifications. It then compares this data against your job requirements and generates a match score (0-100) for each candidate. The algorithm considers multiple factors including skill matches, experience level, education requirements, and keyword relevance to provide accurate rankings."
            />
            <FAQItem
              question="Is my candidate data secure and private?"
              answer="Absolutely. We take data security seriously with enterprise-grade encryption, secure cloud storage, and GDPR compliance. All candidate information is encrypted at rest and in transit. We never share or sell your data to third parties, and you maintain full control over who can access candidate information in your organization."
            />
            <FAQItem
              question="How long does it take to set up and start using TalentAI?"
              answer="You can start in minutes! Simply sign up, create your first job posting with requirements, and our AI automatically generates an application form. Share the job link with candidates, and the AI starts analyzing applications immediately as they come in. No complex setup or training required."
            />
            <FAQItem
              question="Can I customize the application forms?"
              answer="Yes! While our AI generates smart forms automatically based on your job description, you have full control to add, remove, or modify questions. You can include custom fields, screening questions, and additional requirements specific to your company or role."
            />
            <FAQItem
              question="What file formats do you support for resumes?"
              answer="TalentAI supports all common resume formats including PDF, DOC, DOCX, and even plain text. Our AI is trained to extract information accurately from various layouts and formatting styles, whether they're traditional chronological resumes, modern designs, or creative formats."
            />
            <FAQItem
              question="Do you offer team collaboration features?"
              answer="Yes! Multiple team members can access the same job postings and candidates. You can leave notes, ratings, and comments on applications, schedule interviews, and track the hiring pipeline collaboratively. Role-based permissions ensure team members see only what they need."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bTAgMGMwLTIuMjA5LTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            Ready to Hire Smarter?
          </h2>
          <p className="text-xl md:text-2xl text-primary-100 mb-10 max-w-2xl mx-auto">
            Join 500+ companies using AI to find perfect talent faster. Start your free trial today - no credit card required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-primary-700 px-10 py-5 rounded-xl font-bold text-lg inline-flex items-center justify-center hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:-translate-y-1 group">
              Start Free Trial
              <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="bg-primary-800 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-primary-900 transition-all duration-300 border-2 border-primary-500">
              Contact Sales
            </button>
          </div>
          
          <div className="mt-10 text-primary-100 text-sm">
            ✓ Free 14-day trial &nbsp;&nbsp; ✓ No credit card required &nbsp;&nbsp; ✓ Cancel anytime
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-2 rounded-xl">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">TalentAI</span>
              </div>
              <p className="text-sm text-gray-400">
                AI-powered recruitment platform helping companies hire smarter and faster.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2026 TalentAI. All rights reserved. Built with ❤️ for better hiring.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Component: Feature Card
const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}> = ({ icon, title, description, gradient }) => {
  return (
    <div className="card-hover group">
      <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${gradient} text-white rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

// Component: Step Card
const StepCard: React.FC<{
  step: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}> = ({ step, title, description, icon }) => {
  return (
    <div className="relative">
      <div className="card text-center relative z-10">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-2xl mb-6 text-3xl font-black shadow-xl">
          {step}
        </div>
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-700 rounded-xl mb-4">
          {icon}
        </div>
        <h3 className="text-2xl font-bold mb-3 text-gray-900">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

// Component: Benefit Item
const BenefitItem: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-12 h-12 bg-primary-100 text-primary-700 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h4 className="text-lg font-bold text-gray-900 mb-1">{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

// Component: Testimonial Card
const TestimonialCard: React.FC<{
  quote: string;
  author: string;
  role: string;
  company: string;
}> = ({ quote, author, role, company }) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
      <Quote className="h-10 w-10 text-primary-300 mb-4" />
      <p className="text-lg text-white mb-6 leading-relaxed">{quote}</p>
      <div className="flex items-center gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <div className="font-semibold text-white">{author}</div>
      <div className="text-sm text-primary-200">{role}, {company}</div>
    </div>
  );
};

// Component: FAQ Item
const FAQItem: React.FC<{
  question: string;
  answer: string;
}> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-primary-300 transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-8 py-6 flex justify-between items-center text-left hover:bg-primary-50 transition-colors duration-300"
      >
        <span className="text-lg font-semibold text-gray-900 pr-8">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-6 w-6 text-primary-600 flex-shrink-0" />
        ) : (
          <ChevronDown className="h-6 w-6 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-8 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
          {answer}
        </div>
      )}
    </div>
  );
};
