import React from 'react';
import { BarChart3, Users, Film, Calendar, TrendingUp, ChevronUp, ChevronDown, DollarSign } from 'lucide-react';
import { movies, screenings, bookings, getPopularMovies } from '../../data/mockData';

const DashboardPage: React.FC = () => {
  // Get popular movies
  const popularMovies = getPopularMovies();
  
  // Calculate total revenue
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
  
  // Calculate seats sold percentage
  const totalSeats = screenings.reduce((sum, screening) => sum + screening.totalSeats, 0);
  const soldSeats = totalSeats - screenings.reduce((sum, screening) => sum + screening.seatsAvailable, 0);
  const occupancyRate = Math.round((soldSeats / totalSeats) * 100);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-secondary-400">Overview of cinema operations and performance</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-secondary-800 rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-secondary-400 text-sm">Total Revenue</p>
              <h3 className="text-2xl font-bold text-white">${totalRevenue.toFixed(2)}</h3>
            </div>
            <div className="p-3 bg-green-900/30 rounded-full text-green-500">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="flex items-center text-green-500 text-sm">
            <ChevronUp size={16} className="mr-1" />
            <span>12% increase</span>
            <span className="text-secondary-400 ml-1">vs last month</span>
          </div>
        </div>
        
        <div className="bg-secondary-800 rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-secondary-400 text-sm">Bookings</p>
              <h3 className="text-2xl font-bold text-white">{bookings.length}</h3>
            </div>
            <div className="p-3 bg-blue-900/30 rounded-full text-blue-500">
              <Users size={20} />
            </div>
          </div>
          <div className="flex items-center text-green-500 text-sm">
            <ChevronUp size={16} className="mr-1" />
            <span>8% increase</span>
            <span className="text-secondary-400 ml-1">vs last month</span>
          </div>
        </div>
        
        <div className="bg-secondary-800 rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-secondary-400 text-sm">Screenings</p>
              <h3 className="text-2xl font-bold text-white">{screenings.length}</h3>
            </div>
            <div className="p-3 bg-purple-900/30 rounded-full text-purple-500">
              <Calendar size={20} />
            </div>
          </div>
          <div className="flex items-center text-green-500 text-sm">
            <ChevronUp size={16} className="mr-1" />
            <span>5% increase</span>
            <span className="text-secondary-400 ml-1">vs last month</span>
          </div>
        </div>
        
        <div className="bg-secondary-800 rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-secondary-400 text-sm">Occupancy Rate</p>
              <h3 className="text-2xl font-bold text-white">{occupancyRate}%</h3>
            </div>
            <div className="p-3 bg-orange-900/30 rounded-full text-orange-500">
              <BarChart3 size={20} />
            </div>
          </div>
          <div className="flex items-center text-red-500 text-sm">
            <ChevronDown size={16} className="mr-1" />
            <span>3% decrease</span>
            <span className="text-secondary-400 ml-1">vs last month</span>
          </div>
        </div>
      </div>
      
      {/* Popular Movies and Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-secondary-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-secondary-700">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <TrendingUp size={18} className="mr-2 text-primary-500" />
              Popular Movies
            </h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {popularMovies.slice(0, 5).map(({ movie, bookingCount }) => (
                <div key={movie.id} className="flex items-center p-2 rounded-lg hover:bg-secondary-700 transition-colors">
                  <img 
                    src={movie.posterUrl} 
                    alt={movie.title} 
                    className="w-12 h-16 object-cover rounded-md mr-4"
                  />
                  <div className="flex-grow">
                    <h3 className="font-medium text-white">{movie.title}</h3>
                    <p className="text-sm text-secondary-400">{movie.genre.join(', ')}</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white">{bookingCount}</div>
                    <div className="text-xs text-secondary-400">bookings</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-secondary-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-secondary-700">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <Film size={18} className="mr-2 text-primary-500" />
              Recent Bookings
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-700">
              <thead className="bg-secondary-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-400 uppercase tracking-wider">
                    Movie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-400 uppercase tracking-wider">
                    Seats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-800">
                {bookings.map((booking) => {
                  const movie = movies.find(m => m.id === booking.movieId);
                  return (
                    <tr key={booking.id} className="hover:bg-secondary-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-300">
                        {booking.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{movie?.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-300">
                        {booking.seats.length} seats
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        ${booking.totalPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-900/40 text-green-400' 
                            : booking.status === 'pending'
                            ? 'bg-yellow-900/40 text-yellow-400'
                            : 'bg-red-900/40 text-red-400'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-secondary-800 rounded-lg shadow-lg overflow-hidden lg:col-span-2">
          <div className="p-6 border-b border-secondary-700">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <BarChart3 size={18} className="mr-2 text-primary-500" />
              Revenue Overview
            </h2>
          </div>
          <div className="p-6">
            {/* Chart would go here in a real app */}
            <div className="flex h-64 items-center justify-center">
              <div className="text-center text-secondary-400">
                <BarChart3 size={40} className="mx-auto mb-2 text-secondary-600" />
                <p>Revenue chart visualization would appear here</p>
                <p className="text-sm">Showing data for last 7 days</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-secondary-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-secondary-700">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <Users size={18} className="mr-2 text-primary-500" />
              Upcoming Screenings
            </h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {screenings.slice(0, 5).map((screening) => {
                const movie = movies.find(m => m.id === screening.movieId);
                return (
                  <div key={screening.id} className="p-3 bg-secondary-700/50 rounded-lg">
                    <h3 className="font-medium text-white mb-1">{movie?.title}</h3>
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-400">{screening.date}</span>
                      <span className="text-secondary-400">{screening.startTime}</span>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-xs text-secondary-400">{screening.hall}</span>
                      <span className="text-xs px-2 py-1 bg-secondary-900 rounded-full">
                        {screening.seatsAvailable} seats left
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;