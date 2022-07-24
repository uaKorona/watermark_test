import Jimp from "jimp";
import { BlendMode } from "@jimp/core/types/etc";

export const img = () => Jimp.read('./assets/random.png')
    .then((tpl) => tpl.clone())
    .then((tpl) =>
        Jimp.read('./assets/logo.png').then((logoTpl) => {
            const options: BlendMode = {
                mode: Jimp.BLEND_SOURCE_OVER,
                opacityDest: 1,
                opacitySource: 0.5
            }

            return tpl.composite(logoTpl, 100, 200, options)
        }),
    )
    .then((tpl) => tpl.write(`raw/${Date.now()}.png`))

