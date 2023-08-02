import {toggleAzure, toggleWebSpeech} from './utils/toggleSpeech';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import {changeService} from './utils/changeService';
import Microphone from './components/Microphone';
import SpeechToElement from 'speech-to-element';
import React from 'react';
import './App.css';

declare global {
  interface Window {
    SpeechSDK: typeof sdk;
  }
}

function App() {
  const [availableServices, setAvailableServices] = React.useState<{value: string; text: string}[]>([]);
  const [activeService, setActiveService] = React.useState('webspeech');
  const [isRecording, setIsRecording] = React.useState(false);
  const [isPreparing, setIsPreparing] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const textElement = React.useRef(null);
  React.useEffect(() => {
    // WORK - add link for more examples
    if (!window.SpeechSDK) {
      window.SpeechSDK = sdk;
    }
    const availableServicesArr: {value: string; text: string}[] = [{value: 'azure', text: 'Azure Speech'}];
    if (SpeechToElement.isWebSpeechSupported()) availableServicesArr.unshift({value: 'webspeech', text: 'Web Speech'});
    setAvailableServices(availableServicesArr);
  }, []);
  return (
    <>
      <main id="main">
        <h1 id="title">Speech To Element Demo</h1>
        <div id="text" ref={textElement} contentEditable={true}></div>
        <div
          id="button"
          onClick={() => {
            if (activeService === 'webspeech') {
              toggleWebSpeech(textElement, setIsRecording, setIsPreparing, setIsError);
            } else if (activeService === 'azure') {
              toggleAzure(textElement, setIsRecording, setIsPreparing, setIsError);
            }
            if (!isRecording) setIsPreparing(true);
          }}
        >
          <Microphone isRecording={isRecording}></Microphone>
          {isPreparing ? (
            <div>Connecting...</div>
          ) : isError ? (
            <div id="message-error">Error, please check the console for more info</div>
          ) : (
            <div id="message-empty">Placeholder text</div>
          )}
        </div>
        <select
          id="dropdown"
          value={activeService}
          onChange={(event) => {
            changeService(isRecording, isPreparing);
            setActiveService(event.target.value);
          }}
        >
          {availableServices.map((service) => (
            <option key={service.value} value={service.value}>
              {service.text}
            </option>
          ))}
        </select>
        {activeService === 'azure' && (
          <div id="subscription-key-tip">Make sure to set the SUBSCRIPTION_KEY and REGION environment variables</div>
        )}
      </main>
    </>
  );
}

export default App;
