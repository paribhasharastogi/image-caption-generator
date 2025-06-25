import React, { useEffect, useState } from 'react';
import Loader from './Loader';
import ResultPageBg from '../background/UpdatePageBg.jpg';
import '../bgvid.mp4';
import { useSpeechSynthesis } from 'react-speech-kit';
import TransButton from './TransButton';
import Upload from './Upload';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const Result = (props) => {
  const [preview, setPreview] = useState();
  const [caption, setCaption] = useState(); // Changing caption on UI
  const [cap, setCap] = useState(); // Constant caption
  const { speak } = useSpeechSynthesis();
  const [bool1, setBool] = useState(false);

  const handleListen = () => {
    speak({ text: caption });
  };

  const callback = (lang) => {
    setCaption(lang);
  };

  const fetchCaption = async () => {
    const formData = new FormData();
    formData.append('file', props.img);

    try {
      const url = `http://127.0.0.1:5000/after`;
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setCaption(data.caption);
      setCap(data.caption);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setPreview(URL.createObjectURL(props.img));
    fetchCaption();
  }, []);

  const handleClick = () => {
    setBool(true);
  };

  return (
    <>
      {!bool1 && (
        <div className="result-page">
          <img className="result-page" src={ResultPageBg} alt="Result Page Background" />
          <div className="result-window">
            <button
              style={{ color: 'black', marginLeft: "-31rem" }}
              className='result-logout'
              onClick={handleClick}
            >
              Go back
            </button>
            <br />
            {preview && <img className="result-image" src={preview} alt="image" />}
            {caption ? (
              <p className="result-caption">{caption}</p>
            ) : (
              <Loader />
            )}
            <div className='extra-button'>
              {/* Audio and Translation buttons now available regardless of login */}
              <button className="text-to-speech-btn" onClick={handleListen}>
                Convert text to speech
              </button>
              <TransButton callback={callback} cap={cap} />
            </div>
            {/* Removed login checks */}
            {/* <Link to='/login'>Sign in to save your caption (optional)</Link> */}
          </div>
        </div>
      )}

      {bool1 && <Upload />}
    </>
  );
};

export default Result;
