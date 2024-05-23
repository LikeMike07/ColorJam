import { Router } from "express";
import Vibrant from "node-vibrant";

const colorsRouter = Router();

colorsRouter.get("/", (req, res) => {
    const imageUrl = req.query.imageUrl

    if (!imageUrl) {
        res.status(400).send('No image URL provided');
    }
    
    const vibrant = new Vibrant(`${decodeURI(imageUrl as string)}`);
    vibrant.getPalette().then(palette => {
        const colors: Record<string, {rgb: any}> = {};
        for (const key in palette) {
            colors[key] = {rgb: palette[key]?.rgb ?? ''}
        }
        res.json(colors);
    }).catch(error => {
        console.log('Failed to get colors', error);
    });
});

export default colorsRouter;