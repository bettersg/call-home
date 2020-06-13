import React, { useState } from 'react';
import SCENES from './enums';
import { Login, CallingPage, ContactsPage, VerifyPhoneNumber } from './index';

export default function SceneRouter() {
  const [currentScene, setCurrentScene] = useState(SCENES.LOGIN);
  switch (currentScene) {
    case SCENES.LOGIN:
      return <Login navigate={setCurrentScene} />;
    case SCENES.VERIFY_PHONE_NUMBER:
      return <VerifyPhoneNumber navigate={setCurrentScene} />;
    case SCENES.CALLING:
      return <CallingPage navigate={setCurrentScene} />;
    case SCENES.CONTACTS:
      return <ContactsPage navigate={setCurrentScene} />;
    default:
      // TODO handle the error gracefully
      throw new Error('Invalid scene specified');
  }
}
