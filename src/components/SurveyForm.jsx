// SurveyForm.js
import React, { useContext, useEffect, useState } from 'react';
import { FormContext } from './SurveyFormContext';
import { validateSurveyForm } from './FormValidation';
import axios from 'axios';
import toast from 'react-hot-toast';

const SurveyForm = () => {

  const { data, setData } = useContext(FormContext);
  const [errors, setErrors] = useState({});
  const [additionalQuestions, setAdditionalQuestions] = useState([]);
  const [submitted , setSubmitted ] = useState(false);
  const [submittedData , setSubmittedData ] = useState({});
  const [fetching , setFetching ] = useState(false);

  const surveyTopics = [
    { id: 1, value: 'technology', label: 'Technology' },
    { id: 2, value: 'health', label: 'Health' },
    { id: 3, value: 'education', label: 'Education' },
  ];

  const favouriteProgrammingLanguage = [
    { id: 1, value: 'javascript', label: 'Javascript' },
    { id: 2, value: 'python', label: 'Python' },
    { id: 3, value: 'java', label: 'Java' },
    { id: 4, value: 'c#', label: 'C#' },
  ];

  const exerciseFrequency = [
    { id: 1, value: 'daily', label: 'Daily' },
    { id: 2, value: 'weekly', label: 'Weekly' },
    { id: 3, value: 'monthly', label: 'Monthly' },
    { id: 4, value: 'rarely', label: 'Rarely' },
  ];

  const dietPreference = [
    { id: 1, value: 'vegetarian', label: 'Vegetarian' },
    { id: 2, value: 'vegan', label: 'Vegan' },
    { id: 3, value: 'non-vegetarian', label: 'Non-Vegetarian' },
  ];

  const highestQualification = [
    { id: 1, value: 'highschool', label: 'High School' },
    { id: 2, value: 'bachelors', label: 'Bachelor`s' },
    { id: 3, value: 'masters', label: 'Master`s' },
    { id: 4, value: 'phd', label: 'PhD' },
  ];

  const handleNameChange = (e) => {
    const fullName = e.target.value ;
    setData({...data , fullName});
  }

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setData({...data , email});
  }

  let activeToast = false ;

  const validateForm = (data) => {
    const errors = {} ;

    //Name Check
    if(!data.fullName){
      errors.fullName = 'Name is Required' ;
      if(!activeToast){
        toast.error('Name is required');
        activeToast = true ;
      }
    }

    //check email
    if(!data.email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email)){
      errors.email ='Email is required and should be valid'  ;
      if(!activeToast){
        toast.error('Email is required and should be valid');
        activeToast = true ;
      }
    }

    //Check a Survey Topic is selected
    if(!data.surveytopic){
      errors.surveytopic = 'A topic must be selected' ;
      if(!activeToast){
        toast.error('A topic must be selected') ;
        activeToast = true ;
      }
    }

    //check Technology section Fields
    if(data.surveytopic === 'technology'){
      if(!data.favouriteprogramminglanguage){
        errors.favouriteprogramminglanguage = 'Choose a programming language';
        if(!activeToast){
          toast.error('Choose a programming language') ;
          activeToast = true ;
        }
      }else if(!data.yearsofexperience || data.yearsofexperience <= 0){
        errors.yearsofexperience = 'Experience is required and should be greater than Zero' ;
        if(!activeToast){
          toast.error('Experience is required and should be greater than Zero');
          activeToast = true ;
        }
      }
    }

    //Check Health Section Fields
    if(data.surveytopic === 'health'){
      if(!data.exercisefrequency){
        errors.exercisefrequency = 'Exercise Frequency requires an option to be selected';
        if(!activeToast){
          toast.error('Exercise Frequency requires an option to be selected');
          activeToast = true ;
        }
      }else if(!data.dietpreference){
        errors.dietpreference = 'Diet Preference is required';
        if(!activeToast){
          toast.error('Diet Preference is required');
          activeToast = true ;
        }
      }
    }

    //Check Education Section Fields 
    if(data.surveytopic === 'education'){
      if(!data.highestqualification){
        errors.highestqualification = 'Select your Highest Qualification' ;
        if(!activeToast){
          toast.error('Select your Highest Qualification');
          activeToast = true ;
        }
      }else if(!data.fieldofstudy){
        errors.fieldofstudy = 'Enter Your Field of study' ;
        if(!activeToast){
          toast.error('Enter Your Field of study');
          activeToast = true ;
        }
      }
    }

    //Check Feedback section
    if(!data.feedback || data.feedback.length <= 50){
      errors.feedback = 'Feedback is required and should be 50 characters long';
      if(!activeToast){
        toast.error('Feedback is required and should be 50 characters long');
        activeToast = true ;
      }
    }

    return errors ;

  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm(data);
  
    if (errors && Object.keys(errors).length > 0) {
      setErrors(errors);
    } else {
      setSubmitted(true);
      setFetching(true) ;
      setSubmittedData({...data});
      setData({ 
        fullName :'',
        email : '',
        surveytopic : '',
        favouriteprogramminglanguage : '',
        yearsofexperience : '',
        exercisefrequency : '',
        dietpreference : '',
        highestqualification : '',
        fieldofstudy : '',
        feedback : ''
      });
      toast.success('Form Submitted successfully !')
    }
  };

  useEffect(() => {
    if (fetching && submittedData) {
      // Map survey topics to Trivia API categories
      const topicToCategoryMap = {
        'general knowledge': 'general_knowledge',
        'science': 'science',
        'sports': 'sports_and_leisure',
        'history': 'history',
        // Add more mappings as needed
      };

      const category = topicToCategoryMap[submittedData.surveytopic.toLowerCase()] || 'general_knowledge';

      const fetchQuestions = async () => {
        try {
          const response = await fetch(`https://the-trivia-api.com/api/questions?categories=${category}&limit=5`);
          if (!response.ok) {
            throw new Error('Failed to fetch questions');
          }
          const data = await response.json();
          setAdditionalQuestions(data);
        } catch (error) {
          console.error(error);
          setAdditionalQuestions([]);
        } finally {
          setFetching(false);
        }
      };

      fetchQuestions();
    }
  }, [fetching , submittedData ]);

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <form
          className="form col-12 col-sm-8 col-lg-5 border border-3 border-dark rounded py-3 shadow"
          onSubmit={handleSubmit}
        >
          <h2 className="text-center text-primary bg-body-tertiary mb-3">Survey Form</h2>

          <div className="d-flex flex-column gap-1 align-items-center mb-3">
            <label className="fw-bold">Full Name</label>
            <input
              type="text"
              placeholder="e.g., John Doe"
              className="w-75 px-3 border border-2 border-dark rounded"
              style={{ height: '2.5rem' }}
              value={data.fullName}
              onChange={handleNameChange}
            />
            {errors.fullName && <span className='text-danger fw-bold'>{errors.fullName}</span>}
          </div>

          <div className="d-flex flex-column gap-1 align-items-center mb-3">
            <label className="fw-bold">Email</label>
            <input
              type="email"
              placeholder="e.g., abc@gmail.com"
              className="w-75 px-3 border border-2 border-dark rounded"
              style={{ height: '2.5rem' }}
              value={data.email}
              onChange={handleEmailChange}
            />
            {errors.email && <span className='text-danger fw-bold'>{errors.email}</span>}
          </div>

          <div className="d-flex flex-column gap-1 align-items-center mb-3">
            <label className="fw-bold">Survey Topics</label>
            <select
              className="text-center p-2 border border-2 rounded border-dark"
              value={data.surveytopic}
              onChange={(e)=>setData({...data , surveytopic : e.target.value})}
            >
              <option value="">Select an option</option>
              {surveyTopics.map((topic) => (
                <option value={topic.value} key={topic.id}>
                  {topic.label}
                </option>
              ))}
            </select>
            {errors.surveyTopic && <span>{errors.surveyTopic}</span>}
          </div>

          {data.surveytopic === 'technology' && (
            <div className="d-flex flex-column gap-2 align-items-center mt-3">
              <div className="d-flex flex-column">
                <label className="mb-1 fw-bold">Favorite Programming Language</label>
                <select
                  className="text-center border border-2 border-dark rounded p-1"
                  value={data.favouriteprogramminglanguage}
                  onChange={(e)=>setData({...data , favouriteprogramminglanguage : e.target.value})}
                >
                  <option value="">Select an option</option>
                  {favouriteProgrammingLanguage.map((language) => (
                    <option value={language.value} key={language.id}>
                      {language.label}
                    </option>
                  ))}
                </select>
                {errors.programmingLanguage && <span>{errors.programmingLanguage}</span>}
              </div>
              <div className="d-flex flex-column align-items-center">
                <label className="fw-bold mb-1">Years of Experience</label>
                <input
                  type="number"
                  placeholder="e.g., 4"
                  className="w-50 p-2 border border-2 border-dark rounded"
                  style={{ height: '1.8rem' }}
                  value={data.yearsofexperience}
                  onChange={(e)=>setData({...data , yearsofexperience : e.target.value})}
                />
                {errors.yearsOfExperience && <span>{errors.yearsOfExperience}</span>}
              </div>
            </div>
          )}

          {data.surveytopic === 'health' && (
            <div className="d-flex flex-column gap-2 align-items-center mt-3">
              <div className="d-flex flex-column">
                <label className="mb-1 fw-bold">Exercise Frequency</label>
                <select
                  className="text-center border border-2 border-dark rounded p-1"
                  value={data.exercisefrequency}
                  onChange={(e)=>setData({...data , exercisefrequency : e.target.value})}
                >
                  <option value="">Select an option</option>
                  {exerciseFrequency.map((exercise) => (
                    <option value={exercise.value} key={exercise.id}>
                      {exercise.label}
                    </option>
                  ))}
                </select>
                {errors.exerciseFrequency && <span>{errors.exerciseFrequency}</span>}
              </div>
              <div className="d-flex flex-column align-items-center">
                <label className="fw-bold mb-1">Diet Preference</label>
                <select
                  className="text-center border border-2 border-dark rounded p-1"
                 value={data.dietpreference}
                 onChange={(e)=>setData({...data , dietpreference : e.target.value})}
                >
                  <option value="">Select an option</option>
                  {dietPreference.map((diet) => (
                    <option value={diet.value} key={diet.id}>
                      {diet.label}
                    </option>
                  ))}
                </select>
                {errors.dietPreference && <span>{errors.dietPreference}</span>}
              </div>
            </div>
          )}

          {data.surveytopic === 'education'? (
            <div className="d-flex flex-column gap-2 align-items-center mt-3">
              <div className="d-flex flex-column">
                <label className="mb-1 fw-bold">Highest Qualification</label>
                <select
                  className="text-center border border-2 border-dark rounded p-1"
                  value={data.highestqualification}
                  onChange={(e)=>setData({...data , highestqualification : e.target.value})}
                >
                  <option value="">Select an option</option>
                  {highestQualification.map((qualification) => (
                    <option value={qualification.value} key={qualification.id}>
                      {qualification.label}
                    </option>
                  ))}
                </select>
                {errors.highestQualification && <span>{errors.highestQualification}</span>}
              </div>
              <div className="d-flex flex-column align-items-center">
                <label className="fw-bold mb-1">Field of Study</label>
                <input
                  type="text"
                  placeholder="e.g., BCA"
                  className="w-50 p-2 border border-2 border-dark rounded"
                  style={{ height: '1.8rem' }}
                  value={data.fieldofstudy}
                  onChange={(e)=>setData({...data , fieldofstudy : e.target.value})}
                />
                {errors.fieldOfStudy && <span>{errors.fieldOfStudy}</span>}
              </div>
            </div>
          ):null}

          <div className="d-flex flex-column gap-1 align-items-center mb-3 mt-3">
            <label className="fw-bold mb-1">Feedback</label>
            <textarea
              rows={4}
              cols={40}
              placeholder="Your Feedback..."
              className="border border-2 rounded border-dark p-2"
              value={data.feedback}
              onChange={(e) => setData({...data, feedback: e.target.value })}
            />
            {errors.feedback && <span className='fw-bold text-danger'>{errors.feedback}</span>}
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
      <div className="text-start my-4">
        {submitted && (
          <div className='border border-3 shadow px-4'>
          <h4 className='fw-bold text-success'>
            Your response has been recieved successfully !
          </h4>
          <p className='fw-bold text-primary'>
              A copy of your a data has been displayed along with some questions related to your topic :
          </p>
          <ul style={{listStyleType:'none'}} className='text-start ps-0 ms-0'>
            <li className='mb-1'>
              <span className='fw-bold'>
                Full Name :
              </span>
              <span> </span>
              <span>
                {submittedData.fullName}
              </span>
            </li>
            <li className='mb-1'>
              <span className='fw-bold'>
                Email :
              </span>
              <span> </span>
              <span>
                {submittedData.email}
              </span>
            </li>
            <li className='mb-1'>
              <span className='fw-bold'>
                Topic :
              </span>
              <span> </span>
              <span>
                {submittedData.surveytopic}
              </span>
            </li>
            <li className='mb-1'>
              {submittedData.surveytopic === 'technology' && (
                <div className='d-flex flex-column gap-1'>
                  <li>
                    <span className="fw-bold mb-1">
                      Favourite Programming Language :
                    </span>
                    <span> </span>
                    <span>
                      {submittedData.favouriteprogramminglanguage}
                    </span>
                  </li>
                  <li>
                    <span className="fw-bold mb-1">
                      Years of Experience :
                    </span>
                    <span> </span>
                    <span>
                      {submittedData.yearsofexperience}
                    </span>
                  </li>
                </div>
              )}
            </li>
            <li className='mb-1'>
              {submittedData.surveytopic === 'health' && (
                <div className='d-flex flex-column gap-1'>
                  <li>
                    <span className="fw-bold mb-1">
                      Exercise Frequency :
                    </span>
                    <span> </span>
                    <span>
                      {submittedData.exercisefrequency}
                    </span>
                  </li>
                  <li>
                    <span className="fw-bold mb-1">
                      Diet Preference :
                    </span>
                    <span> </span>
                    <span>
                      {submittedData.dietpreference}
                    </span>
                  </li>
                </div>
              )}
            </li>
            <li className='mb-1'>
              {submittedData.surveytopic === 'education' && (
                <div className='d-flex flex-column gap-1'>
                  <li>
                    <span className="fw-bold mb-1">
                      Highest Qualification :
                    </span>
                    <span> </span>
                    <span>
                      {submittedData.highestqualification}
                    </span>
                  </li>
                  <li>
                    <span className="fw-bold mb-1">
                      Field of Study :
                    </span>
                    <span> </span>
                    <span>
                      {submittedData.fieldofstudy}
                    </span>
                  </li>
                </div>
              )}
            </li>
          </ul>
          <label className='fw-bold mb-1'>Additional Questions</label>
          {fetching ? (
            <p>Loading...</p>
          ) : additionalQuestions.length > 0 ? (
            <ol className=''>
              {additionalQuestions.map((question, index) => (
                <li key={index}>{question.question}</li>
              ))}
            </ol>
          ) : (
            <p>No additional questions available.</p>
          )}
          <div>
           <p className='fw-bold text-warning'>
            Enter a new data to see updated summary or else refresh to hide the summary section 
           </p>
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyForm;
