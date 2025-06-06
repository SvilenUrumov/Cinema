import React, { useState } from 'react';
import { BarChart3, Download, Calendar, TrendingUp, TicketCheck, Film, Filter } from 'lucide-react';
import { movies, screenings, bookings, getPopularMovies, getSeatsForScreening } from '../../data/mockData';
import { SeatRow } from '../../types/screening';

const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState<string>('popular');
  const [screeningId, setScreeningId] = useState<string>('');
  const [timeRange, setTimeRange] = useState<string>('week');
  const [seatMap, setSeatMap] = useState<SeatRow[]>([]);
  
  // Get popular movies data
  const popularMovies = getPopularMovies();
  
  // Get all screenings for the dropdown
  const allScreenings = screenings.map(screening => {
    const movie = movies.find(m => m.id === screening.movieId);
    return {
      ...screening,
      movieTitle: movie?.title || 'Unknown Movie',
    };
  });
  
  // Get seat occupancy data
  const handleScreeningChange = (id: string) => {
    setScreeningId(id);
    if (id) {
      const seats = getSeatsForScreening(id);
      setSeatMap(seats);
    } else {
      setSeatMap([]);
    }
  };
  
  // Calculate revenue data
  const getRevenueData = () => {
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
    const confirmedRevenue = confirmedBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
    
    return {
      totalRevenue,
      confirmedRevenue,
      pendingRevenue: totalRevenue - confirmedRevenue,
      totalBookings: bookings.length,
      confirmedBookings: confirmedBookings.length,
      averageTicketPrice: totalRevenue / bookings.reduce((sum, booking) => sum + booking.seats.length, 0),
    };
  };
  
  const revenueData = getRevenueData();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-secondary-400">Generate and view analytics reports</p>
        </div>
        
        <button
          onClick={() => console.log('Export report')}
          className="btn btn-outline flex items-center"
        >
          <Download size={18} className="mr-2" />
          Export Data
        </button>
      </div>
      
      {/* Report Type Tabs */}
      <div className="bg-secondary-800 rounded-lg overflow-hidden mb-8">
        <div className="flex border-b border-secondary-700">
          <button
            onClick={() => setReportType('popular')}
            className={`px-4 py-3 text-sm font-medium flex items-center ${
              reportType === 'popular' 
                ? 'text-white border-b-2 border-primary-500' 
                : 'text-secondary-400 hover:text-white'
            }`}
          >
            <TrendingUp size={18} className="mr-2" />
            Popular Movies
          </button>
          <button
            onClick={() => setReportType('revenue')}
            className={`px-4 py-3 text-sm font-medium flex items-center ${
              reportType === 'revenue' 
                ? 'text-white border-b-2 border-primary-500' 
                : 'text-secondary-400 hover:text-white'
            }`}
          >
            <BarChart3 size={18} className="mr-2" />
            Revenue
          </button>
          <button
            onClick={() => setReportType('seats')}
            className={`px-4 py-3 text-sm font-medium flex items-center ${
              reportType === 'seats' 
                ? 'text-white border-b-2 border-primary-500' 
                : 'text-secondary-400 hover:text-white'
            }`}
          >
            <TicketCheck size={18} className="mr-2" />
            Seat Occupancy
          </button>
        </div>
      </div>
      
      {/* Report Content */}
      <div className="bg-secondary-800 rounded-lg overflow-hidden">
        {/* Report Filter Bar */}
        <div className="p-4 border-b border-secondary-700">
          <div className="flex items-center">
            <Filter size={18} className="text-secondary-400 mr-2" />
            <span className="text-sm font-medium text-white mr-4">Filter:</span>
            
            {reportType === 'popular' && (
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="input"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
                <option value="all">All Time</option>
              </select>
            )}
            
            {reportType === 'seats' && (
              <select
                value={screeningId}
                onChange={(e) => handleScreeningChange(e.target.value)}
                className="input"
              >
                <option value="">Select a screening</option>
                {allScreenings.map(screening => (
                  <option key={screening.id} value={screening.id}>
                    {screening.movieTitle} - {screening.date} {screening.startTime}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
        
        {/* Popular Movies Report */}
        {reportType === 'popular' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Film className="h-6 w-6 text-primary-500 mr-2" />
              Most Popular Movies {timeRange === 'week' ? 'This Week' : timeRange === 'month' ? 'This Month' : timeRange === 'year' ? 'This Year' : 'All Time'}
            </h2>
            
            <div className="space-y-6">
              {popularMovies.map(({ movie, bookingCount }, index) => (
                <div key={movie.id} className="bg-secondary-700 rounded-lg p-4">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-secondary-900 text-primary-500 rounded-full font-bold">
                      {index + 1}
                    </div>
                    
                    <div className="md:w-1/4 lg:w-1/6">
                      <img 
                        src={movie.posterUrl} 
                        alt={movie.title} 
                        className="w-32 h-auto rounded-md mx-auto md:mx-0"
                      />
                    </div>
                    
                    <div className="md:flex-1 text-center md:text-left">
                      <h3 className="text-lg font-semibold text-white mb-1">{movie.title}</h3>
                      <div className="text-sm text-secondary-400 mb-3">
                        <span>{movie.genre.join(', ')}</span>
                        <span className="mx-2">•</span>
                        <span>{movie.duration} min</span>
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-4">
                        <div>
                          <p className="text-xs text-secondary-400 mb-1">Total Bookings</p>
                          <p className="text-lg font-semibold text-white">{bookingCount}</p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-secondary-400 mb-1">Average Rating</p>
                          <div className="flex items-center">
                            <div className="flex items-center text-accent-500">
                              {[...Array(5)].map((_, i) => (
                                <svg 
                                  key={i} 
                                  className={`w-4 h-4 ${i < Math.floor(movie.imdbRating / 2) ? 'fill-current' : 'stroke-current fill-none'}`} 
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                              ))}
                              <span className="ml-1 text-white">{movie.imdbRating}/10</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-xs text-secondary-400 mb-1">Revenue</p>
                          <p className="text-lg font-semibold text-white">${(bookingCount * movie.duration * 0.1).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 w-full md:w-auto">
                      <div className="h-6 w-32 bg-secondary-900 rounded-full overflow-hidden mx-auto md:mx-0">
                        <div 
                          className="h-full bg-primary-600" 
                          style={{ width: `${(bookingCount / popularMovies[0].bookingCount) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-secondary-400 text-center md:text-right mt-1">
                        {Math.round((bookingCount / popularMovies[0].bookingCount) * 100)}% of top
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Revenue Report */}
        {reportType === 'revenue' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <BarChart3 className="h-6 w-6 text-primary-500 mr-2" />
              Revenue Overview
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-secondary-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Total Revenue</h3>
                <p className="text-3xl font-bold text-primary-500">${revenueData.totalRevenue.toFixed(2)}</p>
                <div className="flex justify-between mt-4 text-sm">
                  <div>
                    <p className="text-secondary-400">Confirmed</p>
                    <p className="text-white">${revenueData.confirmedRevenue.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-secondary-400">Pending</p>
                    <p className="text-white">${revenueData.pendingRevenue.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-secondary-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Total Bookings</h3>
                <p className="text-3xl font-bold text-primary-500">{revenueData.totalBookings}</p>
                <div className="flex justify-between mt-4 text-sm">
                  <div>
                    <p className="text-secondary-400">Confirmed</p>
                    <p className="text-white">{revenueData.confirmedBookings}</p>
                  </div>
                  <div>
                    <p className="text-secondary-400">Avg. Ticket Price</p>
                    <p className="text-white">${revenueData.averageTicketPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-secondary-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Revenue by Hall</h3>
                <div className="space-y-3">
                  {halls.map((hall, index) => (
                    <div key={hall.id} className="flex items-center">
                      <div className="w-24 mr-3 text-sm">{hall.name}</div>
                      <div className="flex-1 h-4 bg-secondary-900 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${index === 0 ? 'bg-primary-600' : index === 1 ? 'bg-accent-600' : 'bg-green-600'}`} 
                          style={{ width: `${70 - (index * 15)}%` }}
                        ></div>
                      </div>
                      <div className="w-12 text-right text-sm">${(1200 - (index * 300)).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-secondary-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Revenue Over Time</h3>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center text-secondary-400">
                  <BarChart3 size={40} className="mx-auto mb-2 text-secondary-600" />
                  <p>Revenue chart visualization would appear here</p>
                  <p className="text-sm">Showing data for last 7 days</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Seat Occupancy Report */}
        {reportType === 'seats' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <TicketCheck className="h-6 w-6 text-primary-500 mr-2" />
              Seat Occupancy Analysis
            </h2>
            
            {screeningId ? (
              <>
                {(() => {
                  const screening = screenings.find(s => s.id === screeningId);
                  const movie = movies.find(m => m.id === screening?.movieId);
                  
                  if (!screening || !movie) return null;
                  
                  // Calculate occupancy statistics
                  const totalSeats = screening.totalSeats;
                  const occupiedSeats = totalSeats - screening.seatsAvailable;
                  const occupancyRate = Math.round((occupiedSeats / totalSeats) * 100);
                  
                  // Count VIP and regular seats
                  let vipSeats = 0;
                  let regularSeats = 0;
                  let occupiedVipSeats = 0;
                  let occupiedRegularSeats = 0;
                  
                  seatMap.forEach(row => {
                    row.seats.forEach(seat => {
                      if (seat.type === 'vip') {
                        vipSeats++;
                        if (seat.status === 'occupied') {
                          occupiedVipSeats++;
                        }
                      } else {
                        regularSeats++;
                        if (seat.status === 'occupied') {
                          occupiedRegularSeats++;
                        }
                      }
                    });
                  });
                  
                  const vipOccupancyRate = Math.round((occupiedVipSeats / vipSeats) * 100) || 0;
                  const regularOccupancyRate = Math.round((occupiedRegularSeats / regularSeats) * 100) || 0;
                  
                  return (
                    <>
                      <div className="mb-6">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 bg-secondary-700 rounded-lg p-4">
                          <div className="md:w-1/4 lg:w-1/6">
                            <img 
                              src={movie.posterUrl} 
                              alt={movie.title} 
                              className="w-32 h-auto rounded-md mx-auto md:mx-0"
                            />
                          </div>
                          
                          <div className="md:flex-1 text-center md:text-left">
                            <h3 className="text-lg font-semibold text-white mb-1">{movie.title}</h3>
                            <div className="text-sm text-secondary-400 mb-3">
                              <span>{screening.date}</span>
                              <span className="mx-2">•</span>
                              <span>{screening.startTime} - {screening.endTime}</span>
                              <span className="mx-2">•</span>
                              <span>{screening.hall}</span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <p className="text-xs text-secondary-400 mb-1">Total Seats</p>
                                <p className="text-lg font-semibold text-white">{totalSeats}</p>
                              </div>
                              
                              <div>
                                <p className="text-xs text-secondary-400 mb-1">Occupied Seats</p>
                                <p className="text-lg font-semibold text-white">{occupiedSeats}</p>
                              </div>
                              
                              <div>
                                <p className="text-xs text-secondary-400 mb-1">Occupancy Rate</p>
                                <p className="text-lg font-semibold text-white">{occupancyRate}%</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-secondary-700 rounded-lg p-6">
                          <h3 className="text-md font-semibold text-white mb-4">Seat Type Analysis</h3>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-secondary-300">VIP Seats</span>
                                <span className="text-sm text-white">{occupiedVipSeats}/{vipSeats} ({vipOccupancyRate}%)</span>
                              </div>
                              <div className="h-2 bg-secondary-900 rounded-full overflow-hidden">
                                <div className="h-full bg-accent-500" style={{ width: `${vipOccupancyRate}%` }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-secondary-300">Regular Seats</span>
                                <span className="text-sm text-white">{occupiedRegularSeats}/{regularSeats} ({regularOccupancyRate}%)</span>
                              </div>
                              <div className="h-2 bg-secondary-900 rounded-full overflow-hidden">
                                <div className="h-full bg-primary-500" style={{ width: `${regularOccupancyRate}%` }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-secondary-700 rounded-lg p-6">
                          <h3 className="text-md font-semibold text-white mb-4">Revenue Breakdown</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-secondary-300 mb-1">VIP Revenue</p>
                              <p className="text-lg font-semibold text-white">${(occupiedVipSeats * 15).toFixed(2)}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm text-secondary-300 mb-1">Regular Revenue</p>
                              <p className="text-lg font-semibold text-white">${(occupiedRegularSeats * 10).toFixed(2)}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm text-secondary-300 mb-1">Total Revenue</p>
                              <p className="text-lg font-semibold text-primary-500">${(occupiedVipSeats * 15 + occupiedRegularSeats * 10).toFixed(2)}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm text-secondary-300 mb-1">Potential Revenue</p>
                              <p className="text-lg font-semibold text-secondary-400">${(vipSeats * 15 + regularSeats * 10).toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-secondary-700 rounded-lg p-6">
                        <h3 className="text-md font-semibold text-white mb-6">Seat Map Visualization</h3>
                        
                        <div className="flex justify-center mb-6">
                          <div className="flex flex-wrap gap-2">
                            <div className="flex items-center">
                              <div className="w-4 h-4 bg-secondary-700 border border-secondary-600 mr-2"></div>
                              <span className="text-xs text-secondary-300">Available</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-4 h-4 bg-primary-600 mr-2"></div>
                              <span className="text-xs text-secondary-300">Occupied</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-4 h-4 bg-accent-500 mr-2"></div>
                              <span className="text-xs text-secondary-300">VIP</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-4 h-4 bg-accent-700 mr-2"></div>
                              <span className="text-xs text-secondary-300">VIP Occupied</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-center overflow-x-auto pb-4">
                          <div>
                            <div className="h-4 bg-primary-800/30 rounded-t-full mx-auto w-4/5 mb-4"></div>
                            
                            <div className="flex flex-col items-center space-y-1">
                              {seatMap.map((row) => (
                                <div key={row.row} className="flex items-center">
                                  <div className="w-6 text-center text-xs font-medium text-secondary-400">{row.row}</div>
                                  <div className="flex gap-1">
                                    {row.seats.map((seat) => (
                                      <div
                                        key={seat.id}
                                        className={`w-6 h-6 flex items-center justify-center text-xs font-medium rounded ${
                                          seat.status === 'occupied'
                                            ? seat.type === 'vip'
                                              ? 'bg-accent-700 text-white'
                                              : 'bg-primary-600 text-white'
                                            : seat.type === 'vip'
                                            ? 'bg-accent-500 text-white'
                                            : 'bg-secondary-700 border border-secondary-600 text-secondary-400'
                                        }`}
                                      >
                                        {seat.number}
                                      </div>
                                    ))}
                                  </div>
                                  <div className="w-6 text-center text-xs font-medium text-secondary-400">{row.row}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </>
            ) : (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-secondary-600 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No Screening Selected</h3>
                <p className="text-secondary-400 max-w-md mx-auto">
                  Please select a screening from the dropdown above to view seat occupancy data.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;