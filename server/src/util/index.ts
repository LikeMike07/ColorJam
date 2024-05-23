import axios from 'axios';

export function getPreviewsForArtists(artists: any[], access_token: string) {
    const requests = artists.map((artist) => 
        (axios.get(`https://api.spotify.com/v1/artists/${artist.id}/top-tracks`, {
            headers: {
                "Authorization": `Bearer ${access_token}`
            },
            params: {
                market: 'US'
            }
        }))
    );

    return axios.all(requests).then(axios.spread((...responses) => {
        return responses.map((response, index) => {
            return { ...artists[index], topSong: response.data.tracks[0] }
        });
    }));
}
