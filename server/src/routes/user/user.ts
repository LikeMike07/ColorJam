import e, { Router } from 'express';
import axios from 'axios';
import { getPreviewsForArtists } from '../../util';

const SPOTIFY_BASE = 'https://api.spotify.com/v1';
const userRouter = Router();

userRouter.get('/', (req, res) => {
    const access_token = req.query['access_token'] || null;

    axios
        .get(`${SPOTIFY_BASE}/me`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })
        .then((response) => {
            axios
                .get(`http://localhost:${process.env.PORT}/colors`, {
                    params: {
                        imageUrl: response.data.images[1].url,
                    },
                })
                .then((colorResponse) => {
                    console.log('colors:', colorResponse.data);
                    res.send({ ...response.data, colors: colorResponse.data });
                });
        })
        .catch((error) => {
            if (error.response.status === 401) {
                res.status(401).send('Unauthorized');
            } else {
                res.status(500).send(
                    'Spotify responded with a status ' + error.response.status
                );
            }
        });
});

userRouter.get('/top-artists', (req, res) => {
    const access_token = req.query['access_token'] || null;

    axios
        .get(`${SPOTIFY_BASE}/me/top/artists`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            params: {
                limit: 24,
            },
        })
        .then((response) => {
            res.send(response.data.items);
            // getPreviewsForArtists(response.data.items, access_token as string)
            //   .then((artists) => {
            //     res.send(artists);
            //   })
        })
        .catch((error) => {
            if (error.response.status === 401) {
                res.status(401).send('Unauthorized');
            } else {
                res.status(500).send(
                    'Spotify responded with a status ' + error.response.status
                );
            }
        });
});

userRouter.get('/top-tracks', (req, res) => {
    const access_token = req.query['access_token'] || null;

    axios
        .get(`${SPOTIFY_BASE}/me/top/tracks`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            params: {
                limit: 24,
            },
        })
        .then((response) => {
            res.send(response.data.items);
        })
        .catch((error) => {
            if (error.response.status === 401) {
                res.status(401).send('Unauthorized');
            } else {
                res.status(500).send(
                    'Spotify responded with a status ' + error.response.status
                );
            }
        });
});

export default userRouter;
