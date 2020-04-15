import React, { useState, useEffect } from 'react';
import UserLanguages from './components/UserLanguages';
import Phone from './components/Phone';
import { updateUser, getUser } from './services/Users';
import getToken from './services/TwilioAuth';
import './App.css';

// TODO figure out login
const USER_ID = 1;
// TODO fetch this instead
const ALL_LANGUAGES = ['english', 'malay', 'mandarin', 'tamil'];

function App() {
  const [userLanguages, setUserLanguages] = useState(new Set());
  const [twilioToken, setTwilioToken] = useState(null);
  useEffect(() => {
    (async () => {
      const user = await getUser(USER_ID);
      setUserLanguages(new Set(user.languages));
    })();
  }, []);
  useEffect(() => {
    (async () => {
      const newToken = await getToken();
      setTwilioToken(newToken);
    })();
  }, []);

  const addUserLanguage = (userLanguage) => {
    const newUserLanguages = new Set(userLanguages);
    newUserLanguages.add(userLanguage);
    setUserLanguages(newUserLanguages);
  };
  const removeUserLanguage = (userLanguage) => {
    const newUserLanguages = new Set(userLanguages);
    newUserLanguages.delete(userLanguage);
    setUserLanguages(newUserLanguages);
  };

  const handleSubmit = async () => {
    const newUser = await updateUser(USER_ID, userLanguages);
    setUserLanguages(new Set(newUser.languages));
  };

  return (
    <>
      <h1>Ring a senior</h1>
      <div id="userLanguagesDiv">
        <h2>Which of these do you speak?</h2>
      </div>
      <div id="callsDiv" />
      <UserLanguages
        allLanguages={ALL_LANGUAGES}
        removeUserLanguage={removeUserLanguage}
        userLanguages={userLanguages}
        addUserLanguage={addUserLanguage}
        handleSubmit={handleSubmit}
      />
      {twilioToken ? <Phone token={twilioToken} /> : null}
    </>
  );
}

export default App;
