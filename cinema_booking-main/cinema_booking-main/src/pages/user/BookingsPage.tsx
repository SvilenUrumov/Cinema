import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Calendar, Clock, MapPin, Download, ChevronRight, ThumbsUp, ThumbsDown } from 'lucide-react';
import { bookings, movies, screenings } from '../../data/mockData';
import { format } from 'date-fns';

const BookingsPage: React.FC = () => {
  // Combine booking data with movie and screening info
  const bookingsWithDetails = bookings.map(booking => {
    const movie = movies.find(m => m.id === booking.movieId);
    const screening = screenings.find(s => s.id === booking.screeningId);
    return { booking, movie, screening };
  });
  
  // Sort bookings by date (most recent first)
  bookingsWithDetails.sort((a, b) => {
    return new Date(b.booking.bookingDate).getTime() - new Date(a.booking.bookingDate).getTime();
  });

  return (
    <div className="section">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Bookings</h1>
        <p className="text-secondary-300">Manage your movie tickets and bookings</p>
      </div>
      
      {bookingsWithDetails.length > 0 ? (
        <div className="space-y-6">
          {bookingsWithDetails.map(({ booking, movie, screening }) => (
            <div
              key={booking.id}
              className="bg-secondary-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="md:flex">
                {/* Movie Poster */}
                <div className="md:w-1/4 lg:w-1/5">
                  <Link to={`/movies/${movie?.id}`}>
                    <img
                      src={movie?.posterUrl}
                      alt={movie?.title}
                      className="w-full h-full object-cover md:h-48 lg:h-full"
                    />
                  </Link>
                </div>
                
                {/* Booking Details */}
                <div className="p-6 md:w-3/4 lg:w-4/5">
                  <div className="flex flex-wrap justify-between items-start mb-4">
                    <div>
                      <Link to={`/movies/${movie?.id}`} className="text-xl font-semibold text-white hover:text-primary-500 transition-colors">
                        {movie?.title}
                      </Link>
                      
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-secondary-300">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{screening?.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{screening?.startTime} - {screening?.endTime}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{screening?.hall}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2 md:mt-0">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-900/40 text-green-400' 
                          : booking.status === 'pending'
                          ? 'bg-yellow-900/40 text-yellow-400'
                          : 'bg-red-900/40 text-red-400'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t border-secondary-700 pt-4 mb-4">
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-secondary-400 mb-1">Booking ID</h4>
                        <p className="text-white">{booking.id}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-secondary-400 mb-1">Booking Date</h4>
                        <p className="text-white">{format(new Date(booking.bookingDate), 'MMM dd, yyyy')}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-secondary-400 mb-1">Seats</h4>
                        <div className="flex flex-wrap gap-1">
                          {booking.seats.map(seat => (
                            <span key={seat.id} className="bg-secondary-700 text-secondary-200 px-2 py-1 rounded-md text-xs">
                              {seat.row}{seat.number}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-secondary-400 mb-1">Total Price</h4>
                        <p className="text-primary-500 font-medium">${booking.totalPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <button className="btn btn-primary btn-sm flex items-center">
                      <Download className="h-4 w-4 mr-1" />
                      Download Ticket
                    </button>
                    
                    <Link to={`/movies/${movie?.id}`} className="btn btn-outline btn-sm flex items-center">
                      Movie Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                    
                    <div className="flex ml-auto space-x-2">
                      <button className="bg-secondary-700 hover:bg-green-700 text-white p-2 rounded-md transition-colors">
                        <ThumbsUp className="h-4 w-4" />
                      </button>
                      <button className="bg-secondary-700 hover:bg-red-700 text-white p-2 rounded-md transition-colors">
                        <ThumbsDown className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-secondary-800 rounded-lg">
          <Ticket className="h-16 w-16 text-secondary-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Bookings Yet</h3>
          <p className="text-secondary-400 max-w-md mx-auto mb-6">Looks like you haven't made any bookings yet. Browse our movies and book your first ticket!</p>
          <Link to="/movies" className="btn btn-primary">
            Browse Movies
          </Link>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;