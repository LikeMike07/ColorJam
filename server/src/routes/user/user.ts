import e, { Router } from "express";
import axios from "axios";

const SPOTIFY_BASE = 'https://api.spotify.com/v1'
const userRouter = Router();

userRouter.get('/', (req, res) => {
  console.log(req.params)
    const access_token = req.body.access_token || null;

    axios.get(`${SPOTIFY_BASE}/me`, {
      headers: {
        "Authorization": `Bearer ${access_token}`
      }
    })
    .then((response) => {
      res.send(response.data)
    })
    .catch(error => {
      if (error.response.status === 401) {
        res.status(401).send('Unauthorized');
      } else {
        res.status(500).send('Spotify responded with a status ' + error.response.status);
      }
    })
  });

export default userRouter;