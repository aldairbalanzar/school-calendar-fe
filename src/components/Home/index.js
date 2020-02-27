import React, { useState, useEffect } from 'react';
import Calendar from './Calendar/Calendar';
import Logo from '../../img/d8picker.png';
import favicon from '../../img/white.png';
import Template from './Template';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import dayjs from 'dayjs'

import { axiosWithAuth } from '../../utils/axiosWithAuth';
import { axiosByGid } from '../../utils/axiosByGid';
import { useTemplate } from '../../hooks/useTemplate'

const Home = () => {

  const {selected, setSelected, templateList, getTemplateList} = useTemplate()
  const [data, setData] = useState({});
  const [date, setDate] = useState(dayjs());

  const [events, setEvents] = useState([]);
  const [templateFormOpen, setTemplateFormOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

// January = 0

  const { register, handleSubmit, errors } = useForm();

  // Submit for template form
  const onSubmit = formData => {
    const template = {
      ...formData,
      googleId: localStorage.getItem('googleId:')
    };
    console.log('template', template);
    axios
      .post(`${process.env.REACT_APP_ENDPOINT_URL}/api/template`, template)
      .then(res => { console.log('Template Post', res); })
      .catch(err => { console.log(err); });
  };


  useEffect(() => {
    const url =
    process.env.NODE_ENV === 'development'
    ? '/api/events'
        : `${process.env.REACT_APP_ENDPOINT_URL}/api/events`;

      // Call for google for user events
    (async () => {
      const res = await axiosWithAuth().get(url);
      const results = await res.data;
      localStorage.setItem('googleId:', res.data.googleId);
      console.log('results: ', results);
      setData(results);
      setEvents(results.events);
      
      //need to include filter by ID
      getTemplateList()
      // call BE for templates by googleId

      //!!!!NEEDS TO BE REFORMATTED TO MAKE THIS DYNAMIC!!!!
      // (async () => {
      //   await axiosByGid()
      //     .get(`/api/template`)

      //     .then(res => {
      //       console.log("Template list res.data:", res.data)
      //       setTemplateList(res.data)
      //     })
      //     .catch(err => {console.log(err);});
      // })();
    })();
  }, [templateList]);

    //yall need to fighure
  const applyTemplate = (summary, description, starttime, endtime) => {

    const EventList = selected.map(e => (
      {
        "end": { "dateTime": `${e}T${endtime}:00-8:00` },
        "start": { "dateTime": `${e}T${starttime}:00-8:00` },
        "summary": summary,
        "description": description
      }
      
    ))

    console.log(EventList)
    //dateTime: "2020-02-28T08:30:00-08:00"
  //   const dateTime:''
  // 
  }

console.log(templateList)
  return (
    <div className="home">
      <div className="navbar">
        <img src={favicon} alt="" className="favicon" />
        <h2>Sign Out</h2>
      </div>
      <main className="main">
        <div className="left">
          <div className="profile">
            <img className="profile-img" src={data.photoUrl} alt="" />
            <h3>{data.name}</h3>
          </div>
          <div className="template">
            <h2>templates</h2>
            {templateList.map(t => (
              <Template
                key={t.id}
                id={t._id}
                starttime={t.starttime}
                endtime={t.endtime}
                summary={t.summary}
                description={t.description}
                templateFormOpen={templateFormOpen}
                setTemplateFormOpen={setTemplateFormOpen}
                applyTemplate={applyTemplate}
              />
            ))}
            <button onClick={() => setFormOpen(!formOpen)}>Create Template</button>
            {formOpen && (
              <div className="Form">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <input type="text" placeholder="summary" name="summary" ref={register({ maxLength: 80 })} />
                  <input type="text" placeholder="description" name="description" ref={register({ maxLength: 100 })} />
                  <input type="time" name="starttime" ref={register({ required: true })} />
                  <input type="time" name="endtime" ref={register({ required: true })} />

                  <input type="submit" />
                </form>
              </div>
            )}
          </div>
        </div>
        <div className="right">
          <img src={Logo} alt="logo" className="logo" />
          <Calendar
            events={events}
            data={data}
            templateFormOpen={templateFormOpen}
            setTemplateFormOpen={setTemplateFormOpen}
            date={date}
            setDate={setDate}
          />
        </div>
      </main>
    </div>
  );
};

export default Home;
