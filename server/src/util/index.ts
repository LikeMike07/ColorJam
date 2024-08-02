import axios from 'axios';
import Vibrant from 'node-vibrant';

export function getPreviewsForArtists(artists: any[], access_token: string) {
    const requests = artists.map((artist) =>
        axios.get(
            `https://api.spotify.com/v1/artists/${artist.id}/top-tracks`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                params: {
                    market: 'US',
                },
            }
        )
    );

    return axios.all(requests).then(
        axios.spread((...responses) => {
            return responses.map((response, index) => {
                return { ...artists[index], topSong: response.data.tracks[0] };
            });
        })
    );
}

export async function getPallete(imageUrl: string) {
    console.log(imageUrl);
    if (!imageUrl) {
        return {};
    }

    const vibrant = new Vibrant(`${decodeURI(imageUrl as string)}`);
    return await vibrant
        .getPalette()
        .then((palette) => {
            const colors: Record<string, { hex: string }> = {};
            for (const key in palette) {
                colors[key] = { hex: palette[key]?.getHex() ?? '' };
            }
            console.log(colors);
            return colors;
        })
        .catch((error) => {
            console.log('Failed to get colors', error);
        });
}
