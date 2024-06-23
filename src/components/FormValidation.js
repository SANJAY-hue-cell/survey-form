import { toast } from 'react-hot-toast';

let activeToast = false; // Move this variable outside the function

export const validateSurveyForm = (data) => {
    const errors = {};

    //Full Name Validation
    if (!data.fullname) {
        errors.fullname = 'Full Name is required';
        if (!activeToast) {
            toast.error('Name is required');
            activeToast = true;
        }
    } else {
        activeToast = false; // Reset the flag when the error is resolved
    }

    return errors;
};