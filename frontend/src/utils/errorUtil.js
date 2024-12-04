// utils/errorUtils.js
import { useState } from 'react';
import ErrorPopup from '../components/ErrorPopup';

export const useErrorPopup = () => {
  const [errorMessage, setErrorMessage] = useState(null);

  const showErrorPopup = (message) => {
    setErrorMessage(message);
  };

  const hideErrorPopup = () => {
    setErrorMessage(null);
  };

  const ErrorPopupComponent = errorMessage ? (
    <ErrorPopup message={errorMessage} onClose={hideErrorPopup} />
  ) : null;

  return { showErrorPopup, ErrorPopupComponent };
};