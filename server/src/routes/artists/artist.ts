import axios from "axios";
import { Router } from "express";

const artistRouter = Router();

artistRouter.get("/", (_req, res) => {
  res.send("Hello from artists");
});

artistRouter.get("/top-songs", (req, res) => {
    const {access_token, artist_id} = req.query;
    axios.get(`https://api.spotify.com/v1/artists/${artist_id}/top-tracks`, {
        headers: {
            "Authorization": `Bearer ${access_token}`
        },
        params: {
            market: 'US'
        }
    }).then((response) => {
        res.send(response.data);
    }).catch((error) => {
        if (error.response?.status === 401) {
            res.status(401).send('Unauthorized');
        } else {
            res.status(500).send(error);
        }
    });
});

export default artistRouter;