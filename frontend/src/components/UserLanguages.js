import React from 'react';
import _ from 'lodash';

function UserLanguages({
  allLanguages,
  userLanguages,
  addUserLanguage,
  removeUserLanguage,
  handleSubmit,
}) {
  const toggleUserLanguage = (userLanguage) => {
    if (userLanguages.has(userLanguage)) {
      removeUserLanguage(userLanguage);
    } else {
      addUserLanguage(userLanguage);
    }
  };
  const languageFields = _.flatMap(allLanguages, (language) => {
    const inputId = `${language}-checkbox`;
    return [
      <input
        type="checkbox"
        id={inputId}
        key={inputId}
        checked={userLanguages.has(language)}
        value="english"
        onChange={() => toggleUserLanguage(language)}
      />,
      <label key={`${language}-label`} htmlFor={inputId}>
        {language}
      </label>,
    ];
  });

  return (
    <form
      onSubmit={(e) => {
        handleSubmit();
        e.preventDefault();
      }}
    >
      {languageFields}
      <input type="submit" value="Submit" />
    </form>
  );
}

export default UserLanguages;
