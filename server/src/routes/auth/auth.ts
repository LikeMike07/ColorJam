import { Router } from "express";
import { generateRandomString } from "./util";
import axios, { AxiosError } from "axios";

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3008/auth/callback';
const CLIENT_URL = process.env.CLIENT_HOME_URL || 'http://localhost:3000';

const SCOPES = [
  'ugc-image-upload',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'streaming',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-read-email',
  'user-read-private',
  'user-top-read'
];

const authRouter = Router();

authRouter.get("/login", (_req, res) => {
  console.log('login');
  let state = generateRandomString(16);
  res.cookie("spotify_auth_state", state);

  let queryParams = new URLSearchParams({
    response_type: 'code',
    client_id: SPOTIFY_CLIENT_ID ?? '',
    scope: SCOPES.join(' '),
    redirect_uri: SPOTIFY_REDIRECT_URI,
    state: state,
    show_dialog: 'true'
  });

  res.redirect(`${SPOTIFY_AUTH_URL}?${queryParams.toString()}`)
});

authRouter.get("/callback", async (req, res) => {
  let code = req.query.code || null;
  let state = req.query.state || null;
  let storedState = req.cookies ? req.cookies['spotify_auth_state'] : null;

  if (!code) throw new Error('No code provided');

  if (state === null || state !== storedState) {
    res.redirect(`${CLIENT_URL}?` +
      new URLSearchParams({
        error: 'state_mismatch'
      })
    );
  } else {
    res.clearCookie('spotify_auth_state');

    let authOptions = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code as string,
      redirect_uri: SPOTIFY_REDIRECT_URI
    });

    const headers = {
      'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }

    try {
      const response = await axios.post('https://accounts.spotify.com/api/token', authOptions, {headers: headers})
      res.cookie('spotify_access_token', response.data.access_token, {maxAge: response.data.expires_in * 1000});
      res.cookie('spotify_refresh_token', response.data.refresh_token);
      res.redirect(`${CLIENT_URL}`);
    } catch (error) {
      res.redirect(`${CLIENT_URL}?` +
        new URLSearchParams({
          error: 'invalid_token'
        })
      );
    }
  }
});

authRouter.post("/refresh", async (req, res) => {
  let refresh_token = req.body.refresh_token || null;
  if (!refresh_token) throw new Error('No refresh token provided');

  !refresh_token && res.status(400).send('No refresh token provided');
  let authOptions = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refresh_token
  });

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
  }

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
    }, {headers: headers})
    res.cookie('spotify_access_token', response.data.access_token, {maxAge: response.data.expires_in * 1000});
    res.send(response.data);
  } catch (error) {
    res.status(400);
  }
});

export default authRouter;