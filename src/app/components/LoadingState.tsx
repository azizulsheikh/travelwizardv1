// LoadingState.tsx
import React, { useState, useEffect } from 'react';

export default function LoadingState() {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [displayedMessages, setDisplayedMessages] = useState<string[]>([]);

  const loadingMessages = [
    "Analyzing your trip requirements...",
    "Searching real flights with Amadeus API...",
    "Finding available hotels...",
    "Generating personalized itinerary...",
    "Optimizing day plans...",
    "Finalizing your perfect trip..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentMessage < loadingMessages.length) {
        setDisplayedMessages(prev => [...prev, loadingMessages[currentMessage]]);
        setCurrentMessage(prev => prev + 1);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [currentMessage]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        <h2 className="text-xl font-bold">AI Planning In Progress</h2>
      </div>
      <ul className="space-y-2 text-gray-600">
        {displayedMessages.map((message, index) => (
          <li key={index} className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            {message}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ItineraryDisplay.tsx
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
      case 'transfer': return <Plane className="w-6 h-6 text-gray-500" />;
      case 'food': return <Utensils className="w-6 h-6 text-gray-500" />;
      case 'lodging': return <Home className="w-6 h-6 text-gray-500" />;
      case 'activity': return <MapPin className="w-6 h-6 text-gray-500" />;
      default: return <Clock className="w-6 h-6 text-gray-500" />;
    }
  };

  const renderRealFlightData = () => {
    if (realFlights.length === 0) return null;

    const flight = realFlights[0]; // Show first available flight
    return (
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-md border-l-4 border-blue-500">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <Plane className="text-blue-500" size={24} />
          Real Flight Available
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <div><strong>Airline:</strong> {flight.validatingAirlineCodes?.[0] || 'Multiple Airlines'}</div>
          <div><strong>Price:</strong> {flight.price?.total} {flight.price?.currency}</div>
          <div><strong>Departure:</strong> {flight.itineraries?.[0]?.segments?.[0]?.departure?.at}</div>
          <div><strong>Arrival:</strong> {flight.itineraries?.[0]?.segments?.[0]?.arrival?.at}</div>
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

  return (
    <div>
      <h1 className="text-4xl font-bold text-center mb-2">{itinerary.tripTitle}</h1>
      <p className="text-lg text-gray-600 text-center mb-10">{itinerary.tripSummary}</p>
      
      {renderRealFlightData()}
      {renderRealHotelData()}

      {/* Original AI-generated flight details */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md border-l-4 border-gray-300">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <Plane className="text-gray-500" size={24} />
          AI Suggested Flight
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <div><strong>Airline:</strong> {itinerary.flightDetails.airline} {itinerary.flightDetails.flightNumber ? `(${itinerary.flightDetails.flightNumber})` : ''}</div>
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
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
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
}text-sm text-gray-600">✈️ Real-time data from Amadeus API</p>
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
          {realHotels.slice(0, 3).map((hotel, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800">{hotel.hotel?.name}</h3>
              <div className="flex items-center gap-2 mt-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-600">
                  {hotel.hotel?.rating || 'No rating'}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <DollarSign className="w-4 h-4 text-green-500" />
                <span className="text-sm font-semibold">
                  {hotel.offers?.[0]?.price?.total} {hotel.offers?.[0]?.price?.currency}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-white rounded-md">
          <p className="