import React, { useState, useEffect } from "react";
import "../index.css";
import Topbar from "../Topbar";
import UploadPageBg from "../background/UpdatePageBg.jpg";
import Result from "./Result";

const ImageCaptionGenerator = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [bool, setBool] = useState(false);
    const [name, setName] = useState("");

    const handleImageChange = (event) => {
        const img = event.target.files[0];
        if (img) {
            setSelectedFile(img);
        }
    };

    const handleGenerateCaption = () => {
        if (selectedFile) {
            setBool(true);
        } else {
            window.alert("Select image first");
        }
    };

    const fetchUser = async () => {
        try {
            const response = await fetch("http://localhost:8000/fetchnotes", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    token: localStorage.getItem("token"),
                },
            });

            const json = await response.json();
            setName(json.firstname);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    useEffect(() => {
        if (localStorage.getItem("token")) {
            fetchUser();
        }
    }, []);

    return (
        <>
            <div>
                {!bool ? (
                    <div
                        className="divtop"
                        style={{
                            backgroundImage: `url(${UploadPageBg})`,
                        }}
                    >
                        <Topbar />
                        <div className="div1">
                            <div className="rightbar">
                                {localStorage.getItem("token") ? (
                                    <h1 className="heading">Hello {name}</h1>
                                ) : (
                                    <h1 className="heading">Welcome to Vision Verse</h1>
                                )}

                                <h2 style={{ color: "black", fontSize: "18px", marginLeft: "100px" }}>
                                    {/* Let Images Speak <br /> */}
                                    Upload an Image to Generate Captivating Captions!
                                </h2>
                                <br></br>

                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ color: "black" }}
                                    onChange={handleImageChange}
                                />

                                <div className="imgdiv">
                                    {preview && (
                                        <img className="imgcss" src={preview} alt="Selected" />
                                    )}
                                </div>

                                <div>
                                    <button className="btnGenerate" onClick={handleGenerateCaption}>
                                        Generate Caption!
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Result img={selectedFile} />
                )}
            </div>
        </>
    );
};

export default ImageCaptionGenerator;
