import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Search, MapPin, Briefcase, Users, Zap, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { jobService, JobPost } from '../../services/jobService'

export default function JobListingsPage() {
  const [jobs, setJobs] = useState<JobPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [selectedWorkLocation, setSelectedWorkLocation] = useState('all')
  const [selectedExperience, setSelectedExperience] = useState('all')
  const [salaryRange, setSalaryRange] = useState(90000)
  const [sortBy, setSortBy] = useState('lastPosted')
  const [scheduleFilters, setScheduleFilters] = useState({
    fullTime: true,
    partTime: true,
    projectWork: true,
    volunteering: false,
    internship: false
  })
  const [employmentFilters, setEmploymentFilters] = useState({
    fullDay: true,
    shiftWork: true,
    flexibleSchedule: true,
    distantWork: false,
    shiftMethod: false
  })
  const [levelFilters, setLevelFilters] = useState({
    trainee: false,
    junior: true,
    middle: true,
    senior: true,
    director: false
  })

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await jobService.getAllJobs({})
      setJobs(response.jobs)
    } catch (error) {
      toast.error('Failed to fetch jobs')
    } finally {
      setLoading(false)
    }
  }

  // Filter and sort jobs based on all criteria
  const filteredAndSortedJobs = useMemo(() => {
    let filtered = [...jobs]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.skillsRequired.some(skill => skill.toLowerCase().includes(query))
      )
    }

    // Location filter
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(selectedLocation.toLowerCase())
      )
    }

    // Experience level filter (from level checkboxes)
    const activeLevels = Object.entries(levelFilters)
      .filter(([_, isActive]) => isActive)
      .map(([level]) => level)
    
    if (activeLevels.length > 0 && activeLevels.length < Object.keys(levelFilters).length) {
      filtered = filtered.filter(job => {
        const jobLevel = job.experienceLevel.toLowerCase()
        return activeLevels.some(level => jobLevel.includes(level))
      })
    }

    // Salary filter (only show jobs within salary range)
    // Note: This assumes jobs have a salary field, otherwise skip this filter
    // filtered = filtered.filter(job => {
    //   if (job.salary) return job.salary <= salaryRange
    //   return true
    // })

    // Sorting
    if (sortBy === 'lastPosted') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (sortBy === 'salaryHigh') {
      // filtered.sort((a, b) => (b.salary || 0) - (a.salary || 0))
    } else if (sortBy === 'salaryLow') {
      // filtered.sort((a, b) => (a.salary || 0) - (b.salary || 0))
    } else if (sortBy === 'applicants') {
      filtered.sort((a, b) => (b._count?.applications || 0) - (a._count?.applications || 0))
    }

    return filtered
  }, [jobs, searchQuery, selectedLocation, levelFilters, salaryRange, sortBy])

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedLocation('all')
    setSelectedWorkLocation('all')
    setSelectedExperience('all')
    setSalaryRange(90000)
    setScheduleFilters({
      fullTime: true,
      partTime: true,
      projectWork: true,
      volunteering: false,
      internship: false
    })
    setEmploymentFilters({
      fullDay: true,
      shiftWork: true,
      flexibleSchedule: true,
      distantWork: false,
      shiftMethod: false
    })
    setLevelFilters({
      trainee: false,
      junior: true,
      middle: true,
      senior: true,
      director: false
    })
    toast.success('All filters cleared!')
  }

  const getCompanyIcon = (index: number) => {
    const colors = [
      'from-gray-800 to-gray-900',
      'from-blue-400 to-blue-500',
      'from-pink-500 to-pink-600',
      'from-yellow-500 to-yellow-600',
      'from-red-500 to-red-600',
      'from-purple-500 to-purple-600',
      'from-green-500 to-green-600',
      'from-orange-500 to-orange-600'
    ]
    return colors[index % colors.length]
  }

  const getJobTypeColor = (type: string) => {
    const types: Record<string, string> = {
      'Part time': 'bg-purple-100 text-purple-700',
      'Full time': 'bg-blue-100 text-blue-700',
      'Project work': 'bg-orange-100 text-orange-700',
      'Flexible': 'bg-green-100 text-green-700',
      'Sen 1:1': 'bg-pink-100 text-pink-700'
    }
    return types[type] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/candidate/dashboard" className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-6 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">Recommended jobs</h1>
              <p className="text-gray-600">Based on your profile and search history</p>
            </div>
            <div className="text-sm text-gray-500">{filteredAndSortedJobs.length} opportunities</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="grid md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && setSearchQuery(searchQuery)}
                  className="w-full pl-10 pr-10 py-3 border-none bg-gray-50 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="md:col-span-2">
              <select 
                value={selectedWorkLocation}
                onChange={(e) => setSelectedWorkLocation(e.target.value)}
                className="w-full px-4 py-3 border-none bg-gray-50 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none cursor-pointer"
              >
                <option value="all">Work location</option>
                <option value="remote">Remote</option>
                <option value="on-site">On-site</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <select 
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="w-full px-4 py-3 border-none bg-gray-50 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none cursor-pointer"
              >
                <option value="all">Experience</option>
                <option value="entry">Entry Level</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior</option>
              </select>
            </div>
            <div className="md:col-span-3">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select 
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-none bg-gray-50 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none cursor-pointer appearance-none"
                >
                  <option value="all">All Locations</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Pune">Pune</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Gurgaon">Gurgaon</option>
                  <option value="Noida">Noida</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
            </div>
            <div className="md:col-span-2">
              <button 
                onClick={clearAllFilters}
                className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary-500/30"
              >
                <Search className="h-5 w-5" />
                Search Jobs
              </button>
            </div>
          </div>
          
          {/* Salary Range Slider */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Maximum Salary</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">₹0</span>
                <span className="text-sm text-gray-400">-</span>
                <span className="text-sm font-semibold text-primary-600">₹{salaryRange.toLocaleString()}</span>
              </div>
            </div>
            <input 
              type="range" 
              min="0" 
              max="200000" 
              step="5000"
              value={salaryRange}
              onChange={(e) => setSalaryRange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
          </div>
          
          {/* Active Filters Display */}
          {(searchQuery || selectedLocation !== 'all' || selectedWorkLocation !== 'all' || selectedExperience !== 'all') && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2 items-center">
              <span className="text-sm font-semibold text-gray-700">Active filters:</span>
              {searchQuery && (
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium flex items-center gap-1">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="hover:text-primary-900">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedLocation !== 'all' && (
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium flex items-center gap-1">
                  Location: {selectedLocation}
                  <button onClick={() => setSelectedLocation('all')} className="hover:text-primary-900">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedWorkLocation !== 'all' && (
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium flex items-center gap-1">
                  Work: {selectedWorkLocation}
                  <button onClick={() => setSelectedWorkLocation('all')} className="hover:text-primary-900">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedExperience !== 'all' && (
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium flex items-center gap-1">
                  Experience: {selectedExperience}
                  <button onClick={() => setSelectedExperience('all')} className="hover:text-primary-900">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              <button 
                onClick={clearAllFilters}
                className="px-3 py-1 text-primary-600 hover:text-primary-700 text-xs font-semibold underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900">Details</h3>
                <button 
                  onClick={clearAllFilters}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear
                </button>
              </div>

              {/* Schedule */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Schedule</h4>
                <div className="space-y-2">
                  {Object.entries(scheduleFilters).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setScheduleFilters({...scheduleFilters, [key]: e.target.checked})}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Employment type */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Employment type</h4>
                <div className="space-y-2">
                  {Object.entries(employmentFilters).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setEmploymentFilters({...employmentFilters, [key]: e.target.checked})}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Professional level */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Professional level</h4>
                <div className="space-y-2">
                  {Object.entries(levelFilters).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setLevelFilters({...levelFilters, [key]: e.target.checked})}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 capitalize">{key} level</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Job Cards Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                <p className="text-gray-600 mt-4">Loading amazing opportunities...</p>
              </div>
            ) : filteredAndSortedJobs.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters</p>
                <button 
                  onClick={clearAllFilters}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-semibold text-primary-600">{filteredAndSortedJobs.length}</span> of <span className="font-semibold text-gray-900">{jobs.length}</span> jobs
                  </p>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white cursor-pointer"
                  >
                    <option value="lastPosted">Sort by: Last posted</option>
                    <option value="salaryHigh">Sort by: Salary (High to Low)</option>
                    <option value="salaryLow">Sort by: Salary (Low to High)</option>
                    <option value="applicants">Sort by: Most Applicants</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {filteredAndSortedJobs.map((job, index) => (
                    <div key={job.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 group hover:-translate-y-1">
                      {/* Company Icon & Date */}
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-14 h-14 bg-gradient-to-br ${getCompanyIcon(index)} rounded-2xl flex items-center justify-center shadow-lg`}>
                          {index % 4 === 0 && <Briefcase className="h-7 w-7 text-white" />}
                          {index % 4 === 1 && <Zap className="h-7 w-7 text-white" />}
                          {index % 4 === 2 && <Users className="h-7 w-7 text-white" />}
                          {index % 4 === 3 && <span className="text-white font-black text-xl">★</span>}
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-500">{new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>

                      {/* Job Title */}
                      <Link to={`/candidate/jobs/${job.id}`} className="block">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                          {job.title}
                        </h3>
                      </Link>

                      {/* Applicants count */}
                      <p className="text-sm text-gray-500 mb-3">{job._count?.applications || Math.floor(Math.random() * 50)} replies</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getJobTypeColor(index % 2 === 0 ? 'Full time' : 'Part time')}`}>
                          {index % 2 === 0 ? 'Full time' : 'Part time'}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getJobTypeColor('Flexible')}`}>
                          {job.experienceLevel}
                        </span>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-1 mb-3">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{job.location}</span>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {job.description}
                      </p>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <Link 
                          to={`/candidate/jobs/${job.id}/apply`}
                          className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-center px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg shadow-primary-500/30"
                        >
                          Apply
                        </Link>
                        <Link
                          to={`/candidate/jobs/${job.id}`}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 text-center px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promotional Card */}
                <div className="bg-gradient-to-br from-pink-500 via-red-500 to-orange-400 rounded-3xl shadow-2xl p-8 text-white overflow-hidden relative mt-8">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black mb-3">Ready to find your dream job?</h3>
                    <p className="text-white/90 mb-6 max-w-md">
                      Don't miss your opportunity to join amazing companies. Apply now and start your career journey!
                    </p>
                    <Link to="/register" className="inline-block bg-white text-pink-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-xl">
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
