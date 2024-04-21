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

const UserSchedule = () => {
  const { userId } = useParams();
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

  useEffect(() => {
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json', // Adjust content type as needed
    };

    axios
      .get(`http://localhost:8080/api/v1/staff/${userId}`, { headers })
      .then((res) => {
        const data = res.data;
        data.tasks = capitalizeKeys(data.tasks);
        setDoctorData(data);
      })
      .catch((error) => {});
  }, [token]);

  const scheduleObj = useRef(null);

  const eventSettings = { dataSource: doctorData.tasks };

  return (
    <>
      <h2>{doctorData ? doctorData.firstname + ' ' + doctorData.lastname : ''}</h2>

      <ScheduleComponent
        className="tableDisabled"
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
        <Link className="e-btn e-css e-btn" to="/">
          Go back
        </Link>
      </div>
    </>
  );
};

export default UserSchedule;
