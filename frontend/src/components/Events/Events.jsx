import React from 'react';
import { useSelector } from 'react-redux';
import styles from '../../styles/styles';
import EventCard from "./EventCard";

const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);

  return (
    <div>
      {!isLoading && (
        <div className={`${styles.section}`}>
          <div className={`${styles.heading} text-black text-center mb-6`}>
            <h1 className="text-3xl font-bold text-gray-800">Popular Events</h1>
          </div>

          <div className="w-full grid gap-4">
            {allEvents?.length !== 0 ? (
              <EventCard data={allEvents[0]} />
            ) : (
              <h4 className="text-lg font-semibold text-red-500 text-center">
                No Events currently!
              </h4>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
