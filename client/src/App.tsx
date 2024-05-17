import React from "react";
import callSpotifyApi from "./api/callSpotifyApi";

export default function App(){

    return (
        <div>
            <h1>Hello</h1>
            <button onClick={() => callSpotifyApi('/user', {method: 'GET'})}>TestRequest</button>
        </div>
    )
}