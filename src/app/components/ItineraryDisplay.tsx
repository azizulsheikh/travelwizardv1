// app/components/ItineraryDisplay.tsx
import React from 'react';
import { Plane, Home, MapPin, Utensils, Clock, DollarSign, Star } from 'lucide-react';

interface FlightDetails {
  airline: string;
  flightNumber?: string;
  departure: string;
  arrival: string;
  estimatedCost: string;
}

interface Activity {
  title: string;
  startTime: string;
  endTime: string;
  description?: string;
  type: 'transfer' | 'food' | 'activity' | 'lodging' | 'free-time';
  imageQuery?: string;
  lodgingDetails?: {
    hotelName: string;
    estimatedCost: string;
  };
}

interface Day {
  day: number;
  theme: string;
  activities: Activity[];
}

interface Itinerary {
  tripTitle: string;
  tripSummary: string;
  flightDetails: FlightDetails;
  days: Day[];
}

interface ItineraryDisplayProps {
  itinerary: Itinerary;
  realFlights: any[];
  realHotels: any[];
}

export default function ItineraryDisplay({ itinerary, realFlights, realHotels }: ItineraryDisplayProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'transfer': 
        return <Plane className="w-6 h-6 text-gray-500" />;
      case 'food': 
        return <Utensils className="w-6 h-6 text-gray-500" />;
      case 'lodging': 
        return <Home className="w-6 h-6 text-gray-500" />;
      case 'activity': 
        return <MapPin className="w-6 h-6 text-gray-500" />;
      case 'free-time':
        return <Clock className="w-6 h-6 text-gray-500" />;
      default: 
        return <MapPin className="w-6 h-6 text-gray-500" />;
    }
  };

  const renderRealFlightData = () => {
    if (realFlights.length === 0) return null;

    const flight = realFlights[0]; // Show first available flight
    const outbound = flight.itineraries?.[0]?.segments?.[0];
    
    return (
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-md border-l-4 border-blue-500">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <Plane className="text-blue-500" size={24} />
          Real Flight Available
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <div>
            <strong>Airline:</strong> {flight.validatingAirlineCodes?.[0] || 'Multiple Airlines'}
          </div>
          <div>
            <strong>Price:</strong> {flight.price?.total} {flight.price?.currency}
          </div>
          <div>
            <strong>Departure:</strong> {outbound?.departure?.iataCode} at {new Date(outbound?.departure?.at).toLocaleTimeString()}
          </div>
          <div>
            <strong>Arrival:</strong> {outbound?.arrival?.iataCode} at {new Date(outbound?.arrival?.at).toLocaleTimeString()}
          </div>
          <div>
            <strong>Duration:</strong> {outbound?.duration?.replace('PT', '').replace('H', 'h ').replace('M', 'm')}
          </div>
          <div>
            <strong>Aircraft:</strong> {outbound?.aircraft?.code || 'N/A'}
          </div>
        </div>
        <div className="mt-4 p-3 bg-white rounded-md">
          <p className="text-sm text-gray-600">✈️ Real-time data from Amadeus API</p>
        </div>
      </div>
    );
  };

  const renderRealHotelData = () => {
    if (realHotels.length === 0) return null;

    return (
      <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg shadow-md border-l-4 border-green-500">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <Home className="text-green-500" size={24} />
          Available Hotels ({realHotels.length} found)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {realHotels.slice(0, 6).map((hotel, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 truncate">
                {hotel.hotel?.name || 'Hotel Name Not Available'}
              </h3>
              
              {/* Hotel Rating */}
              <div className="flex items-center gap-2 mt-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-600">
                  {hotel.hotel?.rating ? `${hotel.hotel.rating}/5` : 'No rating'}
                </span>
              </div>
              
              {/* Hotel Price */}
              <div className="flex items-center gap-2 mt-1">
                <DollarSign className="w-4 h-4 text-green-500" />
                <span className="text-sm font-semibold">
                  {hotel.offers?.[0]?.price?.total 
                    ? `${hotel.offers[0].price.total} ${hotel.offers[0].price.currency}` 
                    : 'Price on request'}
                </span>
              </div>
              
              {/* Hotel Location */}
              {hotel.hotel?.address && (
                <div className="flex items-start gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span className="text-xs text-gray-500 line-clamp-2">
                    {hotel.hotel.address.lines?.[0]}, {hotel.hotel.address.cityName}
                  </span>
                </div>
              )}
              
              {/* Hotel Amenities */}
              {hotel.hotel?.amenities && hotel.hotel.amenities.length > 0 && (
                <div className="mt-2">
                  <div className="flex flex-wrap gap-1">
                    {hotel.hotel.amenities.slice(0, 3).map((amenity: string, idx: number) => (
                      <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {amenity}
                      </span>
                    ))}
                    {hotel.hotel.amenities.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{hotel.hotel.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-white rounded-md">
          <p className="text-sm text-gray-600">🏨 Real-time data from Amadeus API</p>
        </div>
      </div>
    );
  };

  const generateLodgingCard = (activity: Activity) => {
    if (activity.type === 'lodging' && activity.lodgingDetails) {
      return (
        <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-blue-600" />
            <p className="font-semibold text-blue-800">{activity.lodgingDetails.hotelName}</p>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <DollarSign className="w-4 h-4 text-blue-600" />
            <p className="text-blue-700">{activity.lodgingDetails.estimatedCost}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    (e.target as HTMLImageElement).style.display = 'none';
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-center mb-2">{itinerary.tripTitle}</h1>
      <p className="text-lg text-gray-600 text-center mb-10">{itinerary.tripSummary}</p>
      
      {/* Real Flight Data */}
      {renderRealFlightData()}
      
      {/* Real Hotel Data */}
      {renderRealHotelData()}

      {/* Original AI-generated flight details */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md border-l-4 border-gray-300">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <Plane className="text-gray-500" size={24} />
          AI Suggested Flight
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <div>
            <strong>Airline:</strong> {itinerary.flightDetails.airline}{' '}
            {itinerary.flightDetails.flightNumber ? `(${itinerary.flightDetails.flightNumber})` : ''}
          </div>
          <div><strong>Estimated Cost:</strong> {itinerary.flightDetails.estimatedCost}</div>
          <div><strong>Departure:</strong> {itinerary.flightDetails.departure}</div>
          <div><strong>Arrival:</strong> {itinerary.flightDetails.arrival}</div>
        </div>
      </div>

      {/* Itinerary Days */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {itinerary.days.map(day => (
          <div key={day.day} className="flex flex-col gap-y-4">
            <h2 className="text-xl font-bold p-1">Day {day.day}: {day.theme}</h2>
            {day.activities.map((activity, index) => (
              <div key={index} className="bg-white rounded-2xl p-4 shadow-md flex items-start gap-x-4">
                <div className="bg-gray-100 p-2 rounded-full mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-gray-800">{activity.title}</h3>
                  <p className="text-sm text-gray-500">{activity.startTime} - {activity.endTime}</p>
                  
                  {activity.description && (
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  )}
                  
                  {generateLodgingCard(activity)}
                  
                  {activity.imageQuery && (
                    <img
                      src={`https://source.unsplash.com/400x200/?${encodeURIComponent(activity.imageQuery)}`}
                      alt={activity.title}
                      className="mt-3 rounded-lg w-full h-auto object-cover"
                      onError={handleImageError}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}