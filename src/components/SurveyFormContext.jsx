import React, { createContext, useState } from "react";

const FormContext = createContext();

const FormProvider = ({children}) => {
    const [data , setData ] = useState({
        fullname: '',
        email: '',
        surveytopic: '',
        favouriteprogramminglanguage: '',
        yearsofexperience : '',
        exercisefrequency: '',
        dietpreference: '',
        highestqualification: '',
        fieldofstudy: '',
        feedback: '',
    });

    return(
        <FormContext.Provider value={{data , setData}}>
            {children}
        </FormContext.Provider>
    );
};

export { FormProvider , FormContext };