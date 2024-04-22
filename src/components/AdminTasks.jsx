import React from 'react';
import axios from 'axios';
import {
  ScheduleComponent,
  Day,
  Week,
  WorkWeek,
  Month,
  Inject,
  ViewsDirective,
  ViewDirective,
} from '@syncfusion/ej2-react-schedule';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminTasks = () => {
  const { doctorId } = useParams();
  const [doctorData, setDoctorData] = useState([]);
  const { token } = useSelector((state) => state.user);

  function capitalizeKeys(array) {
    return array.map((obj) => {
      const newObj = {};
      for (let key in obj) {
        const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
        newObj[capitalizedKey] = obj[key];
      }
      return newObj;
    });
  }

  function lowerKeys(array) {
    return array.map((obj) => {
      const newObj = {};
      for (let key in obj) {
        const lowerKey = key.charAt(0).toLowerCase() + key.slice(1);
        newObj[lowerKey] = obj[key];
      }
      return newObj;
    });
  }

  // Function to convert date string to new format
  function convertDateFormat(dateString) {
    const date = new Date(dateString);
    return date.toString().replace(/\s\(.+\)/, '');
  }

  useEffect(() => {
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json', // Adjust content type as needed
    };

    axios
      .get(`http://localhost:8080/api/v1/staff/${doctorId}`, { headers })
      .then((res) => {
        const data = res.data;
        data.tasks = capitalizeKeys(data.tasks);
        setDoctorData(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const scheduleObj = useRef(null);

  const eventSettings = { dataSource: doctorData.tasks };

  const onClickSave = () => {
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json', // Adjust content type as needed
    };

    const savedData = lowerKeys(scheduleObj.current.eventsData);

    // Loop through the array and update each object
    const updatedEvents = savedData.map((event) => ({
      ...event,
      startTime: convertDateFormat(event.startTime),
      endTime: convertDateFormat(event.endTime),
    }));


    axios
      .post(`http://localhost:8080/api/v1/staff/${doctorId}/create-task`, updatedEvents, {
        headers,
      })
      .then((res) => {})
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <h2>{doctorData ? doctorData.firstname + ' ' + doctorData.lastname : ''}</h2>

      <ScheduleComponent
        ref={scheduleObj}
        width="100%"
        height="550px"
        selectedDate={new Date()}
        eventSettings={eventSettings}>
        <ViewsDirective>
          <ViewDirective option="Day" />
          <ViewDirective option="Week" />
          <ViewDirective option="WorkWeek" />
          <ViewDirective option="Month" />
        </ViewsDirective>
        <Inject services={[Day, Week, WorkWeek, Month]} />
      </ScheduleComponent>
      <div className="buttonWrapper">
        <ButtonComponent id="save" title="Save" onClick={onClickSave}>
          Save
        </ButtonComponent>
        <Link className="e-btn e-css e-btn" to="/users-table">
          Go back
        </Link>
      </div>
    </>
  );
};

export default AdminTasks;
