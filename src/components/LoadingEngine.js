import React from "react";
import * as s from "../styles/globalStyles";

const LoadingEngine = ({type, feedback, loggedIn}) => {
    const homepagePath = `${window.location.origin}/paws`;
    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999999
        }}>
            <s.TextDescription>{!feedback ? loggedIn ? <>Connecting to wallet</> : <>Loading the {type} Engine</> : feedback}</s.TextDescription>
            <s.TextDescription2>Please wait</s.TextDescription2>
            <img style={{ maxWidth: 50 }} src={`${homepagePath}/config/images/loader.gif`} alt="" />
        </div>
    );
}

export default LoadingEngine;