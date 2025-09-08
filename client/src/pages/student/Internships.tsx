import { Search, MapPin, Clock, DollarSign } from 'lucide-react';

export default function Internships() {
  const internships = [
    {
      id: 1,
      title: 'Software Engineering Intern',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      type: 'Remote friendly',
      duration: '12 weeks',
      pay: '$25/hour',
      posted: '2 days ago',
      description: 'Join our engineering team to work on cutting-edge web applications using React, Node.js, and cloud technologies. Perfect opportunity for computer science students looking to gain real-world experience.',
      skills: ['React', 'Node.js', 'AWS', 'TypeScript']
    },
    {
      id: 2,
      title: 'UX/UI Design Intern',
      company: 'Creative Studio',
      location: 'New York, NY',
      type: 'Hybrid',
      duration: '10 weeks',
      pay: '$22/hour',
      posted: '1 week ago',
      description: 'Work alongside our design team to create beautiful and intuitive user experiences for mobile and web applications. Great opportunity to build your design portfolio.',
      skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping']
    },
    {
      id: 3,
      title: 'Data Science Intern',
      company: 'DataCorp Analytics',
      location: 'Austin, TX',
      type: 'On-site',
      duration: '14 weeks',
      pay: '$28/hour',
      posted: '3 days ago',
      description: 'Analyze large datasets and build predictive models to drive business insights. Experience with Python, SQL, and machine learning frameworks preferred.',
      skills: ['Python', 'SQL', 'Machine Learning', 'Pandas']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <p className="text-ink-500 mb-8">Find the perfect internship to kickstart your career journey.</p>
      
      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-card p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-300 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search internships..." 
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sun-500 focus:border-transparent transition-custom"
              data-testid="input-search-internships"
            />
          </div>
          <select 
            className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sun-500 transition-custom"
            data-testid="select-industry"
          >
            <option value="">All Industries</option>
            <option value="technology">Technology</option>
            <option value="finance">Finance</option>
            <option value="healthcare">Healthcare</option>
            <option value="marketing">Marketing</option>
          </select>
          <select 
            className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sun-500 transition-custom"
            data-testid="select-location"
          >
            <option value="">Remote/On-site</option>
            <option value="remote">Remote</option>
            <option value="onsite">On-site</option>
            <option value="hybrid">Hybrid</option>
          </select>
          <button 
            className="bg-ink-900 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-custom font-semibold"
            data-testid="button-search"
          >
            Search
          </button>
        </div>
      </div>
      
      {/* Internship Listings */}
      <div className="grid gap-6">
        {internships.map((internship) => (
          <div key={internship.id} className="bg-white rounded-2xl shadow-card p-6 hover:shadow-lg transition-all duration-200 card-hover">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-neutral-100 rounded-xl flex items-center justify-center">
                  <div className="w-8 h-8 bg-sun-500 rounded"></div>
                </div>
                <div>
                  <h3 className="text-xl font-display font-semibold text-ink-900" data-testid={`text-title-${internship.id}`}>
                    {internship.title}
                  </h3>
                  <p className="text-ink-500" data-testid={`text-company-${internship.id}`}>
                    {internship.company} • {internship.location}
                  </p>
                  <p className="text-sm text-ink-300 mt-1">Posted {internship.posted}</p>
                </div>
              </div>
              <button className="bg-sun-100 text-ink-900 px-4 py-2 rounded-lg hover:bg-sun-300 transition-custom font-semibold" data-testid={`button-apply-${internship.id}`}>
                Apply Now
              </button>
            </div>
            
            <p className="text-ink-700 mb-4" data-testid={`text-description-${internship.id}`}>
              {internship.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {internship.skills.map((skill) => (
                <span key={skill} className="bg-neutral-100 text-ink-700 px-3 py-1 rounded-full text-sm" data-testid={`skill-${skill.toLowerCase()}`}>
                  {skill}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between text-sm text-ink-500">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {internship.duration}
                </span>
                <span className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  {internship.pay}
                </span>
              </div>
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {internship.type}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center mt-8">
        <button className="bg-white text-ink-900 border border-slate-300 px-6 py-3 rounded-lg hover:bg-neutral-25 transition-custom font-semibold" data-testid="button-load-more">
          Load More Internships
        </button>
      </div>
    </div>
  );
}
