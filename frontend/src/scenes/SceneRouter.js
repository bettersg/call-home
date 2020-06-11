import React, { useState } from 'react';
import SCENES from './enums';
import { Login, CallingPage, ContactsPage, Signup } from './index';

export default function SceneRouter() {
  const [currentScene, setCurrentScene] = useState(SCENES.LOGIN);
  switch (currentScene) {
    case SCENES.LOGIN:
      return <Login setCurrentScene={setCurrentScene} />;
    case SCENES.SIGNUP:
      return <Signup />;
    case SCENES.CALLING_PAGE:
      return <CallingPage />;
    case SCENES.CONTACTS_PAGE:
      return <ContactsPage />;
    default:
      // TODO handle the error gracefully
      throw new Error('Invalid scene specified');
  }
}
