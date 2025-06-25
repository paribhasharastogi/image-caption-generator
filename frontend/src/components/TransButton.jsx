import React, { useEffect, useState, useRef } from 'react';

const TransButton = ({ callback, cap }) => {
    const [languageOptions, setLanguageOptions] = useState([
        { code: "en", name: "English" },
        { code: "hi", name: "Hindi" },
        { code: "mr", name: "Marathi" },
        { code: "fr-ca", name: "French" },
        { code: "zh-Hans", name: "Chinese" },
        { code: "ru", name: "Russian" },
        { code: "ja", name: "Japanese" }
    ]);
    const [to, setTo] = useState('en');

    const prevTo = useRef(to);

    const handleTranslate = async () => {
        console.log(cap);

        if (to === "en") {
            callback(cap);
        } else {
            const url = "https://rapid-translate-multi-traduction.p.rapidapi.com/t";
            const fetchOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-rapidapi-key": "dfd25b0543msh7af6bd51c53d916p1b8dcbjsn1940f66295f5",
                    "x-rapidapi-host": "rapid-translate-multi-traduction.p.rapidapi.com"
                },
                body: JSON.stringify({
                    from: "en",    // Source language (can be dynamic if needed)
                    to: to,        // Target language selected by user
                    q: cap         // Text to be translated
                })
            };

            try {
                const response = await fetch(url, fetchOptions);
                const result = await response.json();

                // Log the full response to see its structure
                console.log("API Response:", result);

                // The response seems to contain an array directly, so we access it accordingly
                if (Array.isArray(result) && result.length > 0) {
                    callback(result[0]);  // Extract the translated text directly from the array
                } else {
                    console.error("No translations found in the response.");
                }
            } catch (error) {
                console.error("Error during translation:", error);
            }
        }
    };

    const handleLanguageChange = (e) => {
        setTo(e.target.value);
    };

    useEffect(() => {
        if (prevTo.current !== to) {
            console.log(to);
            prevTo.current = to;
        }
    }, [to]);

    return (
        <>
            <div style={{ margin: "14px 2px", marginLeft: "157px" }}>
                <select onChange={handleLanguageChange}>
                    {languageOptions.map((opt) => (
                        <option key={opt.code} value={opt.code}>
                            {opt.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <button className="translate-btn" onClick={handleTranslate}>
                    Translate
                </button>
            </div>
        </>
    );
};

export default TransButton;
