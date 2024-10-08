import React from 'react';
import { useSelector } from 'react-redux';
import styles from '../../styles/styles';
import EventCard from "./EventCard";

const Events = () => {
  const {allEvents,isLoading} = useSelector((state) => state.events);  
   
  return (
    <div>
     {
      !isLoading && (
        <div className={`${styles.section}`}>
      <div className={`${styles.heading} text-black`}>
        <h1>Popular Events</h1>
      </div>

      <div className="w-full grid">
         {
          allEvents?.length !== 0 && (
            <EventCard data={allEvents && allEvents[0]} />
          )
         } 
         <h4 style={{textAlign: 'center'}}>{
           allEvents?.length === 0 && (
            'No Events currently!'
           )
          }

         </h4>
      </div>
     
    </div>
      )
     }
  </div>
  )
}

export default Events