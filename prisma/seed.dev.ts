import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const model = await prisma.model.create({
    data: {
      path: 'E:\\sources\\automatic1111-sd-webui\\models\\Stable-diffusion\\526mixUpdate11_526mixV11.safetensors',
      filename: '526mixUpdate11_526mixV11.safetensors',
      thumbnailPath:
        'E:\\sources\\automatic1111-sd-webui\\models\\Stable-diffusion\\526mixUpdate11_526mixV11.preview.png',
      hash: '8bf80f0f',
      metadata: {
        create: {
          serverId: 14734,
          name: '526Mix',
          nsfw: false,
          description:
            '<p>Example images\' prompts are in InvokeAI\'s formatting.</p><p><strong>USAGE TIPS AND BEST PRACTICES AND SETTINGS:</strong></p><ul><li><p><u>Keep CFG at 5 to 6, as this model is a tad overbaked.</u></p></li><li><p>~40-45 steps recommended when <em>not</em> using img2img to upscale as your high-res fix.</p></li><li><p>img2img at 0.47 to 0.55 strength and same step count is recommended for high-res fix. InvokeAI users should enable High Res Optimization, ideally at the same strength. With that enabled, you can get away with 30-35 steps on DDIM, k_euler_a, and DPM samplers to get clean and fully-detailed results.</p></li><li><p><a target="_blank" rel="ugc" href="https://huggingface.co/JPPhoto/neg-sketch-2">&lt;neg-sketch-2&gt;</a> highly recommended for boosting photorealism and 3D art in many cases, though may occasionally behave oddly for certain prompts (e.g. interior images, spaghetti demons).</p></li><li><p>Best results at at least 768x resolution in either direction.</p></li><li><p>When prompting for a person\'s age, try typing their age in words, not numbers. Numbers are tokenized separately, so prompting for a <em>42yo</em> instead of a <em>forty two year old</em> can give you a man-sized kid.</p></li><li><p>If your images are a bit dark, try putting <em>low light</em> in your negative prompt to kill dark lighting effects, or <em>dark</em> to kill dark coloring.</p></li><li><p>DPM samplers like DPM++ Karras 2 are more liable for artifacting and weirdness in this model, and may need extra steps. DDIM is preferable.</p></li><li><p>Other negative embeddings besides &lt;neg-sketch-2&gt; (e.g. bad-artist-anime, bad-hands-5, bad_prompt_version2) are generally not recommended, as they impact art style and model expressiveness and have little, if any, actual benefit.</p></li><li><p>k_heun is excellent for photorealism, but is very slow. Some prompts can work fine at only 15 steps, but others may come out wobbly until 30 steps.</p></li><li><p>When generating cozy interior design images, a higher img2img/InvokeAI HRO strength like 0.65 can do good for detail level and sharpness.</p></li></ul><p></p><p><strong>Update V1.4.5</strong>: This version tries to somewhat reduce iris and pupil distortion in peoples\' eyes and improve general coherence somewhat, on average. Also, it\'s a touch less dark. This was accomplished by building a sub-mix with similar behavior to V1.4, but with better eyes and 50% noise offset, then mixing that in at 20% and hoping for the best. Seemed to work okay. Has occasional interpolation weirdness in a few prompts.</p><p></p><p>Anime / 2D animated-optimized version here: <a target="_blank" rel="ugc" href="https://civitai.com/models/35893?modelVersionId=42086">https://civitai.com/models/35893?modelVersionId=42086</a></p><p>Surreal / vivid illustration mix: <a target="_blank" rel="ugc" href="https://civitai.com/models/44596">https://civitai.com/models/44596</a></p><p></p><p>My personal merge of Stable Diffusion 1.5 custom models using the noise offset to improve contrast and dark images. An inpainting model is provided to make inpainting in the model’s styles and detail easier. <strong><em>\'Negative\' embeddings (besides &lt;neg-sketch-2&gt; for photographic and 3D art) generally not recommended as they interfere with art styles and aesthetics (unless that\'s what you want, of course).</em></strong></p><p></p><p>This model is meant to be:</p><ul><li><p>Artistic and elegant</p></li><li><p>Drop-dead easy to work with</p></li><li><p>Good at making cool characters and landscapes</p></li><li><p>Not bound or leaning towards any single style</p></li><li><p>Killer at digital and conventional art in many aesthetics</p></li><li><p>And above all, fun</p></li></ul><p>It’s not so great at explicit sexual content and anime*, including anime-based embeddings. There’s a million other models for those if that’s what you’re after. <br /><br />*There is some ability to bring out a neat anime aesthetic when you prompt for \'anime style\', which I find to be quite cool to look at, although it can be a bit finicky. If you try to make anime-esque art with this model, do not put \'portrait\' in your negative prompt, or use \'close\' or \'closeup\' in your positive prompt, as those seem to force it into a 3d-like style even if you add more weight on the anime style.</p><p></p><p>I want to also bring attention to whosawhatsis\' <a target="_blank" rel="ugc" href="https://civitai.com/models/10540/verisimilitude">verisimilitude,</a> which is great at readily making wallpaper-quality photorealistic stuff.</p><p></p><p>I also want to shoutout coreco and his <a target="_blank" rel="ugc" href="https://civitai.com/models/1315/seekart-mega">seek.art MEGA v2</a>, which was responsible for much of the composition of V1.3-V1.4, and is an excellent update to his Mega model.</p><p></p><p>This model has a baked-in VAE based on <a target="_blank" rel="ugc" href="https://huggingface.co/hakurei/waifu-diffusion-v1-4">Waifu Diffusion 1.4</a> by hakurei. You can switch this out (such as to <a target="_blank" rel="ugc" href="https://huggingface.co/stabilityai/sd-vae-ft-mse-original/tree/main">vae-ft-mse-840000-ema-pruned</a>) if you wish, though I used that one specifically because it helped improve detail quality in some art styles and situations.</p><p></p><p>Example images were generated in Invoke AI. This means unless you use Invoke AI, you likely won\'t be able to recreate my images exactly. Just learn from the prompts and modify the weighting in prompts as needed for the UI you use (if you use the A1111 UI, any (plus sign)+ is equal to one set of parentheses).</p><p></p><p>By downloading, you agree to the creativeml-openrail-m and <a target="_blank" rel="ugc" href="https://huggingface.co/dreamlike-art/dreamlike-diffusion-1.0/blob/main/LICENSE.md">Dreamlike-art</a> licenses.</p><p></p><p>Credits (V1.4 / V1.3.5):</p><ul><li><p><a target="_blank" rel="ugc" href="https://civitai.com/models/3738/roboetics-mix">Roboetic’s Mix</a> – Roboetic</p></li><li><p><a target="_blank" rel="ugc" href="https://civitai.com/models/1315/seekart-mega">seek.art MEGA v2</a> – coreco</p></li><li><p><a target="_blank" rel="ugc" href="https://civitai.com/models/1116/rpg">RPG V4</a> – Anashel</p></li><li><p><a target="_blank" rel="ugc" href="https://civitai.com/models/16371">HeStyle V1.5</a> - krstive</p></li><li><p><a target="_blank" rel="ugc" href="https://civitai.com/models/8067/movie-diffusion-v12">Movie Diffusion</a> - Dalle2Pictures</p></li><li><p><a target="_blank" rel="ugc" href="https://civitai.com/models/1265/analog-diffusion">Analog Diffusion</a> and <a target="_blank" rel="ugc" href="https://civitai.com/models/2292/portrait">Portrait+</a> - wavymulder</p></li><li><p><a target="_blank" rel="ugc" href="https://civitai.com/models/9388/realscifi">RealSciFi</a> - AIfriend</p></li><li><p><a target="_blank" rel="ugc" href="https://huggingface.co/Dunkindont/Foto-Assisted-Diffusion-FAD_V0">Foto-Assisted Diffusion</a> - Dunkindont</p></li><li><p><a target="_blank" rel="ugc" href="https://civitai.com/models/3164/fantasy-art-style">fantasy-art-style v1.8</a> - kasukanra</p></li><li><p><a target="_blank" rel="ugc" href="https://huggingface.co/22h/vintedois-diffusion-v0-2">Vintedois Diffusion</a> - Predogl and piEsposito</p></li><li><p><a target="_blank" rel="ugc" href="https://www.crosslabs.org/blog/diffusion-with-offset-noise">noise offset</a> – Nicholas Guttenberg</p></li></ul>',
          creator: '526christian',
          type: 'Checkpoint',
          versions: {
            create: [
              {
                serverId: 18263,
                name: 'V1.1',
                description:
                  '<p><strong>Edit: I probably wouldn\'t download this version, though it is pretty good at paintings and has more anime-like faces, if those are traits you like.</strong></p><p>This version takes some more skill to control and has a tendency to want to generate grand landscapes when generating a character in a certain location, but landscapes are sharper and prettier, and the model is more artistic in general. Higher risk, higher reward. Also likes mountains.</p><p><strong><br /></strong>This version incorporates a mix of Satyam_SSJ10\'s Fantasy Background model and ItsJayQz\'s Firewatch Diffusion to improve landscape sharpness and dramatic... ness? The RPG-Fantasy models and <a target="_blank" rel="ugc" href="http://seek.art">seek.art</a> are mixed in at a somewhat higher addition, as well.</p><p><br />Model recipe:</p><p>Roboetic\'s Mix + Kenshi 01 * 0.15 weighted sum = RoboKen</p><p>RPG V4 + FantasyMixV1 * 0.35 weighted sum = RPGFant</p><p>Fantasy Background + Firewatch Diffusion * 0.6 weighted sum = FantWatch</p><p>(RoboKen + RPGFant *<em> </em>0.4 weighted sum) + FantWatch * 0.6 add difference</p><p>+<a target="_blank" rel="ugc" href="http://seek.art">seek.art</a> * 0.35 add difference</p><p>+noise offset * 0.75 add difference</p>',
                baseModel: 'SD 1.5',
                merges: {
                  create: ['hassanBlendV1.5'].map((x) => ({ name: x })),
                },
                triggers: {
                  create: ['realism'].map((x) => ({ name: x })),
                },
                createdAt: '2023-03-04T01:51:52.033Z',
                updatedAt: '2023-04-27T00:15:40.837Z',
                fileName: '526mixV145_v11.safetensors',
                images: {
                  create: [
                    {
                      url: 'https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/e08588bb-b787-4d92-13be-aecdcbab1500/width=450/188003.jpeg',
                      hash: 'U02?HO0L8wxFBE-.v|E4~oDPDi?uHsxtpIRk',
                      width: 640,
                      height: 1024,
                      nsfw: false,
                      meta: {
                        create: {
                          seed: 3778376986,
                          steps: 30,
                          prompt:
                            'cartoon portrait of a detective in the rain, after hours, dark, raining, film noir, low lighting, wallpaper, UHD, professional, eyes focus, 1940s, muted colors',
                          negativePrompt: 'umbrella, orange eyes, red eyes',
                          cfgScale: 8,
                        },
                      },
                    },
                    {
                      url: 'https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/d7e090c8-01c3-4b8b-b6ee-4c24ef838700/width=450/188002.jpeg',
                      hash: 'UWMEyj^%58Me}q-ToLw]adW-WVWC%KS#Rkni',
                      width: 1024,
                      height: 640,
                      nsfw: false,
                      meta: {
                        create: {
                          seed: 2359399483,
                          steps: 30,
                          prompt:
                            'a stunning misty river, magical, warm, pastel painting, oil painting, colorful, grass, autumn, falling leaves, soft focus, studio quality, volumetric lighting, highres, realistic, professional',
                          cfgScale: 8,
                        },
                      },
                    },
                  ],
                },
                files: {
                  create: [
                    {
                      name: '526mixV145_v11.safetensors',
                      id: 15323,
                      sizeKB: 2082642.022460938,
                      type: 'Model',
                      format: 'SafeTensor',
                      pickleScanResult: 'Success',
                      pickleScanMessage: 'No Pickle imports',
                      virusScanResult: 'Success',
                      scannedAt: '2023-03-04T05:03:35.127Z',
                      hashes: {
                        create: {
                          AutoV1: '8BF80F0F',
                          AutoV2: '12142B7C65',
                          SHA256: '12142B7C650A9BF91F8C3D280DEBD68974AC3DA7A1D35632B01DF62E33B307C7',
                          CRC32: 'F0B112B8',
                          BLAKE3: '1240C2B36C07C70FF87F08121B6747C5808E3F5F7440262D9D1E6A527C46C4C7',
                        },
                      },
                      downloadUrl: 'https://civitai.com/api/download/models/18263',
                      primary: true,
                    },
                  ],
                },
              },
              {
                serverId: 17699,
                name: 'V1',
                description:
                  '<p>Model recipe (V1):</p><p>Roboetic\'s Mix + Kenshi 01 * 0.15 weighted sum = RoboKen</p><p>RPG V4 + FantasyMixV1 * 0.35 weighted sum = RPGFant</p><p>RoboKen + RPGFant * 0.4 weighted sum</p><p>+<a target="_blank" rel="ugc" href="http://seek.art">seek.art</a> * 0.35 add difference</p><p>+noise offset * 0.7 add difference</p>',
                baseModel: 'SD 1.5',
                createdAt: '2023-03-02T21:36:41.066Z',
                updatedAt: '2023-04-27T00:15:40.837Z',
                files: {
                  create: [
                    {
                      name: '526mixV145_v1.safetensors',
                      id: 14854,
                      sizeKB: 2082642.022460938,
                      type: 'Model',
                      format: 'SafeTensor',
                      pickleScanResult: 'Success',
                      pickleScanMessage: 'No Pickle imports',
                      virusScanResult: 'Success',
                      scannedAt: '2023-03-02T22:28:26.549Z',
                      hashes: {
                        create: {
                          AutoV1: 'E7D119D6',
                          AutoV2: 'AC3528D6E8',
                          SHA256: 'AC3528D6E83649BC44FA511CEE1DD8910FD6053E59E4AF592577C3A38C2FA83A',
                          CRC32: '8FF64D6C',
                          BLAKE3: '83AB80E20DFC4D984FF18A28A539B3C513823E70D53044368293A9BC624EE6B3',
                        },
                      },
                      downloadUrl: 'https://civitai.com/api/download/models/17699',
                      primary: true,
                    },
                  ],
                },
              },
            ],
          },
          tags: {
            create: [
              'futuristic',
              'dark',
              'photorealistic',
              'general purpose',
              'nature',
              'all in one',
              'digital art',
              'versatile',
              'mix',
              'high quality',
              'highly detailed',
              'concept art',
              'digital painting',
              'environment concept art',
              'classical',
              'fantasy art',
              'character design',
              'dark fantasy',
              'paintings',
              'artistic',
              'digital illustration',
              'faces',
              'painterly',
              'photorealism',
              'portraits',
              'rpg',
              'sci fi',
              'semi-realistic',
              'traditional art',
              'noise offset',
              'general use',
              'photos',
            ].map((x) => ({ name: x })),
          },
          originalValues: `{
          "id": 15022,
          "name": "526Mix V1.4.5",
          "nsfw": false,
          "description": "<p>Example images' prompts are in InvokeAI's formatting.</p><p><strong>USAGE TIPS AND BEST PRACTICES AND SETTINGS:</strong></p><ul><li><p><u>Keep CFG at 5 to 6, as this model is a tad overbaked.</u></p></li><li><p>~40-45 steps recommended when <em>not</em> using img2img to upscale as your high-res fix.</p></li><li><p>img2img at 0.47 to 0.55 strength and same step count is recommended for high-res fix. InvokeAI users should enable High Res Optimization, ideally at the same strength. With that enabled, you can get away with 30-35 steps on DDIM, k_euler_a, and DPM samplers to get clean and fully-detailed results.</p></li><li><p><a target=\\"_blank\\" rel=\\"ugc\\" href=\\"https://huggingface.co/JPPhoto/neg-sketch-2\\">&lt;neg-sketch-2&gt;</a> highly recommended for boosting photorealism and 3D art in many cases, though may occasionally behave oddly for certain prompts (e.g. interior images, spaghetti demons).</p></li><li><p>Best results at at least 768x resolution in either direction.</p></li><li><p>When prompting for a person's age, try typing their age in words, not numbers. Numbers are tokenized separately, so prompting for a <em>42yo</em> instead of a <em>forty two year old</em> can give you a man-sized kid.</p></li><li><p>If your images are a bit dark, try putting <em>low light</em> in your negative prompt to kill dark lighting effects, or <em>dark</em> to kill dark coloring.</p></li><li><p>DPM samplers like DPM++ Karras 2 are more liable for artifacting and weirdness in this model, and may need extra steps. DDIM is preferable.</p></li><li><p>Other negative embeddings besides &lt;neg-sketch-2&gt; (e.g. bad-artist-anime, bad-hands-5, bad_prompt_version2) are generally not recommended, as they impact art style and model expressiveness and have little, if any, actual benefit.</p></li><li><p>k_heun is excellent for photorealism, but is very slow. Some prompts can work fine at only 15 steps, but others may come out wobbly until 30 steps.</p></li><li><p>When generating cozy interior design images, a higher img2img/InvokeAI HRO strength like 0.65 can do good for detail level and sharpness.</p></li></ul><p></p><p><strong>Update V1.4.5</strong>: This version tries to somewhat reduce iris and pupil distortion in peoples' eyes and improve general coherence somewhat, on average. Also, it's a touch less dark. This was accomplished by building a sub-mix with similar behavior to V1.4, but with better eyes and 50% noise offset, then mixing that in at 20% and hoping for the best. Seemed to work okay. Has occasional interpolation weirdness in a few prompts.</p><p></p><p>Anime / 2D animated-optimized version here: <a target=\\"_blank\\" rel=\\"ugc\\" href=\\"https://civitai.com/models/35893?modelVersionId=42086\\">https://civitai.com/models/35893?modelVersionId=42086</a></p><p>Surreal / vivid illustration mix: <a target=\\"_blank\\" rel=\\"ugc\\" href=\\"https://civitai.com/models/44596\\">https://civitai.com/models/44596</a></p><p></p><p>My personal merge of Stable Diffusion 1.5 custom models using the noise offset to improve contrast and dark images. An inpainting model is provided to make inpainting in the model’s styles and detail easier. <strong><em>'Negative' embeddings (besides &lt;neg-sketch-2&gt; for photographic and 3D art) generally not recommended as they interfere with art styles and aesthetics (unless that's what you want, of course).</em></strong></p><p></p><p>This model is meant to be:</p><ul><li><p>Artistic and elegant</p></li><li><p>Drop-dead easy to work with</p></li><li><p>Good at making cool characters and landscapes</p></li><li><p>Not bound or leaning towards any single style</p></li><li><p>Killer at digital and conventional art in many aesthetics</p></li><li><p>And above all, fun</p></li></ul><p>It’s not so great at explicit sexual content and anime*, including anime-based embeddings. There’s a million other models for those if that’s what you’re after. <br /><br />*There is some ability to bring out a neat anime aesthetic when you prompt for 'anime style', which I find to be quite cool to look at, although it can be a bit finicky. If you try to make anime-esque art with this model, do not put 'portrait' in your negative prompt, or use 'close' or 'closeup' in your positive prompt, as those seem to force it into a 3d-like style even if you add more weight on the anime style.</p><p></p><p>I want to also bring attention to whosawhatsis' <a target=\\"_blank\\" rel=\\"ugc\\" href=\\"https://civitai.com/models/10540/verisimilitude\\">verisimilitude,</a> which is great at readily making wallpaper-quality photorealistic stuff.</p><p></p><p>I also want to shoutout coreco and his <a target=\\"_blank\\" rel=\\"ugc\\" href=\\"https://civitai.com/models/1315/seekart-mega\\">seek.art MEGA v2</a>, which was responsible for much of the composition of V1.3-V1.4, and is an excellent update to his Mega model.</p><p></p><p>This model has a baked-in VAE based on <a target=\\"_blank\\" rel=\\"ugc\\" href=\\"https://huggingface.co/hakurei/waifu-diffusion-v1-4\\">Waifu Diffusion 1.4</a> by hakurei. You can switch this out (such as to <a target=\\"_blank\\" rel=\\"ugc\\" href=\\"https://huggingface.co/stabilityai/sd-vae-ft-mse-original/tree/main\\">vae-ft-mse-840000-ema-pruned</a>) if you wish, though I used that one specifically because it helped improve detail quality in some art styles and situations.</p><p></p><p>Example images were generated in Invoke AI. This means unless you use Invoke AI, you likely won't be able to recreate my images exactly. Just learn from the prompts and modify the weighting in prompts as needed for the UI you use (if you use the A1111 UI, any (plus sign)+ is equal to one set of parentheses).</p><p></p><p>By downloading, you agree to the creativeml-openrail-m and <a target=\\"_blank\\" rel=\\"ugc\\" href=\\"https://huggingface.co/dreamlike-art/dreamlike-diffusion-1.0/blob/main/LICENSE.md\\">Dreamlike-art</a> licenses.</p><p></p><p>Credits (V1.4 / V1.3.5):</p><ul><li><p><a target=\\"_blank\\" rel=\\"ugc\\" href=\\"https://civitai.com/models/3738/roboetics-mix\\">Roboetic’s Mix</a> – Roboetic</p></li><li><p><a target=\\"_blank\\" rel=\\"ugc\\" href=\\"https://civitai.com/models/1315/seekart-mega\\">seek.art MEGA v2</a> – coreco</p></li><li><p><a target=\\"_blank\\" rel=\\"ugc\\" href=\\"https://civitai.com/models/1116/rpg\\">RPG V4</a> – Anashel</p></li><li><p><a target=\\"_blank\\" rel=\\"ugc\\" href=\\"https://civitai.com/models/16371\\">HeStyle V1.5</a> - krstive</p></li><li><p><a target=\\"_blank\\" rel=\\"ugc\\" href=\\"https://civitai.com/models/8067/movie-diffusion-v12\\">Movie Diffusion</a> - Dalle2Pictures</p></li><li><p><a target=\\"_blank\\" rel=\\"ugc\\" href=\\"https://civitai.com/models/1265/analog-diffusion\\">Analog Diffusion</a> and <a target=\\"_blank\\" rel=\\"ugc\\" href=\\"https://civitai.com/models/2292/portrait\\">Portrait+</a> - wavymulder</p></li><li><p><a target=\\"_blank\\" rel=\\"ugc\\" href=\\"https://civitai.com/models/9388/realscifi\\">RealSciFi</a> - AIfriend</p></li><li><p><a target=\\"_blank\\" rel=\\"ugc\\" href=\\"https://huggingface.co/Dunkindont/Foto-Assisted-Diffusion-FAD_V0\\">Foto-Assisted Diffusion</a> - Dunkindont</p></li><li><p><a target=\\"_blank\\" rel=\\"ugc\\" href=\\"https://civitai.com/models/3164/fantasy-art-style\\">fantasy-art-style v1.8</a> - kasukanra</p></li><li><p><a target=\\"_blank\\" rel=\\"ugc\\" href=\\"https://huggingface.co/22h/vintedois-diffusion-v0-2\\">Vintedois Diffusion</a> - Predogl and piEsposito</p></li><li><p><a target=\\"_blank\\" rel=\\"ugc\\" href=\\"https://www.crosslabs.org/blog/diffusion-with-offset-noise\\">noise offset</a> – Nicholas Guttenberg</p></li></ul>",
          "creator": "526christian",
          "type": "Checkpoint",
          "tags": [
            "futuristic",
            "dark",
            "photorealistic",
            "general purpose",
            "nature",
            "all in one",
            "digital art",
            "versatile",
            "mix",
            "high quality",
            "highly detailed",
            "concept art",
            "digital painting",
            "environment concept art",
            "classical",
            "fantasy art",
            "character design",
            "dark fantasy",
            "paintings",
            "artistic",
            "digital illustration",
            "faces",
            "painterly",
            "photorealism",
            "portraits",
            "rpg",
            "sci fi",
            "semi-realistic",
            "traditional art",
            "noise offset",
            "general use",
            "photos"
          ],
          "currentVersion": {
            "id": 18263,
            "fileId": 15323,
            "modelId": 18263,
            "name": "V1.1",
            "description": "<p><strong>Edit: I probably wouldn't download this version, though it is pretty good at paintings and has more anime-like faces, if those are traits you like.</strong></p><p>This version takes some more skill to control and has a tendency to want to generate grand landscapes when generating a character in a certain location, but landscapes are sharper and prettier, and the model is more artistic in general. Higher risk, higher reward. Also likes mountains.</p><p><strong><br /></strong>This version incorporates a mix of Satyam_SSJ10's Fantasy Background model and ItsJayQz's Firewatch Diffusion to improve landscape sharpness and dramatic... ness? The RPG-Fantasy models and <a target=\\"_blank\\" rel=\\"ugc\\" href=\\"http://seek.art\\">seek.art</a> are mixed in at a somewhat higher addition, as well.</p><p><br />Model recipe:</p><p>Roboetic's Mix + Kenshi 01 * 0.15 weighted sum = RoboKen</p><p>RPG V4 + FantasyMixV1 * 0.35 weighted sum = RPGFant</p><p>Fantasy Background + Firewatch Diffusion * 0.6 weighted sum = FantWatch</p><p>(RoboKen + RPGFant *<em> </em>0.4 weighted sum) + FantWatch * 0.6 add difference</p><p>+<a target=\\"_blank\\" rel=\\"ugc\\" href=\\"http://seek.art\\">seek.art</a> * 0.35 add difference</p><p>+noise offset * 0.75 add difference</p>",
            "baseModel": "SD 1.5",
            "images": [
              {
                "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/e08588bb-b787-4d92-13be-aecdcbab1500/width=450/188003.jpeg",
                "hash": "U02?HO0L8wxFBE-.v|E4~oDPDi?uHsxtpIRk",
                "width": 640,
                "height": 1024,
                "nsfw": false,
                "meta": {
                  "seed": 3778376986,
                  "steps": 30,
                  "prompt": "cartoon portrait of a detective in the rain, after hours, dark, raining, film noir, low lighting, wallpaper, UHD, professional, eyes focus, 1940s, muted colors",
                  "negativePrompt": "umbrella, orange eyes, red eyes",
                  "cfgScale": 8
                }
              },
              {
                "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/d7e090c8-01c3-4b8b-b6ee-4c24ef838700/width=450/188002.jpeg",
                "hash": "UWMEyj^%58Me}q-ToLw]adW-WVWC%KS#Rkni",
                "width": 1024,
                "height": 640,
                "nsfw": false,
                "meta": {
                  "seed": 2359399483,
                  "steps": 30,
                  "prompt": "a stunning misty river, magical, warm, pastel painting, oil painting, colorful, grass, autumn, falling leaves, soft focus, studio quality, volumetric lighting, highres, realistic, professional",
                  "cfgScale": 8
                }
              },
              {
                "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/581137f3-2505-4b76-06cf-66bd4a73e600/width=450/188001.jpeg",
                "hash": "UdE_]aM|M|R,~VM|M|a}x[M|M|t6NIjFRkxa",
                "width": 1024,
                "height": 640,
                "nsfw": false,
                "meta": {
                  "seed": 2482125139,
                  "steps": 30,
                  "prompt": "digital painting of Little Red Riding Hood as a badass assassin on a medieval battlefield, gritty, gloomy, soft focus, studio quality, detailed, cinematic lighting, ambient occlusion, volumetric lighting, armor, distant castle",
                  "negativePrompt": "cleavage, wolf, 3d, render",
                  "cfgScale": 8
                }
              },
              {
                "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/70bdaa5b-da71-48c8-162f-222a5ba9ff00/width=450/188000.jpeg",
                "hash": "U55}+]Ex4q}bXgx?btM#5Q-U-V5QxtNHsAoz",
                "width": 1024,
                "height": 640,
                "nsfw": false,
                "meta": {
                  "seed": 2815171421,
                  "steps": 30,
                  "prompt": "vector art of a fox sitting in the forest, fantastical, highres, sharp focus, absurdres, colored, after hours, dark, darkness, after hours",
                  "cfgScale": 8
                }
              },
              {
                "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/aa8e2b4f-ed6f-4588-1fb6-3fe1cc4dc800/width=450/187999.jpeg",
                "hash": "U04nSn|@4n15$eS}oN+[05ow0.}VGEEN0hAI",
                "width": 1024,
                "height": 640,
                "nsfw": false,
                "meta": {
                  "seed": 1281633612,
                  "steps": 30,
                  "prompt": "closeup digital painting of a flaming demon warrior walking in a dark castle hallway, atmospheric lighting, character focus, volumetric lighting, masterpiece, trending on artstation, highres, soft focus, after hours",
                  "negativePrompt": "3d, render",
                  "cfgScale": 8
                }
              },
              {
                "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/97e91642-7541-4be0-4b25-6251b91d2500/width=450/187998.jpeg",
                "hash": "U69t7P00.T-A~VE2x[oM%gIU^+9F-;Io%1W=",
                "width": 1024,
                "height": 640,
                "nsfw": false,
                "meta": {
                  "seed": 1931184633,
                  "steps": 30,
                  "prompt": "a portrait++ digital painting of a man in a dense winter forest, peaceful, volumetric lighting, masterpiece, realistic, trending on artstation, highres, soft focus",
                  "cfgScale": 8
                }
              },
              {
                "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/96412731-b8f0-4255-7dc9-8e1b77cd6b00/width=450/187997.jpeg",
                "hash": "U0558^}m00LgMxX90K9a005=?v00~q-T~B~q",
                "width": 640,
                "height": 896,
                "nsfw": false,
                "meta": {
                  "seed": 3440948204,
                  "steps": 30,
                  "prompt": "(speed painting)+ of a Saxon warrior, after hours, dark, raining, wallpaper, UHD, professional",
                  "cfgScale": 8
                }
              },
              {
                "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/79a5fb05-8f6e-456b-87a6-dbc276f1f900/width=450/187996.jpeg",
                "hash": "UWGadZ-m=_t6~T$~-nt6x[kBt6ba-nS4oJj[",
                "width": 1024,
                "height": 640,
                "nsfw": false,
                "meta": {
                  "seed": 2412383765,
                  "steps": 30,
                  "prompt": "wallpaper of a sorceress walking in a field, castle, character focus, volumetric lighting, masterpiece, realistic, trending on artstation, highres, fantasy",
                  "cfgScale": 8
                }
              },
              {
                "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/b97fc176-20c1-4fd1-bb1b-f91fa2f16c00/width=450/187995.jpeg",
                "hash": "UoIqrXyDICnN~9bvV]sln5IWRjocRkM|V[Sg",
                "width": 640,
                "height": 1024,
                "nsfw": false,
                "meta": {
                  "seed": 3606066264,
                  "steps": 30,
                  "prompt": "digital painting of a pretty cottagecore girl walking by a stream, wallpaper, UHD, professional, full body",
                  "cfgScale": 8
                }
              },
              {
                "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/32d40de0-a5be-4ea1-7704-d4c87368c000/width=450/187994.jpeg",
                "hash": "U13bjxD%00~q?bRjD%xv00%M_39F00xu_3IU",
                "width": 640,
                "height": 1024,
                "nsfw": false,
                "meta": {
                  "seed": 4169921064,
                  "steps": 30,
                  "prompt": "(\\"closeup portrait charcoal sketch of a man dissolving into a dark mist, emotional, hyperdetailed, highres,\\",\\"dark mist, sketch, chaotic, after hours, blackness, hyperdetailed, highres\\").blend(0.65,1)",
                  "cfgScale": 8
                }
              }
            ],
            "triggers": [],
            "createdAt": "2023-03-04T01:51:52.033Z",
            "updatedAt": "2023-04-27T00:15:40.837Z",
            "fileName": "526mixV145_v11.safetensors",
            "hashes": {
              "AutoV1": "8BF80F0F",
              "AutoV2": "12142B7C65",
              "SHA256": "12142B7C650A9BF91F8C3D280DEBD68974AC3DA7A1D35632B01DF62E33B307C7",
              "CRC32": "F0B112B8",
              "BLAKE3": "1240C2B36C07C70FF87F08121B6747C5808E3F5F7440262D9D1E6A527C46C4C7"
            }
          },
          "versions": [
            {
              "id": 53814,
              "modelId": 53814,
              "name": "V1.4.5",
              "description": "<p>People's eyes should be cleaner on average now, and sometimes more expressive as well. Portraits may have less stuff going on in the background as a side effect. Darkness levels have also been slightly reduced.</p>",
              "baseModel": "SD 1.5",
              "images": [
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/efe63e22-248e-4f9e-a63c-1c8a94078c00/width=450/582417.jpeg",
                  "hash": "U8HnQi~q57sQugvfTIN1D$tR?uIW004:9aR5",
                  "width": 640,
                  "height": 1024,
                  "nsfw": false,
                  "meta": {
                    "seed": 3111376587,
                    "steps": 30,
                    "sampler": "DDIM",
                    "prompt": "POV photo of an amazing snozboffle milkshake with chocolate syrup. busy retro diner interior background, people in background, kodak vision 3",
                    "negativePrompt": "<neg-sketch-2>, illustration",
                    "cfgScale": 6
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/fe9a59e2-aa43-47cb-4071-115513784000/width=450/582344.jpeg",
                  "hash": "UGG8+bE1RP_N00xasl9a-PM|IUw[^+M{xa-p",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 1171796474,
                    "steps": 30,
                    "sampler": "DDIM",
                    "prompt": "dramatic (photo)+ of a bunny in a snowy winter forest, wide angle 20mm f/11 on kodak ektachrome e100 professional photographic portfolio snapshot, warm sunlight, godrays",
                    "negativePrompt": "<neg-sketch-2>, illuminated, illustration, painting, illustration, pixar, render",
                    "cfgScale": 5
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/c9ba6e05-8629-4c0f-d3a9-74748bd22100/width=450/582342.jpeg",
                  "hash": "UGFE1904=^o{}?5S=_EM0f-TxtIVI;xBM~xt",
                  "width": 640,
                  "height": 1024,
                  "nsfw": false,
                  "meta": {
                    "seed": 1317060975,
                    "steps": 30,
                    "sampler": "DDIM",
                    "prompt": "digital painting of a cute witch girl cooking potions in her rustic kitchen, huge bubbling pot, rack of glowing potions, magic, atmospheric lighting, soft focus",
                    "cfgScale": 6
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/9e3ea0bb-358d-4e74-2737-71c86a795000/width=450/582343.jpeg",
                  "hash": "U6F4$L%13D%2PWof~CoI0*s8rX9v,nIpNbxa",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 217365441,
                    "steps": 30,
                    "sampler": "DDIM",
                    "prompt": "(photo)+ of the spaghetti demon inside the Spectrum corporate headquarters office angrily throwing meatballs at fleeing rich executives",
                    "negativePrompt": "(illustration, sketch, drawing, pixar, render, cartoon)+",
                    "cfgScale": 6
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/bbf20d5a-0945-4718-556f-5c449f2bfd00/width=450/582345.jpeg",
                  "hash": "UCE.R%~V9s4n-W9aJ6a#00E2EL-=~W_29FxC",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 4139248969,
                    "steps": 30,
                    "sampler": "DDIM",
                    "prompt": "closeup photo of a large gourmet layered snozboffle chocolate ice cream chocolate chip cookie birthday cake covered in frosting, low moody lighting, platter, cozy bakery background",
                    "negativePrompt": "<neg-sketch-2>, outlines, sketch, illustration",
                    "cfgScale": 6
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/7dd7b560-a4f6-484a-6cea-dafd8ccb3b00/width=450/582340.jpeg",
                  "hash": "U8Fg]bk91z}=V|s.E5EO0AW;OXIq?AI=SM=]",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 1496141288,
                    "steps": 30,
                    "sampler": "DDIM",
                    "prompt": "vector art of just the bestest and cutest bear. a big ol' honkin dude. an absolute unit",
                    "negativePrompt": "photo, realistic",
                    "cfgScale": 6
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/f5bde4ae-8452-494d-73b1-2d9cf453ae00/width=450/583225.jpeg",
                  "hash": "U242evyY%L_39~xZnhI=#6n}xu%1MwRPIVMx",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 3189022920,
                    "steps": 30,
                    "sampler": "DDIM",
                    "prompt": "(drybrush speed painting)+ of a pensive man illuminated by the moonlight standing by the dock, paint (strokes)+, stars, night",
                    "negativePrompt": "framed, borders",
                    "cfgScale": 6
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/0e39f49f-1075-4c81-cd1e-d31a2d1c3400/width=450/583228.jpeg",
                  "hash": "UBC~*R-.jX0M00RPnO%1.lxt%2sm+GM|i_R+",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 3737952480,
                    "steps": 30,
                    "sampler": "DDIM",
                    "prompt": "photo of a stupid cute chubby lil birb on the windowsill, kodachrome 400, bronica etrs",
                    "negativePrompt": "<neg-sketch-2>",
                    "cfgScale": 6
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/0ffff90d-492a-4dbb-73ab-86bb742c0b00/width=450/582346.jpeg",
                  "hash": "UAGl0D?v0000009GD%?b*0-pIAV@D%9FR*WB",
                  "width": 640,
                  "height": 1024,
                  "nsfw": false,
                  "meta": {
                    "seed": 2520419682,
                    "steps": 30,
                    "sampler": "DDIM",
                    "prompt": "portrait painting of Doug Dimmadome, owner of the Dimmsdale Dimmadome. white hat and suit",
                    "cfgScale": 6
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/1958a1af-e970-4b2e-9140-2804d3ef9e00/width=450/582348.jpeg",
                  "hash": "U4Al@7-o00,B04M|Io%M5SR-xH9u=rWq}@s.",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 229650895,
                    "steps": 30,
                    "sampler": "DDIM",
                    "prompt": "photo of a sculpted statue of Gogurtus on display in a history museum",
                    "negativePrompt": "<neg-sketch-2>",
                    "cfgScale": 6
                  }
                }
              ],
              "triggers": [],
              "createdAt": "2023-04-24T05:05:15.196Z",
              "updatedAt": "2023-04-27T00:15:40.837Z",
              "files": [
                {
                  "name": "526mixV145_v145.safetensors",
                  "id": 39025,
                  "sizeKB": 2082642.029296875,
                  "type": "Model",
                  "metadata": {
                    "fp": "fp16",
                    "size": "pruned",
                    "format": "SafeTensor"
                  },
                  "pickleScanResult": "Success",
                  "pickleScanMessage": "No Pickle imports",
                  "virusScanResult": "Success",
                  "scannedAt": "2023-04-24T05:12:33.314Z",
                  "hashes": {
                    "AutoV1": "79DA45F6",
                    "AutoV2": "41538124CC",
                    "SHA256": "41538124CC0C9329BC6C126D9141F85132E10CE3BE0B7786FA7B8299B0608512",
                    "CRC32": "32C424A9",
                    "BLAKE3": "C64F60871A3875186EB5CC7771C277BA7FB530EA6AEFCC759C9FE006BFB2AE89"
                  },
                  "downloadUrl": "https://civitai.com/api/download/models/53814",
                  "primary": true
                }
              ]
            },
            {
              "id": 56238,
              "modelId": 56238,
              "name": "V1.4.5-inpainting",
              "description": "<p>Inpainting version of V1.4.5, for all your inpainting and outpainting needs.</p>",
              "baseModel": "SD 1.5",
              "images": [
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/03106ab3-3bd0-4518-d2a6-81ac6ac4e100/width=450/609479.jpeg",
                  "hash": "UICF6j}@%Ot85sR*%3$%ofR*NyNdxabExYWT",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 1159072611,
                    "steps": 30,
                    "sampler": "DDIM",
                    "prompt": "(photo)++ of microwave-boiled (steak on a slice of baguette)+ with extra (Pepsi drizzle)+++, platter",
                    "negativePrompt": "<neg-sketch-2>, illustration",
                    "cfgScale": 6
                  }
                }
              ],
              "triggers": [],
              "createdAt": "2023-04-26T21:37:03.643Z",
              "updatedAt": "2023-04-27T00:15:40.837Z",
              "files": [
                {
                  "name": "526mixV145_v145-inpainting.yaml",
                  "id": 40276,
                  "sizeKB": 2.0126953125,
                  "type": "Config",
                  "metadata": {
                    "fp": null,
                    "size": null,
                    "format": "Other"
                  },
                  "pickleScanResult": "Success",
                  "pickleScanMessage": "No Pickle imports",
                  "virusScanResult": "Success",
                  "scannedAt": "2023-04-26T21:41:10.025Z",
                  "hashes": {
                    "AutoV2": "30E980DCC7",
                    "SHA256": "30E980DCC7FAADBC2EEC39814D4C0BF1A98457799B9DFAE12AD93BF000F402C9",
                    "CRC32": "25BDF928",
                    "BLAKE3": "364D1D0D2F75894B4C012FE851C5FC2A86AD8533DBD6BC904628A9C08C84B594"
                  },
                  "downloadUrl": "https://civitai.com/api/download/models/56238?type=Config&format=Other"
                },
                {
                  "name": "526mixV145_v145-inpainting.safetensors",
                  "id": 40277,
                  "sizeKB": 2082670.154296875,
                  "type": "Model",
                  "metadata": {
                    "fp": "fp16",
                    "size": "pruned",
                    "format": "SafeTensor"
                  },
                  "pickleScanResult": "Success",
                  "pickleScanMessage": "No Pickle imports",
                  "virusScanResult": "Success",
                  "scannedAt": "2023-04-26T21:42:01.623Z",
                  "hashes": {
                    "AutoV1": "79DA45F6",
                    "AutoV2": "6234511FEB",
                    "SHA256": "6234511FEBDF729F9AD05E3C5F33E99D8D36DA25D9921DC058C5D4276FDEFDFD",
                    "CRC32": "19066B0D",
                    "BLAKE3": "8C7AF922599F5AB7336D3F0836D8D2A6DE5696EE26C7849D2EE04127FB71BCC0"
                  },
                  "downloadUrl": "https://civitai.com/api/download/models/56238",
                  "primary": true
                }
              ]
            },
            {
              "id": 56301,
              "modelId": 56301,
              "name": "V1.4.5-no-VAE-bake",
              "description": "<p>V1.4.5 without the baked Waifu Diffusion 1.4 VAE. Only download this if you know what you're doing with it.</p>",
              "baseModel": "SD 1.5",
              "images": [
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/1bfe1d07-1c4a-48d7-8b7a-a55485955c00/width=450/610326.jpeg",
                  "hash": "UDCh~M-i$,]zI8r=R%xa0dS99[AJ.A9@oNaJ",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 3431169822,
                    "steps": 30,
                    "sampler": "DDIM",
                    "prompt": "photo++ at a security expo event of a (hyperfrisbee pizza cannon)+ for launching pizzas to Mach 2 with maximum spin and aerodynamic properties",
                    "negativePrompt": "<neg-sketch-2>, (illustration, sketch, painting, pixar, render)++",
                    "cfgScale": 6
                  }
                }
              ],
              "triggers": [],
              "createdAt": "2023-04-27T00:12:21.391Z",
              "updatedAt": "2023-04-27T00:15:40.837Z",
              "files": [
                {
                  "name": "526mixV145_v145NoVAEBake.safetensors",
                  "id": 40317,
                  "sizeKB": 2082642.029296875,
                  "type": "Model",
                  "metadata": {
                    "fp": "fp16",
                    "size": "pruned",
                    "format": "SafeTensor"
                  },
                  "pickleScanResult": "Success",
                  "pickleScanMessage": "No Pickle imports",
                  "virusScanResult": "Success",
                  "scannedAt": "2023-04-27T00:16:52.344Z",
                  "hashes": {
                    "AutoV1": "79DA45F6",
                    "AutoV2": "6E4CD20983",
                    "SHA256": "6E4CD209837A064FB5F6CF7A045C4944B5B8EC2250D77E8A5078AD146FD1DAF3",
                    "CRC32": "76D4BCAF",
                    "BLAKE3": "96A9CEF40D804DA9BFE742B9A1BB810D50C4FD4B484785E9D32ECED74BF5299B"
                  },
                  "downloadUrl": "https://civitai.com/api/download/models/56301",
                  "primary": true
                }
              ]
            },
            {
              "id": 29212,
              "modelId": 29212,
              "name": "V1.4",
              "description": "<p><strong>The Anti-Crispy Update</strong></p><p>This version is a simple dial-back to cool V1.3 / V1.3.5's jets, to reduce the crunchiness, aggressive darkness, general rigidness, and make it less demanding for low CFG and high step count. This is done by a simple merge-back of SD 1.5 (which had an add-difference merge of 0.70 with the noise offset) into V1.3.5 at 15%, and then an extra 2% noise offset on top. This does affect some things -- depending on the kinds of prompts you write, you might not notice much, or you might notice a lot. Interiors aren't as imaginative and smooth, yet making genuine art is a cleaner experience with less crunchiness. With the model's behavior reined in a bit, some things might be a little worse, but nasty crispiness and constantly getting the same posing and framing should be less of a prevailing issue now.</p><p><strong>Tips</strong>:</p><ul><li><p>Keep CFG fairly low (e.g. around 6-7, but 10 is too high, things get extra crispy).</p></li></ul><ul><li><p>If your results don't look very clean or have an artifact, you'll probably need to re-run with more steps -- this model can be more demanding than others.</p></li><li><p>You do not need to prompt a bunch of detail/quality phrases, or use 'negative embeddings' or massive negative prompts.</p></li><li><p>To control detail level for less detail-dense art styles, try putting 'photo' and 'realistic' in your negative prompt.</p></li><li><p>If your images are coming out a little dark or contrasted for your liking, try putting 'low light' in your negative prompt, or 'dark' for brighter colors if it's not a lighting issue.</p></li><li><p>May occasionally need to put 'paint' in negative prompt when prompting for paintings and you're getting weird extra colors or actual paintings in the scenery.</p></li></ul><p><strong>Oddities:</strong></p><ul><li><p>Eyes and especially teeth are sometimes a bit off.</p></li><li><p>Trying for realism with natural landscapes doesn't normally look great.</p></li></ul>",
              "baseModel": "SD 1.5",
              "images": [
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/3010e6e8-01b9-4c44-4053-8e6747265c00/width=450/329995.jpeg",
                  "hash": "UHFq%WtR%2xWx[~BSNNG4pkqRjE1E3D*s:R*",
                  "width": 640,
                  "height": 1024,
                  "nsfw": false,
                  "meta": {
                    "seed": 1577582713,
                    "steps": 30,
                    "prompt": "photo of an amazing loaded snozboffle milkshake. chocolate hurricaneism syrup. whipped creampunk, busy retro diner background",
                    "negativePrompt": "painting, illustration, drawing",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/c76ef782-77aa-4d76-86d5-4ecca234fc00/width=450/346364.jpeg",
                  "hash": "U75O?Sn28wt:I^WUxAV[H;p0x^Vpv_R:Rns%",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 375797279,
                    "steps": 30,
                    "sampler": "DDIM",
                    "prompt": "drybrush speed painting of a boy sitting and looking up at a stunning night sky, paint brush strokes+, epic composition, vivid colors, stars",
                    "negativePrompt": "framed, borders",
                    "cfgScale": 7
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/ade5d351-c8ae-4b49-8229-4aa9d4a52400/width=450/329993.jpeg",
                  "hash": "URKA415TVz~9~Tae=w%KKNNH%JSOTbNHS}S4",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 1689051514,
                    "steps": 30,
                    "prompt": "oil drybrush painting of a cozy green field in the sunrise, glistening dew, vivid colors, birds, warm",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/10455c60-b1c0-4003-1fda-8fe3cc1d6400/width=450/329992.jpeg",
                  "hash": "UEINQwW;4qyT39tQ{ztQ03%Kl7n7:=X4-Ti_",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 2131851199,
                    "steps": 30,
                    "prompt": "vector art of a lone cute happy fox in a fairy garden, flowers, sparkles, colorful, warm, fairy huts",
                    "negativePrompt": "3d, realistic, photo",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/034ff778-a051-43ce-aa82-261616a08100/width=450/336727.jpeg",
                  "hash": "UAFgO1^O0~0h0-Ehnl-A9csmElxs};xZNbEN",
                  "width": 896,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 3773138622,
                    "steps": 30,
                    "prompt": "the great god of spaghettimancy",
                    "cfgScale": 7
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/4dede034-4156-40cb-8145-43ef7040ed00/width=450/329989.jpeg",
                  "hash": "U46b7FQ,xZ~VKQ9F9GT0R5-:xDs:R+M{IUX8",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 2564943263,
                    "steps": 30,
                    "prompt": "cinematic full body still frame of a badass battle-worn paladin wielding a longsword in a fantasy battlefield+, helmet, gritty, cinematic lighting, blood splatter, combat stance, film grain, black armor, medieval soldiers",
                    "negativePrompt": "(low light)---",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/1a51d683-f54c-4dfc-be77-8d993c822000/width=450/339250.jpeg",
                  "hash": "UQKm@09c~Ur;?GoJE1WWs+RjNGNHs-t6RkRk",
                  "width": 896,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 3304487701,
                    "steps": 30,
                    "prompt": "futuristic technical infographic of a machine that converts paper straws into those wacky bendy plastic straws, scifi, detailed parts diagrams, internal view of futuristic components",
                    "cfgScale": 6
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/5d8531f9-112d-4766-d41e-3613d2a50600/width=450/350698.jpeg",
                  "hash": "UDEn|XD+%MM|~9oyIVW=ENWXRja#%zWBpHR*",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 1960150946,
                    "steps": 30,
                    "sampler": "DDIM",
                    "prompt": "interior photo of a cozy old-fashioned retrofuturistic candy and soda parlor, kodak vision 3",
                    "negativePrompt": "illustration, sketch, drawing, pixar",
                    "cfgScale": 7
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/ca1e6c55-4506-4bf6-a459-0472e73c6500/width=450/329988.jpeg",
                  "hash": "U7FX6*1qQ{=y5dJ{}Z9b02#kBm-7J2=yK4Fd",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 2759216804,
                    "steps": 30,
                    "prompt": "photo of a cozy upscale Atari-64 neo-gameboy futurism bedroom",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/b3edcf2f-8158-4339-f4d2-c9ed5be75800/width=450/329991.jpeg",
                  "hash": "U89QsyL~}@$j?a]n-U-Aa0xH-VnONsM}oyV@",
                  "width": 896,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 478679729,
                    "steps": 30,
                    "prompt": "cinematic still frame of a rotatototist robot mech warrior firing its cannon in the werflunker invasion, dark sci-fi, futuristic battlefield background",
                    "cfgScale": 8
                  }
                }
              ],
              "triggers": [],
              "createdAt": "2023-03-26T00:46:21.364Z",
              "updatedAt": "2023-04-27T00:15:40.837Z",
              "files": [
                {
                  "name": "526mixV145_v14.safetensors",
                  "id": 24143,
                  "sizeKB": 2082642.022460938,
                  "type": "Model",
                  "metadata": {
                    "fp": "fp16",
                    "size": "full",
                    "format": "SafeTensor"
                  },
                  "pickleScanResult": "Success",
                  "pickleScanMessage": "No Pickle imports",
                  "virusScanResult": "Success",
                  "scannedAt": "2023-03-26T00:54:24.773Z",
                  "hashes": {
                    "AutoV1": "C69E5D02",
                    "AutoV2": "155CB58446",
                    "SHA256": "155CB58446E823B9E530061D9C268CEBABFF8DBAC2F7CEDB208192A1CDF2009A",
                    "CRC32": "070BF3AF",
                    "BLAKE3": "76E486A52DBDDC073DF07EF1F80875C3142EF2E1B9707E9E5990DE7E9B201755"
                  },
                  "downloadUrl": "https://civitai.com/api/download/models/29212",
                  "primary": true
                }
              ]
            },
            {
              "id": 34204,
              "modelId": 34204,
              "name": "V1.4-less-dark",
              "description": "<p>Alternate version of 1.4 that has a much lower proportion of noise offset, based on 1.3.5-less-dark.</p><ul><li><p><strong>Less accuracy and whimsicalness (generally, in my testing).</strong></p></li></ul><ul><li><p>People who get bad luck with certain prompts unexpectedly tending towards darkness (such as \\"cinematic still frame\\") won't have to worry with this one quite as much.</p></li></ul><p>YMMV. Not extensively played with.</p>",
              "baseModel": "SD 1.5",
              "images": [
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/4f87ba45-49cc-459d-64ce-0529c75b2a00/width=450/390830.jpeg",
                  "hash": "UKGuOAE*Oa-qSxx]9Gbc00o}tPRO5toe_Ns:",
                  "width": 640,
                  "height": 896,
                  "nsfw": false,
                  "meta": {
                    "seed": 2102172352,
                    "steps": 30,
                    "sampler": "DDIM",
                    "prompt": "closeup photo of a delicious root beer float, vanilla ice cream, spoon, kodak vision 3, rustic diner background",
                    "negativePrompt": "cartoon, drawing, sketch, painting, pixar",
                    "cfgScale": 7
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/71b4823b-1915-457b-6f16-d6cdee579900/width=450/390829.jpeg",
                  "hash": "UGIi5z0000JV?wMctlX.WZMJM_T0FzwHIAD%",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 3770149713,
                    "steps": 30,
                    "sampler": "DDIM",
                    "prompt": "drybrush speed painting of a lone rugged survivor in front of a vast post-apocalyptic city, paint brush strokes+, epic composition, moody",
                    "negativePrompt": "framed, borders, lights",
                    "cfgScale": 7
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/78715af6-e99f-4992-6f81-3220965fd600/width=450/390828.jpeg",
                  "hash": "U97d:#D*yC_2_MM{o}-;XTMxogR+XSMxofWB",
                  "width": 896,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 3148677715,
                    "steps": 30,
                    "sampler": "DDIM",
                    "prompt": "cinematic still frame of bill burr yelling at a SWAT team outside his house to fuck off and get a warrant",
                    "negativePrompt": "cartoon, drawing, sketch, painting, pixar, police",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/facbcac1-e088-418f-4bcc-359587cb7200/width=450/390827.jpeg",
                  "hash": "UCNur6#YY_-V[fjtGmnj*Ooy%wSe}[WWvQX7",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 2968988490,
                    "steps": 30,
                    "sampler": "DDIM",
                    "prompt": "cartoon art of a cute happy fluffy little moth",
                    "cfgScale": 7
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/5b31eb04-6621-4f64-c3fc-8edb262e5f00/width=450/390826.jpeg",
                  "hash": "U8Hd:E~p00D%=vn%5RkC00E1NdWBS$ni-:%M",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 2345917307,
                    "steps": 30,
                    "sampler": "DDIM",
                    "prompt": "photo of a cozy+ upscale+ (transdimensional non-euclidean geometric futurism)++ bedroom",
                    "negativePrompt": "cartoon, drawing, sketch, painting, pixar",
                    "cfgScale": 7
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/a64a541e-86f9-48c2-7abf-b82707038600/width=450/390825.jpeg",
                  "hash": "UBLyG=D*03040#}=o}^j03SxE1$#FwItE1Rk",
                  "width": 640,
                  "height": 896,
                  "nsfw": false,
                  "meta": {
                    "seed": 1802110253,
                    "steps": 30,
                    "sampler": "DDIM",
                    "prompt": "oil painting surreal space art of a closeup woman in the night sky in a white and golden- dress and holding+ a large transparent umbrella jellyfish that has (long flowing sparkly tentacles)1.15, ethereal, celestial, magical, transparency++, fantasy, dark space background",
                    "negativePrompt": "photo, realistic, water, landscape, framed, border, shoes, feet",
                    "cfgScale": 7
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/85c8a149-c7fe-4565-ead5-ce0b8c1e4100/width=450/390824.jpeg",
                  "hash": "UVH+@0-o-:N]{Mr@IpofR6IpELni-oOXtkR*",
                  "width": 640,
                  "height": 1024,
                  "nsfw": false,
                  "meta": {
                    "seed": 3763318621,
                    "steps": 30,
                    "sampler": "DDIM",
                    "prompt": "anime style little red riding hood as a badass assassin wielding a sword, smoke, film grain, full body, epic composition",
                    "negativePrompt": "photo, realistic, wolf",
                    "cfgScale": 7
                  }
                }
              ],
              "triggers": [],
              "createdAt": "2023-04-03T05:45:09.862Z",
              "updatedAt": "2023-04-27T00:15:40.837Z",
              "files": [
                {
                  "name": "526mixV145_v14LessDark.safetensors",
                  "id": 28139,
                  "sizeKB": 2082642.022460938,
                  "type": "Model",
                  "metadata": {
                    "fp": "fp16",
                    "size": "full",
                    "format": "SafeTensor"
                  },
                  "pickleScanResult": "Success",
                  "pickleScanMessage": "No Pickle imports",
                  "virusScanResult": "Success",
                  "scannedAt": "2023-04-03T05:47:07.990Z",
                  "hashes": {
                    "AutoV1": "C69E5D02",
                    "AutoV2": "ABFA8995D6",
                    "SHA256": "ABFA8995D6F872AFE0FF8EDBD6E07C37B36B225974888AE4E04A77CBCA6E253E",
                    "CRC32": "8532C943",
                    "BLAKE3": "7A344654BA7D3591F4D1A65910ACBFB12C60E3A2891597AFD544A9643F7C8F05"
                  },
                  "downloadUrl": "https://civitai.com/api/download/models/34204",
                  "primary": true
                }
              ]
            },
            {
              "id": 34187,
              "modelId": 34187,
              "name": "V1.4-inpainting",
              "description": "<p>Inpainting version of V1.4. Use for all your correction-making, modifying, and image-expanding needs.</p>",
              "baseModel": "SD 1.5",
              "images": [
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/ac5cb52e-074a-4c57-88c7-0e7552de5900/width=450/390612.jpeg",
                  "hash": "U12PlGH@8{.lJCt7xuS#E1tQ$*M{.7ROIUx[",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 1382820528,
                    "steps": 30,
                    "sampler": "DDIM",
                    "prompt": "anime style portrait of a gruff detective in the pitch black rain at night, wet, raining, film noir",
                    "negativePrompt": "bright, day, daylight, umbrella",
                    "cfgScale": 7
                  }
                }
              ],
              "triggers": [],
              "createdAt": "2023-04-03T04:47:03.823Z",
              "updatedAt": "2023-04-27T00:15:40.837Z",
              "files": [
                {
                  "name": "526mixV145_v14-inpainting.safetensors",
                  "id": 28125,
                  "sizeKB": 2082670.147460938,
                  "type": "Model",
                  "metadata": {
                    "fp": "fp16",
                    "size": "full",
                    "format": "SafeTensor"
                  },
                  "pickleScanResult": "Success",
                  "pickleScanMessage": "No Pickle imports",
                  "virusScanResult": "Success",
                  "scannedAt": "2023-04-03T04:52:02.777Z",
                  "hashes": {
                    "AutoV1": "C69E5D02",
                    "AutoV2": "EAFC19923B",
                    "SHA256": "EAFC19923B6CE048F7525E766D96CAE537BDD17EB58F4EAAB68FE6ABFA61C868",
                    "CRC32": "6F74ADDB",
                    "BLAKE3": "758BEC7D56EA32FD8C5ED2657B44E20EF55E68272059D190B55D577E7474F7AA"
                  },
                  "downloadUrl": "https://civitai.com/api/download/models/34187",
                  "primary": true
                },
                {
                  "name": "526mixV145_v14-inpainting.yaml",
                  "id": 28150,
                  "sizeKB": 2.0126953125,
                  "type": "Config",
                  "metadata": {
                    "format": "Other"
                  },
                  "pickleScanResult": "Success",
                  "pickleScanMessage": "No Pickle imports",
                  "virusScanResult": "Success",
                  "scannedAt": "2023-04-03T06:31:20.906Z",
                  "hashes": {
                    "AutoV2": "30E980DCC7",
                    "SHA256": "30E980DCC7FAADBC2EEC39814D4C0BF1A98457799B9DFAE12AD93BF000F402C9",
                    "CRC32": "25BDF928",
                    "BLAKE3": "364D1D0D2F75894B4C012FE851C5FC2A86AD8533DBD6BC904628A9C08C84B594"
                  },
                  "downloadUrl": "https://civitai.com/api/download/models/34187?type=Config&format=Other"
                }
              ]
            },
            {
              "id": 30918,
              "modelId": 30918,
              "name": "V1.4-no-VAE-bake",
              "description": "<p>V1.4 without the baked Waifu Diffusion 1.4 VAE. Download this only if you know what you're doing with it.</p>",
              "baseModel": "SD 1.5",
              "images": [
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/f6c82869-af4c-42d8-d7e8-4b5fab112a00/width=450/351666.jpeg",
                  "hash": "UC84#$yCu6tRD4MeDgV@xwpcpJt7$~VYNGV@",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "prompt": "the spirit of gandhi getting sucked in the ghostbusters ghost trap lol"
                  }
                }
              ],
              "triggers": [],
              "createdAt": "2023-03-28T22:47:49.105Z",
              "updatedAt": "2023-04-27T00:15:40.837Z",
              "files": [
                {
                  "name": "526mixV145_v14NoVAEBake.safetensors",
                  "id": 25507,
                  "sizeKB": 2082642.022460938,
                  "type": "Model",
                  "metadata": {
                    "fp": "fp16",
                    "size": "full",
                    "format": "SafeTensor"
                  },
                  "pickleScanResult": "Success",
                  "pickleScanMessage": "No Pickle imports",
                  "virusScanResult": "Success",
                  "scannedAt": "2023-03-28T22:53:11.478Z",
                  "hashes": {
                    "AutoV1": "C69E5D02",
                    "AutoV2": "C8A70714D7",
                    "SHA256": "C8A70714D79AF7D1111B96E9F18FC6A17018DD7C917AD7A2A5ABA84E62077E64",
                    "CRC32": "431B6BA9",
                    "BLAKE3": "08B6B7AC741AEE6377FB76DA799EDB9A4A430BA9F24C474DE0AD1F3B83D1B027"
                  },
                  "downloadUrl": "https://civitai.com/api/download/models/30918",
                  "primary": true
                }
              ]
            },
            {
              "id": 34939,
              "modelId": 34939,
              "name": "V1.4-less-dark-no-VAE-bak",
              "description": "<p>V1.4-less-dark without the baked Waifu Diffusion 1.4 VAE. Download this only if you know what you're doing with it.</p>",
              "baseModel": "SD 1.5",
              "images": [],
              "triggers": [],
              "createdAt": "2023-04-04T00:49:03.045Z",
              "updatedAt": "2023-04-27T00:15:55.180Z",
              "files": [
                {
                  "name": "526mixV145_v14LessDarkNoVAEBak.safetensors",
                  "id": 28642,
                  "sizeKB": 2082642.022460938,
                  "type": "Model",
                  "metadata": {
                    "fp": "fp16",
                    "size": "pruned",
                    "format": "SafeTensor"
                  },
                  "pickleScanResult": "Success",
                  "pickleScanMessage": "No Pickle imports",
                  "virusScanResult": "Success",
                  "scannedAt": "2023-04-04T01:21:55.371Z",
                  "hashes": {
                    "AutoV1": "C69E5D02",
                    "AutoV2": "18527AF7DC",
                    "SHA256": "18527AF7DC17F8C767D3A0BBCF952FF429A26A0055B0AC3D7E52A9C2EDBB874D",
                    "CRC32": "C1225145",
                    "BLAKE3": "991B39C5B6C429915029C69AB6E7271A06FEA479A0BE8CED09180DD5D4E289C8"
                  },
                  "downloadUrl": "https://civitai.com/api/download/models/34939",
                  "primary": true
                }
              ]
            },
            {
              "id": 26042,
              "modelId": 26042,
              "name": "V1.3.5",
              "description": "<p>Minor update: Portrait improvement. Details below tips/oddities.</p><p><strong>Tips</strong>:</p><p>To avoid weirdness with portraits in this update, you may need to describe the setting characters are in as being in the background, rather than the character being in the setting.</p><p>Keep CFG fairly low (e.g. 9 and lower, ideally around 7).</p><p>If your results don't look very clean or have an artifact, you'll probably need to re-run with more steps -- this model can be more demanding than others.</p><p>You do <em>not</em> need to prompt a bunch of detail/quality phrases, or use 'negative embeddings' or massive negative prompts. You can be short and simple. It'll do just fine without handholding, you can trust me.</p><p>To control detail level for less detail-dense art styles, try putting 'photo' and 'realistic' in your negative prompt.</p><p>If your images are coming out a little dark or contrasted for your liking, try putting 'low light' in your negative prompt, or 'dark' for brighter colors if it's not a lighting issue.</p><p>May occasionally need to put 'paint' in negative prompt when prompting for paintings and you're getting weird extra colors or actual paintings in the scenery.</p><p><strong>Oddities:</strong></p><p>Eyes and especially teeth are sometimes a bit off.</p><p>Trying for realism with natural landscapes doesn't normally look great.</p><p></p><p>This version builds on V1.3 with a slight-moderate boost to portraits, improving anatomy a little bit and making 'portrait' a stronger, more consistent token (as opposed to randomly putting people far away, as long as no other tokens are interfering). Eyes and to some extent, teeth, are usually not bad quite as much as they were in V1.3. This was done by a 0.2 add-difference merge of Portrait+ on top of V1.3.</p>",
              "baseModel": "SD 1.5",
              "images": [
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/75706d26-5820-4761-97ce-016619f0f400/width=450/292802.jpeg",
                  "hash": "UFLW9SyY10_2G]_Mg3I;LLJB$$Ip0#tQxCxW",
                  "width": 640,
                  "height": 896,
                  "nsfw": false,
                  "meta": {
                    "seed": 499124964,
                    "steps": 35,
                    "prompt": "digital painting portrait of a whimsical pretty elf girl with pink hair",
                    "negativePrompt": "teeth, open mouth",
                    "cfgScale": 7
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/06b984bb-ae6e-4cb6-f299-58ba92df3900/width=450/286440.jpeg",
                  "hash": "U47dg_0L={NH~q9Gb^-V?]D*OY-V^QJA$%K5",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 1706457853,
                    "steps": 35,
                    "prompt": "full body epic composition cinematic wallpaper of Little Red Riding Hood as a badass sci-fi power armor supersoldier in a futuristic battlefield, gritty, soft focus, well-lit, cinematic lighting, cinematic movie still frame",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/cab48633-4b2f-4e48-ab4e-ead7ade4c000/width=450/286439.jpeg",
                  "hash": "UOJss=Iu9#%0_JS4sTbaGExWn%R-7Ka}aynj",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 656921750,
                    "steps": 30,
                    "prompt": "oil drybrush painting of a cozy grand green field in the sunrise, glistening dew, vivid colors, birds, warm",
                    "negativePrompt": "photo, realistic",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/0929858e-091e-40a6-7aae-91c7c3d01e00/width=450/286438.jpeg",
                  "hash": "U61Wc[nhmiroTObdZ_W9nNkXaIkBbvacbeay",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 1799736220,
                    "steps": 30,
                    "prompt": "cinematic digital painting wallpaper of a lone futuristic explorer+ standing in an epic dark cave filled with glowing otherworldly mushrooms, magical, (volumetric lighting)++, (light filtering through fog)++, HDR++, (soft focus)+++, (character focus)+",
                    "negativePrompt": "sharp focus, high focus",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/ce1fca36-917f-4814-1614-0ca55405a900/width=450/286437.jpeg",
                  "hash": "UMB;{G0-?;JUK5vPDmr?R8t3aMtPa2NItPRn",
                  "width": 640,
                  "height": 1024,
                  "nsfw": false,
                  "meta": {
                    "seed": 8,
                    "steps": 35,
                    "prompt": "retro illustrated comic style epic composition wallpaper of an old grandma as a badass futuristic bounty hunter",
                    "negativePrompt": "photo, realistic",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/b771acd5-036c-4c39-7346-d7e8c5ac6700/width=450/286436.jpeg",
                  "hash": "UQJ%kBKj_NrrtSxpoaxHKkbc%0xZgONe-Toe",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 2311429538,
                    "steps": 30,
                    "prompt": "surreal gouache portrait painting of a man opening the fabric of creation, vivid colors",
                    "negativePrompt": "suit",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/aa91120a-6076-4a07-d0ac-35ff91952a00/width=450/286433.jpeg",
                  "hash": "UKJtVMo10L~V01%LD*NHIoE3-:NGE2%K%Lae",
                  "width": 896,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 483914743,
                    "steps": 30,
                    "prompt": "(\\"digital painting of delicious mashed potatoes\\",\\"digital painting of an adorable light fur puppy\\").blend(0.92,0.5)",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/c79da281-42f4-415a-52b3-2d88fa5bdc00/width=450/297020.jpeg",
                  "hash": "U79sO]4;~8bbI@9wR-jZ0h?EI=V[n%oc%09v",
                  "width": 640,
                  "height": 1024,
                  "nsfw": false,
                  "meta": {
                    "seed": 3297948883,
                    "steps": 40,
                    "prompt": "oil painting of a woman working in a victorian bakery in the style of Tom Roberts, soft sunlight",
                    "cfgScale": 7
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/0a6be259-7047-4433-0937-208408f5ac00/width=450/287224.jpeg",
                  "hash": "U25Esm4ovf?v~p9GZ#Xnw@JV%1IVV=EP%fIU",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 1497645877,
                    "steps": 35,
                    "prompt": "cinematic wallpaper of Jango Fett sitting in an old western cantina, film grain, gritty, soft focus, well-lit, cinematic lighting, cinematic movie still frame",
                    "cfgScale": 9
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/f40a322b-7325-4305-92cf-89da667a6800/width=450/286432.jpeg",
                  "hash": "U14Bd+1h}TIo}@10#,AD8{IpW=OY5R}rx[=v",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 2951720775,
                    "steps": 35,
                    "prompt": "photo of a cozy space theme hackercore bedroom, low light, after hours",
                    "negativePrompt": "illustration, outlines, painting",
                    "cfgScale": 8
                  }
                }
              ],
              "triggers": [],
              "createdAt": "2023-03-20T07:28:47.362Z",
              "updatedAt": "2023-04-27T00:15:40.837Z",
              "files": [
                {
                  "name": "526mixV145_v135.safetensors",
                  "id": 21605,
                  "sizeKB": 2082642.022460938,
                  "type": "Model",
                  "metadata": {
                    "fp": "fp16",
                    "size": "full",
                    "format": "SafeTensor"
                  },
                  "pickleScanResult": "Success",
                  "pickleScanMessage": "No Pickle imports",
                  "virusScanResult": "Success",
                  "scannedAt": "2023-03-20T07:33:05.422Z",
                  "hashes": {
                    "AutoV1": "AE36C961",
                    "AutoV2": "349444A43F",
                    "SHA256": "349444A43FB7DBAB484DDA89F5EEB513BADCB783DBE2B24BD096D6A2CA1431EE",
                    "CRC32": "B2882A99",
                    "BLAKE3": "75203809A0635723EAA9798704DC74473CC0FB53CA5E08A9DF025C7AD6E54367"
                  },
                  "downloadUrl": "https://civitai.com/api/download/models/26042",
                  "primary": true
                }
              ]
            },
            {
              "id": 26360,
              "modelId": 26360,
              "name": "V1.3.5-less-dark",
              "description": "<p>Version of V1.3.5 for people who find the dark and contrasted dramatic lighting annoying, with a much lower noise offset add-difference alpha (0.35). Should more closely resemble older versions of the mix visually.</p><p>Impacts composition and accuracy somewhat for certain prompts, hence why the 'main' version has a high noise offset at the cost of having to fiddle with lighting-based tokens and weighting them as needed. YMMV.</p>",
              "baseModel": "SD 1.5",
              "images": [
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/ec8f422e-b483-4bbf-304c-19dd8fd67900/width=450/290273.jpeg",
                  "hash": "U37T^801ve%h_N0MrWOtV?9x-TE2^iMy~ARP",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 1497645877,
                    "steps": 35,
                    "prompt": "cinematic wallpaper of Jango Fett sitting in an old western cantina, film grain, gritty, soft focus, well-lit, cinematic lighting, cinematic movie still frame",
                    "cfgScale": 9
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/6f8e3a3b-1e6f-4506-0b87-26e9df44f300/width=450/290272.jpeg",
                  "hash": "U370*w59|=0%?Z5T$25TIpNcbcWB0g-TK5=v",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 2951720775,
                    "steps": 35,
                    "prompt": "photo of a cozy space theme hackercore bedroom, low light, after hours",
                    "negativePrompt": "illustration, outlines, painting",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/e2867e40-5ed4-42c7-55ed-bf61343c4900/width=450/290271.jpeg",
                  "hash": "UKCZIf4:sAIV_MIUNHwd_3IUR+xa%2IpxaX8",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 1706457853,
                    "steps": 35,
                    "prompt": "full body epic composition cinematic wallpaper of Little Red Riding Hood as a badass sci-fi power armor supersoldier in a futuristic battlefield, gritty, soft focus, well-lit, cinematic lighting, cinematic movie still frame",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/3dabc475-1fd1-477a-d028-7b184b02f200/width=450/290270.jpeg",
                  "hash": "UWKAHFF__Nr]$jx?oasEO@XSxX$zXUS$xZr?",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 2311429538,
                    "steps": 35,
                    "prompt": "surreal gouache portrait painting of a man opening the fabric of creation, vivid colors",
                    "negativePrompt": "suit",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/05bda698-3e71-4a9e-b82b-072364b14200/width=450/290269.jpeg",
                  "hash": "U42jS+VVL#jHR6o~RLW-v0XoW6ofUGn2kvWA",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 1799736220,
                    "steps": 35,
                    "prompt": "cinematic digital painting wallpaper of a lone futuristic explorer+ standing in an epic dark cave filled with glowing otherworldly mushrooms, magical, (volumetric lighting)++, (light filtering through fog)++, HDR++, (soft focus)+++, (character focus)+",
                    "negativePrompt": "sharp focus, high focus",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/c2c0512b-3a05-4aaa-7fd7-1f3a9edb0800/width=450/290267.jpeg",
                  "hash": "UDCjRWUm~BIq3,nM5QpEqLv-rZgMH]NsS|Mz",
                  "width": 640,
                  "height": 1024,
                  "nsfw": false,
                  "meta": {
                    "seed": 4080819838,
                    "steps": 35,
                    "prompt": "retro illustrated comic style epic composition wallpaper of an old grandma as a badass futuristic bounty hunter",
                    "negativePrompt": "photo, realistic",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/73fa64a3-8ada-486c-2f52-5ebcd44dc100/width=450/290266.jpeg",
                  "hash": "UQKJI:9|9e$~??WDsAbbB-xDWWR-BUS4ocjG",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 656921750,
                    "steps": 35,
                    "prompt": "oil drybrush painting of a cozy grand green field in the sunrise, glistening dew, vivid colors, birds, warm",
                    "negativePrompt": "photo, realistic",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/9c595f5c-5843-4789-15af-cefa916d5400/width=450/290262.jpeg",
                  "hash": "U99HLl.TE*.8_NRPD%-;pdn$xF%g.T%M%2yD",
                  "width": 640,
                  "height": 1024,
                  "nsfw": false,
                  "meta": {
                    "seed": 458057796,
                    "steps": 35,
                    "prompt": "a closeup portrait photo of a man in a winter forest, peaceful, volumetric lighting, soft focus",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/c68d71d4-6436-4cfd-acac-e2bb72547e00/width=450/290268.jpeg",
                  "hash": "UCEMXepwqt8x.mbuH?xaJU-:4:V@%MNGn%R%",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 3913460790,
                    "steps": 35,
                    "prompt": "sloppy cyborg paul blart patrolling an orca futurism shopping sloppy mall",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/43d8fa68-af31-4b24-810c-dcd93c5d7100/width=450/290265.jpeg",
                  "hash": "U9Cgxr=v10AF9^s:-T-TOE$$}W-TtPxYWXsC",
                  "width": 640,
                  "height": 896,
                  "nsfw": false,
                  "meta": {
                    "seed": 1034016498,
                    "steps": 30,
                    "prompt": "professional photo portrait of the spaghetti demon, the same one that pelted me with meatballs last night in the dream i can't remember",
                    "negativePrompt": "blurry, unfinished, draft",
                    "cfgScale": 8
                  }
                }
              ],
              "triggers": [],
              "createdAt": "2023-03-20T20:01:52.028Z",
              "updatedAt": "2023-04-27T00:15:40.837Z",
              "files": [
                {
                  "name": "526mixV145_v135LessDark.safetensors",
                  "id": 21853,
                  "sizeKB": 2082642.022460938,
                  "type": "Model",
                  "metadata": {
                    "fp": "fp16",
                    "size": "full",
                    "format": "SafeTensor"
                  },
                  "pickleScanResult": "Success",
                  "pickleScanMessage": "No Pickle imports",
                  "virusScanResult": "Success",
                  "scannedAt": "2023-03-20T20:08:45.631Z",
                  "hashes": {
                    "AutoV1": "AE36C961",
                    "AutoV2": "EA269FB5DC",
                    "SHA256": "EA269FB5DCB3D82F99CB68D8A7062D7778D5DAE6A8345BA7CC80D586618C27C1",
                    "CRC32": "A2194B71",
                    "BLAKE3": "1CED24895896E0C93D7D418BC5F59A8650B3F3EDEAE16330E5218B51B9C1BD55"
                  },
                  "downloadUrl": "https://civitai.com/api/download/models/26360",
                  "primary": true
                }
              ]
            },
            {
              "id": 26080,
              "modelId": 26080,
              "name": "V1.3.5-inpainting",
              "description": "<p>Inpainting version of 526Mix-V1.3.5. Use for all your correction-making, modifying, and image-expanding needs.</p>",
              "baseModel": "SD 1.5",
              "images": [
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/518d536f-73ef-4335-a2e5-b4349f4bb800/width=450/286889.jpeg",
                  "hash": "UEA-2s~90h5A?s%1WTn%C4Is;|^gl6M}Myn$",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 3029278963,
                    "steps": 35,
                    "prompt": "photo of president Franklin D. Roosevelt hiding and peeking from inside the trash can like oscar the grouch",
                    "cfgScale": 8
                  }
                }
              ],
              "triggers": [],
              "createdAt": "2023-03-20T09:18:33.785Z",
              "updatedAt": "2023-04-27T00:15:40.837Z",
              "files": [
                {
                  "name": "526mixV145_v135-inpainting.safetensors",
                  "id": 21630,
                  "sizeKB": 2082670.147460938,
                  "type": "Model",
                  "metadata": {
                    "fp": "fp16",
                    "size": "full",
                    "format": "SafeTensor"
                  },
                  "pickleScanResult": "Success",
                  "pickleScanMessage": "No Pickle imports",
                  "virusScanResult": "Success",
                  "scannedAt": "2023-03-20T09:23:16.470Z",
                  "hashes": {
                    "AutoV1": "AE36C961",
                    "AutoV2": "CB6450DAAC",
                    "SHA256": "CB6450DAAC5EE5AB61376B51E374719A35B4B23017BDE89BA2D3AA1F9178C770",
                    "CRC32": "1561E4BF",
                    "BLAKE3": "8CBDF58500344323929B3F6FE8FE56AC3903DCF98B5A04E5D800CD4CE367B503"
                  },
                  "downloadUrl": "https://civitai.com/api/download/models/26080",
                  "primary": true
                },
                {
                  "name": "526mixV145_v135-inpainting.yaml",
                  "id": 21952,
                  "sizeKB": 2.0126953125,
                  "type": "Config",
                  "metadata": {
                    "format": "Other"
                  },
                  "pickleScanResult": "Success",
                  "pickleScanMessage": "No Pickle imports",
                  "virusScanResult": "Success",
                  "scannedAt": "2023-03-21T02:36:32.267Z",
                  "hashes": {
                    "AutoV2": "30E980DCC7",
                    "SHA256": "30E980DCC7FAADBC2EEC39814D4C0BF1A98457799B9DFAE12AD93BF000F402C9",
                    "CRC32": "25BDF928",
                    "BLAKE3": "364D1D0D2F75894B4C012FE851C5FC2A86AD8533DBD6BC904628A9C08C84B594"
                  },
                  "downloadUrl": "https://civitai.com/api/download/models/26080?type=Config&format=Other"
                }
              ]
            },
            {
              "id": 26483,
              "modelId": 26483,
              "name": "V1.3.5-no-VAE-bake",
              "description": "<p>V1.3.5 without the baked Waifu Diffusion 1.4 VAE. Download this only if you know what you're doing with it. Results may look awful if not.</p>",
              "baseModel": "SD 1.5",
              "images": [
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/bb65130d-57f8-45ee-87f2-8935a26b8100/width=450/291857.jpeg",
                  "hash": "U00,0HV[RPf6%fWBWBjtxuWCWBj[x]WBWBfQ",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false
                }
              ],
              "triggers": [],
              "createdAt": "2023-03-21T02:35:25.534Z",
              "updatedAt": "2023-04-27T00:15:40.837Z",
              "files": [
                {
                  "name": "526mixV145_v135NoVAEBake.safetensors",
                  "id": 21951,
                  "sizeKB": 2082642.022460938,
                  "type": "Model",
                  "metadata": {
                    "fp": "fp16",
                    "size": "full",
                    "format": "SafeTensor"
                  },
                  "pickleScanResult": "Success",
                  "pickleScanMessage": "No Pickle imports",
                  "virusScanResult": "Success",
                  "scannedAt": "2023-03-21T02:37:58.308Z",
                  "hashes": {
                    "AutoV1": "AE36C961",
                    "AutoV2": "B5FBE86A80",
                    "SHA256": "B5FBE86A80A7E83ECCAB6587F8F84A4DB44CABC2BC1E4666EA752D87156C6932",
                    "CRC32": "F698B29F",
                    "BLAKE3": "A1541AD02708A08EBA1B08BB585C73A023A21E89EF88158AFA31BA9475C1E706"
                  },
                  "downloadUrl": "https://civitai.com/api/download/models/26483",
                  "primary": true
                }
              ]
            },
            {
              "id": 26563,
              "modelId": 26563,
              "name": "V1.3.5-less-dark-no-VAE-bake",
              "description": "<p>V1.3.5-less-dark without the baked Waifu Diffusion 1.4 VAE. Download this only if you know what you're doing with it. Results may look awful if not.</p>",
              "baseModel": "SD 1.5",
              "images": [
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/84a5b455-cb47-4323-9496-90813f105400/width=450/292774.jpeg",
                  "hash": "UEFs6{~q9GtR^+t7ofRjM{IUWV-;xuIUIU%M",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false
                }
              ],
              "triggers": [],
              "createdAt": "2023-03-21T06:52:19.030Z",
              "updatedAt": "2023-04-27T00:15:40.837Z",
              "files": [
                {
                  "name": "526mixV145_v135LessDarkNoVAE.safetensors",
                  "id": 22016,
                  "sizeKB": 2082642.022460938,
                  "type": "Model",
                  "metadata": {
                    "fp": "fp16",
                    "size": "full",
                    "format": "SafeTensor"
                  },
                  "pickleScanResult": "Success",
                  "pickleScanMessage": "No Pickle imports",
                  "virusScanResult": "Success",
                  "scannedAt": "2023-03-21T06:58:51.365Z",
                  "hashes": {
                    "AutoV1": "AE36C961",
                    "AutoV2": "43299AF793",
                    "SHA256": "43299AF79359069BAF984B9C425E107BAFC1FB5D13E4AE3C2A3560EBF8DCCA8C",
                    "CRC32": "E609D377",
                    "BLAKE3": "35D0EAFC4A02BDAAFF826E1C38DED91D9996C9D9CFD3E72F6324ADAC33B6AF37"
                  },
                  "downloadUrl": "https://civitai.com/api/download/models/26563",
                  "primary": true
                }
              ]
            },
            {
              "id": 23754,
              "modelId": 23754,
              "name": "V1.3",
              "description": "<p>This version brings further improvements to detail levels, better realism support, better Sci-Fi, and fewer quirks overall.</p><p><strong>Tips</strong>:</p><p>Keep CFG fairly low (e.g. 9 and lower, ideally around 7).</p><p>If your results don't look very clean or have an artifact, you'll probably need to re-run with more steps -- this model can be more demanding than others.</p><p>You do <em>not</em> need to prompt a bunch of detail/quality phrases, or use 'negative embeddings' or massive negative prompts. You can be short and simple. It'll do just fine without handholding, you can trust me.</p><p>To control detail level for less detail-dense art styles, try putting 'photo' and 'realistic' in your negative prompt.</p><p>If your images are coming out a little dark or contrasted for your liking, try putting 'low light' in your negative prompt, or 'dark' for brighter colors if it's not a lighting issue.</p><p>May occasionally need to put 'paint' in negative prompt when prompting for paintings and you're getting weird extra colors or actual paintings in the scenery.</p><p><strong>Oddities:</strong></p><p>Eyes are often a bit off and in need of correction. Dunno how to deal with that, just happened when incorporating photorealism models.</p><p>Trying for realism with natural landscapes doesn't normally look great.</p><p>The model can be a bit demanding for step counts.<br /><br />The mix has been redone from the ground up, introducing better semi-realism capabilities when prompted, greater level of detail by default, and while fixing a few oddities (now you can type 'cyberpunk' without it automatically meaning a million mini signs being put on everything, yay!). I'm also switching gears to focus more on using only the finest community-sourced, organic, cage-free, grass-finished 1.5 finetunes. It's easier to control and keep track of model behavior that way.</p>",
              "baseModel": "SD 1.5",
              "images": [
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/d891150f-9fc2-4fa3-9a5e-3dead1a4e200/width=450/257834.jpeg",
                  "hash": "U99j+Q_NO@-=_3RODis9yXnO#,%g?v%M%L%g",
                  "width": 640,
                  "height": 1024,
                  "nsfw": false,
                  "meta": {
                    "seed": 458057796,
                    "steps": 30,
                    "prompt": "a closeup portrait photo of a man in a winter forest, peaceful, volumetric lighting, soft focus",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/8a3310c4-bb40-4a74-2c67-313c1c5b8f00/width=450/276709.jpeg",
                  "hash": "UEAT$KENnlT0~UDjrqN_i{RPs,M|cDkWbbWC",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 4156432825,
                    "steps": 30,
                    "prompt": "cinematic wallpaper of an old grandma as a badass futuristic bounty hunter wielding a carbine, gritty, soft focus, well-lit, cinematic lighting, cinematic movie still frame",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/a4059baa-f6dc-4e7d-5ab5-2ca2cb6fd400/width=450/259472.jpeg",
                  "hash": "UhJ%{_IAZ%X.~BM{r=o#tSn$jEogx]t5Rjaf",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 175380593,
                    "steps": 30,
                    "prompt": "speed painting of a stunning flowing river, drybrush, paint brush strokes, warm, soft focus, cozy",
                    "negativePrompt": "photo, realistic, low light, snow",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/9a7d7078-54a7-463e-1326-57335fd82400/width=450/276708.jpeg",
                  "hash": "U5B{}I*P0332#^*~1IPf{L#*FfF|^tS_IXR=",
                  "width": 896,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 2630181756,
                    "steps": 30,
                    "prompt": "surrealist oil drybrush painting portrait of an extradimensional man in the swamp of thought and reflection, vivid colors, atmospheric lighting",
                    "negativePrompt": "suit",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/1b697845-c68f-4b63-cfa5-8bc9d4d10400/width=450/257831.jpeg",
                  "hash": "UJN06jGu00:R={xVsp%e~o%ywGR6_1w^RnS0",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 2553858985,
                    "steps": 30,
                    "prompt": "(pastel painting)+ of a grand lake, soft colors, magical, warm, volumetric lighting, soft focus",
                    "negativePrompt": "mountain, mountains",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/d9fcee6f-7a71-45f9-8909-542c33d1bc00/width=450/257830.jpeg",
                  "hash": "U467}_kC0fNfGdt7#jsl-VtRELVsM{oz$zNG",
                  "width": 768,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 2141889204,
                    "steps": 30,
                    "prompt": "impressionist speed painting of a pensive man illuminated by the moonlight, dark",
                    "negativePrompt": "suit",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/53317236-8911-4fb8-1550-ef85eb84aa00/width=450/257829.jpeg",
                  "hash": "UKHBJ1~TX9M|Nb9GnNM{xv-W-5aJ$%Nfs*WA",
                  "width": 896,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 2547391039,
                    "steps": 30,
                    "prompt": "a stunning photo of the world's most delicious chicken and bacon fried rice",
                    "negativePrompt": "painting, illustration",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/b28c71c9-a832-4f11-8ced-d9ee3eac7000/width=450/257827.jpeg",
                  "hash": "UOQum9-p~qIVr?M|S#xuo#R*aJso?bt7IBM{",
                  "width": 896,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 1033902843,
                    "steps": 30,
                    "prompt": "vector art of a cute happy eevee",
                    "negativePrompt": "photo, realistic",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/38d3460f-956a-40f1-7d7e-1003cb5d9500/width=450/257833.jpeg",
                  "hash": "U15Xu[HZG6-F0v9Y^RIny__M0K%L4m-q];R$",
                  "width": 640,
                  "height": 1024,
                  "nsfw": false,
                  "meta": {
                    "seed": 1227191339,
                    "steps": 30,
                    "prompt": "photo of a futuristic explorer walking in an otherworldly diamond landscape, atmospheric lighting, trippy",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/7acb1140-8c11-4ae7-feca-0bf30e0b2e00/width=450/257828.jpeg",
                  "hash": "UGEn,{0h9c-o~99vNH=_x.R+IuxZjKV[of$}",
                  "width": 896,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 1551282830,
                    "steps": 30,
                    "prompt": "digital painting of a baby bear sniffing a tall flower in a forest, warm lighting, vivid colors",
                    "cfgScale": 8
                  }
                }
              ],
              "triggers": [],
              "createdAt": "2023-03-15T18:58:18.315Z",
              "updatedAt": "2023-04-27T00:15:40.837Z",
              "files": [
                {
                  "name": "526mixV145_v13.safetensors",
                  "id": 19789,
                  "sizeKB": 2082642.022460938,
                  "type": "Model",
                  "metadata": {
                    "fp": "fp16",
                    "size": "full",
                    "format": "SafeTensor"
                  },
                  "pickleScanResult": "Success",
                  "pickleScanMessage": "No Pickle imports",
                  "virusScanResult": "Success",
                  "scannedAt": "2023-03-16T00:22:07.262Z",
                  "hashes": {
                    "AutoV1": "AE36C961",
                    "AutoV2": "A55207AF8A",
                    "SHA256": "A55207AF8A055D4C8D3D01506208553595483895AA79CC8102C5692436A6C9A5",
                    "CRC32": "F61F8812",
                    "BLAKE3": "FBDFC7E961F1D0BECB67B0C8916970519B415947D9CB48D1ECECCE4927037DCC"
                  },
                  "downloadUrl": "https://civitai.com/api/download/models/23754",
                  "primary": true
                }
              ]
            },
            {
              "id": 23856,
              "modelId": 23856,
              "name": "V1.3-inpainting",
              "description": "<p>Inpainting version of 526Mix V1.3.</p>",
              "baseModel": "SD 1.5",
              "images": [
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/14989300-f42f-42bd-9552-b8760f5b8c00/width=450/259190.jpeg",
                  "hash": "U69@O;00~qNq%MIVWFt5nO.8E2D%Rkaxxva1",
                  "width": 896,
                  "height": 640,
                  "nsfw": false
                }
              ],
              "triggers": [],
              "createdAt": "2023-03-16T00:45:34.608Z",
              "updatedAt": "2023-04-27T00:15:40.837Z",
              "files": [
                {
                  "name": "526mixV145_v13-inpainting.safetensors",
                  "id": 19797,
                  "sizeKB": 2082670.147460938,
                  "type": "Model",
                  "metadata": {
                    "fp": "fp16",
                    "size": "full",
                    "format": "SafeTensor"
                  },
                  "pickleScanResult": "Success",
                  "pickleScanMessage": "No Pickle imports",
                  "virusScanResult": "Success",
                  "scannedAt": "2023-03-16T00:52:23.395Z",
                  "hashes": {
                    "AutoV1": "AE36C961",
                    "AutoV2": "A198D49173",
                    "SHA256": "A198D491738211FBD22165C56135D62C74DDD27F7DF1C3302F4776886FBE8389",
                    "CRC32": "F5E22015",
                    "BLAKE3": "2785E6C9E7B140786059C1BE4E383E31F1F3C2DD45283513BB56F46CC8957AB8"
                  },
                  "downloadUrl": "https://civitai.com/api/download/models/23856",
                  "primary": true
                },
                {
                  "name": "526mixV145_v13-inpainting.yaml",
                  "id": 19798,
                  "sizeKB": 2.0126953125,
                  "type": "Config",
                  "metadata": {
                    "format": "Other"
                  },
                  "pickleScanResult": "Success",
                  "pickleScanMessage": "No Pickle imports",
                  "virusScanResult": "Success",
                  "scannedAt": "2023-03-16T00:50:44.943Z",
                  "hashes": {
                    "AutoV2": "30E980DCC7",
                    "SHA256": "30E980DCC7FAADBC2EEC39814D4C0BF1A98457799B9DFAE12AD93BF000F402C9",
                    "CRC32": "25BDF928",
                    "BLAKE3": "364D1D0D2F75894B4C012FE851C5FC2A86AD8533DBD6BC904628A9C08C84B594"
                  },
                  "downloadUrl": "https://civitai.com/api/download/models/23856?type=Config&format=Other"
                }
              ]
            },
            {
              "id": 23863,
              "modelId": 23863,
              "name": "V1.3-no-VAE-bake",
              "description": "<p>Upload of V1.3 without the baked Waifu Diffusion VAE.</p>",
              "baseModel": "SD 1.5",
              "images": [
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/ebf8fc46-be29-4d57-620a-77b2a26c5000/width=450/259252.jpeg",
                  "hash": "UHDcXU-;~q~q-;RPae?bxuoMt7WV9FWBNGM{",
                  "width": 640,
                  "height": 896,
                  "nsfw": false
                }
              ],
              "triggers": [],
              "createdAt": "2023-03-16T01:16:39.044Z",
              "updatedAt": "2023-04-27T00:15:40.837Z",
              "files": [
                {
                  "name": "526mixV145_v13NoVAEBake.safetensors",
                  "id": 19804,
                  "sizeKB": 2082642.022460938,
                  "type": "Model",
                  "metadata": {
                    "fp": "fp16",
                    "size": "full",
                    "format": "SafeTensor"
                  },
                  "pickleScanResult": "Success",
                  "pickleScanMessage": "No Pickle imports",
                  "virusScanResult": "Success",
                  "scannedAt": "2023-03-16T01:29:51.957Z",
                  "hashes": {
                    "AutoV1": "AE36C961",
                    "AutoV2": "1C690DF4DF",
                    "SHA256": "1C690DF4DFC3DF9BECC3348E171DE9F5ED0AFFF6F17E6040D32ABD68F2673962",
                    "CRC32": "B20F1014",
                    "BLAKE3": "53C3E1DDAB3F307762739C4D63B768319043E2A1ADF2D6C4F342EF61C002C752"
                  },
                  "downloadUrl": "https://civitai.com/api/download/models/23863",
                  "primary": true
                }
              ]
            },
            {
              "id": 19790,
              "modelId": 19790,
              "name": "V1.2",
              "description": "<p>The actual scenery update</p><p><strong>Update V1.2.</strong> 1.1 was a mistake. Lol. This version <em>actually</em> helps with landscapes, as well as scenery like indoor spaces, making them more visually interesting and sometimes better-composed. This version is otherwise closer to the original mix version, and will prompt quite similarly. This update also reduces the amount of obvious human anatomy failures when generating close-up body and portrait shots of people, and tends to behave more predictably with less unprompted weirdness. In some cases, this version also provides a noticeable increase in detail level. It does have the quirks of being worse at fire and being stingier with generating darkness, for reasons beyond me.</p><p>I wouldn't know where to even begin talking about the absolute mess that was the recipe this time, sorry. But it does add <a target=\\"_blank\\" rel=\\"ugc\\" href=\\"https://civitai.com/models/16371\\">HeStyle V1.5</a> and <a target=\\"_blank\\" rel=\\"ugc\\" href=\\"https://civitai.com/models/8067/movie-diffusion-v12\\">Movie Diffusion.</a></p>",
              "baseModel": "SD 1.5",
              "images": [
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/9d316513-4054-471c-638a-05578f3c5800/width=450/213063.jpeg",
                  "hash": "U28Wz2^*rCyF00ktu5?HqZ5RDj0MyY8^oX=_",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 3196250539,
                    "steps": 30,
                    "prompt": "impressionist speed painting of a boy sitting and looking up in awe at a stunning celestial night sky, after hours, low light, stars",
                    "cfgScale": 9
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/a387ae7d-7158-4365-342a-796eedd17000/width=450/210989.jpeg",
                  "hash": "U13St%L~D4x]4Txu%1oyRPpIIAR*.mIUS4S4",
                  "width": 896,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 859752311,
                    "steps": 30,
                    "prompt": "the army+ of the apocalypse+ in the dark rain, dark fantasy, medieval, nighttime, after hours, darkness, raining++, dripping wet, raindrops, wallpaper, UHD, professional",
                    "negativePrompt": "umbrella, umbrellas",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/4acfed5d-1fe0-4c47-bcf7-9db8d9e33b00/width=450/210988.jpeg",
                  "hash": "UiHKj|IV9vx]~AWBI;ozslxsj[R+bHbGoLj[",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 2520367947,
                    "steps": 30,
                    "prompt": "oil painting of a hiker walking in a stunning ravine, bright warm lighting, soft focus, light fog, volumetric lighting, vivid colors, masterpiece, trending on artstation, highres, epic composition",
                    "negativePrompt": "group, people",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/2dc501c0-72c4-4187-4fda-78343e187000/width=450/208339.jpeg",
                  "hash": "U87wTlE20K~A?HRkIU%2RibHbcR*IVs:tQIp",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 1808338672,
                    "steps": 30,
                    "prompt": "vector art of an owl perched on a branch, fantastical, highres, sharp focus, absurdres, after hours, dark, darkness, nighttime",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/7139077c-062f-4bb6-ad24-7096c3a02600/width=450/208343.jpeg",
                  "hash": "U8CjCK4n00i^00s,.8tS_NNHR5WB00%MM{M{",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 3499809307,
                    "steps": 30,
                    "prompt": "a snowman wearing a PAYDAY 2 mask robbing a bank, indoors, carbine, heist, robbery, cinematic lighting, wallpaper, concept art, UHD, professional",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/4924ccb6-0966-482d-29e7-e5e36be00a00/width=450/208342.jpeg",
                  "hash": "U55|r}}q$%ba5m9^R+w^EONHR+NI^N=wt5kB",
                  "width": 640,
                  "height": 896,
                  "nsfw": false,
                  "meta": {
                    "seed": 283316102,
                    "steps": 30,
                    "prompt": "a tough huntress sharpening a survival knife, candles, peaceful, lush, digital painting, detailed, studio quality, realistic, low light, after hours, atmospheric lighting",
                    "cfgScale": 9
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/698e4130-651c-4266-ce62-cff4ad9e8300/width=450/210987.jpeg",
                  "hash": "UCDH.:NG~9S1-TE2^O-Q5T-T5T9w0Ot759Rn",
                  "width": 896,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 808355211,
                    "steps": 30,
                    "prompt": "cozy rustic cottagecore living room, soft focus, bright warm lighting, volumetric lighting, vivid colors, masterpiece, trending on artstation, highres, stovetop, countertops, wide composition",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/c43e5a68-4668-4878-59d4-dd3db90ad600/width=450/213062.jpeg",
                  "hash": "UURB{|t7?u%K~CaxM|W;Txo0VtR-$ykCWAe.",
                  "width": 896,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 3067303318,
                    "steps": 30,
                    "prompt": "vector art of a cute happy golden retriever",
                    "cfgScale": 9
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/3c7602ae-d2f3-4225-11e1-8ca70907fc00/width=450/208341.jpeg",
                  "hash": "UB9%*Y-;yXNb~qxux]R+XSWB%2s:bwR*r=s:",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 1215369216,
                    "steps": 30,
                    "prompt": "a portrait digital painting of a man in a dense winter forest, peaceful, volumetric lighting, masterpiece, realistic, trending on artstation, highres, soft focus",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/a164c5f0-f43f-4550-9745-ae0e06456000/width=450/208340.jpeg",
                  "hash": "U24.MJ*0DOD48{i^x]tl4.IAkCyD~XtlIADi",
                  "width": 640,
                  "height": 896,
                  "nsfw": false,
                  "meta": {
                    "seed": 166873250,
                    "steps": 30,
                    "prompt": "(speed painting)+ portrait of a detective smoking a cigarette in the rain, after hours, dark, raining, film noir, wallpaper, UHD, professional",
                    "cfgScale": 8
                  }
                }
              ],
              "triggers": [],
              "createdAt": "2023-03-07T10:55:39.511Z",
              "updatedAt": "2023-04-27T00:15:40.837Z",
              "files": [
                {
                  "name": "526mixV145_v12.safetensors",
                  "id": 16516,
                  "sizeKB": 2082642.022460938,
                  "type": "Model",
                  "metadata": {
                    "fp": "fp16",
                    "size": "full",
                    "format": "SafeTensor"
                  },
                  "pickleScanResult": "Success",
                  "pickleScanMessage": "No Pickle imports",
                  "virusScanResult": "Success",
                  "scannedAt": "2023-03-07T11:02:20.277Z",
                  "hashes": {
                    "AutoV1": "969EB025",
                    "AutoV2": "CA3A2C2D91",
                    "SHA256": "CA3A2C2D911995A723DE6D43C03555751E5314D03FCC346D4C185DF77B0BB5A1",
                    "CRC32": "88433A68",
                    "BLAKE3": "BCA82E3416D696974476C98662EE270FC96C934AC8BC9D56EDD626573102A9C7"
                  },
                  "downloadUrl": "https://civitai.com/api/download/models/19790",
                  "primary": true
                }
              ]
            },
            {
              "id": 20458,
              "modelId": 20458,
              "name": "V1.2 inpainting",
              "description": "<p>Inpainting version of 526Mix V1.2. If you're using A1111 WebUI, make sure the config file is named the same as the model. Non-essential version if you have the original, but should be better with detail level in some prompts as well as generating fresh scenery.</p>",
              "baseModel": "SD 1.5",
              "images": [
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/ff56023e-eb53-4f37-2925-f4bd4f54aa00/width=450/216658.jpeg",
                  "hash": "U24.0js.00n~TLW=9FRk~AWAIUxuIpoJR*t7",
                  "width": 896,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "prompt": "digital painting of Darth Vader wearing a chef's apron+ and cooking in a kitchen, soft focus, atmospheric lighting"
                  }
                }
              ],
              "triggers": [],
              "createdAt": "2023-03-08T23:18:55.854Z",
              "updatedAt": "2023-04-27T00:15:40.837Z",
              "files": [
                {
                  "name": "526mixV145_v12-inpainting.safetensors",
                  "id": 17071,
                  "sizeKB": 2082670.147460938,
                  "type": "Model",
                  "metadata": {
                    "fp": "fp16",
                    "size": "full",
                    "format": "SafeTensor"
                  },
                  "pickleScanResult": "Success",
                  "pickleScanMessage": "No Pickle imports",
                  "virusScanResult": "Success",
                  "scannedAt": "2023-03-08T23:22:45.961Z",
                  "hashes": {
                    "AutoV1": "969EB025",
                    "AutoV2": "A96DAC07B7",
                    "SHA256": "A96DAC07B74BD31C8466086C963082C402AE0B4D3E70609F91F4D96CF75695DB",
                    "CRC32": "E44507D5",
                    "BLAKE3": "34098B3A9BF4D16B65B725AE0324B54C5E15377594893C7A03C59D66DF71FEDE"
                  },
                  "downloadUrl": "https://civitai.com/api/download/models/20458",
                  "primary": true
                },
                {
                  "name": "526mixV145_v12-inpainting.yaml",
                  "id": 17072,
                  "sizeKB": 2.0126953125,
                  "type": "Config",
                  "metadata": {
                    "format": "Other"
                  },
                  "pickleScanResult": "Success",
                  "pickleScanMessage": "No Pickle imports",
                  "virusScanResult": "Success",
                  "scannedAt": "2023-03-08T23:21:01.601Z",
                  "hashes": {
                    "AutoV2": "30E980DCC7",
                    "SHA256": "30E980DCC7FAADBC2EEC39814D4C0BF1A98457799B9DFAE12AD93BF000F402C9",
                    "CRC32": "25BDF928",
                    "BLAKE3": "364D1D0D2F75894B4C012FE851C5FC2A86AD8533DBD6BC904628A9C08C84B594"
                  },
                  "downloadUrl": "https://civitai.com/api/download/models/20458?type=Config&format=Other"
                }
              ]
            },
            {
              "id": 20959,
              "modelId": 20959,
              "name": "V1.2-no-VAE-bake",
              "description": "<p>Version without baked WD 1.4 VAE</p>",
              "baseModel": "SD 1.5",
              "images": [
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/86b8c15d-1fd5-4da8-dc4e-c50f72bc0d00/width=450/222279.jpeg",
                  "hash": "U00+?^ofIAV[x]j[RPWBofoft7ofofayt7j[",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "prompt": "badass shirtless Abraham Lincoln wielding an axe, darkness, foggy+, wide epic composition, dark+ ominous+ cinematic wallpaper, raytraced volumetric lighting, shaded face, hat, cape, full body"
                  }
                }
              ],
              "triggers": [],
              "createdAt": "2023-03-10T03:12:25.891Z",
              "updatedAt": "2023-04-27T00:15:40.837Z",
              "files": [
                {
                  "name": "526mixV145_v12NoVAEBake.safetensors",
                  "id": 17465,
                  "sizeKB": 2082642.677734375,
                  "type": "Model",
                  "metadata": {
                    "fp": "fp16",
                    "size": "full",
                    "format": "SafeTensor"
                  },
                  "pickleScanResult": "Success",
                  "pickleScanMessage": "No Pickle imports",
                  "virusScanResult": "Success",
                  "scannedAt": "2023-03-10T03:25:25.291Z",
                  "hashes": {
                    "AutoV1": "E346C852",
                    "AutoV2": "1610CF836E",
                    "SHA256": "1610CF836EB509EE746ABC6EBA9635B95A34CB832F46D93C84DD53E063FE8981",
                    "CRC32": "DE7AA4BC",
                    "BLAKE3": "F0B5564DD719746CDD7B1BA17A6DCB666FB56F8DC06BD3ADE09C667AE36E396B"
                  },
                  "downloadUrl": "https://civitai.com/api/download/models/20959",
                  "primary": true
                }
              ]
            },
            {
              "id": 22257,
              "modelId": 22257,
              "name": "ExpFail",
              "description": "<p><strong>READ BEFORE DOWNLOADING<br /></strong>This model has some artifacting, but this can be kept low by generating with over 40 steps, and by not using a DPM-based sampler at lower step counts. It's most apparent when generating animals, but does still sometimes appear on human faces. Higher step counts usually help.</p><p><em>Don't</em> use this model expecting a balanced general art experience. It's weird, finicky, and bugged, but it would've been a shame to let its specific strengths go to waste as well.<br />This <strong><em>unstable</em></strong> experiment model based on 526Mix V1.2 has a few strengths:</p><ul><li><p>High-detail portraits</p></li><li><p>Close-up shots</p></li><li><p>Interiors</p></li><li><p>Semi-realism</p></li><li><p>Sci-Fi</p></li></ul><p>It also has issues:</p><ul><li><p>The aforementioned artifacts (semi-realistic faces will often need fixing)</p></li><li><p>Landscapes are usually messier and sometimes not as expressive</p></li><li><p>Some art styles aren't as good (e.g. line art, Jack Davis style)</p></li></ul>",
              "baseModel": "SD 1.5",
              "images": [
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/c6ebbd62-8960-4f3d-4b08-8b154c455e00/width=450/239274.jpeg",
                  "hash": "U36RlUDk00^%~TR+9v#lHtX8-oNH02k;?GD*",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 3396142063,
                    "steps": 40,
                    "prompt": "photo of a cozy futuristic living room, low light, after hours",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/335cf351-05a0-41c2-0572-2482b9f40400/width=450/239273.jpeg",
                  "hash": "U99?zfH?nTkD~BIUozjFRjNFKPVsK6wIJBae",
                  "width": 640,
                  "height": 896,
                  "nsfw": false,
                  "meta": {
                    "seed": 678939486,
                    "steps": 50,
                    "prompt": "professional photo of a solo redhead woman floating (in space)+, ornate feather gown, long (flowing feathers)+, long flowing hair, detailed face, ambient lighting, dynamic motion, (nebula background)+",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/3b5db5e7-3807-4958-7352-c507b3e8d000/width=450/239346.jpeg",
                  "hash": "U56IBH?GT0Xn-P%2H=RP.8xurr%M.mxZxv%N",
                  "width": 640,
                  "height": 1024,
                  "nsfw": false,
                  "meta": {
                    "seed": 2053375744,
                    "steps": 40,
                    "sampler": "DDIM",
                    "prompt": "a closeup portrait photo of a man in a winter forest, peaceful, volumetric lighting, soft focus",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/da56e8c8-9ae5-4e37-8128-6c9ab1c6c300/width=450/239352.jpeg",
                  "hash": "UJLC^Y~Ukq%L_2E4M|$%9IIBv}WBwI%KI;Ip",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 305232525,
                    "steps": 40,
                    "prompt": "photo of a cozy modern bedroom, bright warm sunlight",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/25f82056-7f46-4821-c45a-f84a533cb400/width=450/239348.jpeg",
                  "hash": "U00m1E#7q]o#%3v~r?jETJS2RPbbE|K5NtWB",
                  "width": 640,
                  "height": 896,
                  "nsfw": false,
                  "meta": {
                    "seed": 2259972201,
                    "steps": 40,
                    "prompt": "photo of an ominous futuristic supersoldier wielding a carbine+ running+ in the pitch black dark rain++, dripping wet, raindrops",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/32a3b7d8-5837-4a71-2180-26eb6b8a3000/width=450/239349.jpeg",
                  "hash": "UCE_mT5RAvR*?@t5kXENE3burr%LnPxZOBoy",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 771613744,
                    "steps": 40,
                    "prompt": "photo of a cozy retrofuturistic dining room, interior design",
                    "negativePrompt": "people",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/17afd15c-cf64-4650-a506-ed390104f100/width=450/239347.jpeg",
                  "hash": "U14C0H^+}rH?00yCO@?b8_4nWDKQ_NyDH?8^",
                  "width": 640,
                  "height": 896,
                  "nsfw": false,
                  "meta": {
                    "seed": 2705279772,
                    "steps": 45,
                    "prompt": "photo of a pretty goth girl relaxing in a living room, low light",
                    "negativePrompt": "pictures",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/728ca8c3-deea-4cfa-0102-ccf34379a600/width=450/239351.jpeg",
                  "hash": "U16@KCKg01v$01IpcDRQ?Z#lIpnP}bOrJiv~",
                  "width": 896,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 677954095,
                    "steps": 45,
                    "prompt": "adult Little Red Riding Hood as an intimidating armored bounty hunter sitting in a medieval tavern indoors",
                    "negativePrompt": "wolf, cleavage",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/900994d0-4e62-4082-2fb5-912fef76ed00/width=450/239350.jpeg",
                  "hash": "UFAv,q9wRj-S~T9bIW?Z-.D+RkxttQNHWXt6",
                  "width": 640,
                  "height": 896,
                  "nsfw": false,
                  "meta": {
                    "seed": 4247995361,
                    "steps": 45,
                    "prompt": "photo of a detective smoking a cigar in an atompunk city",
                    "negativePrompt": "signs",
                    "cfgScale": 8
                  }
                }
              ],
              "triggers": [],
              "createdAt": "2023-03-12T21:04:01.433Z",
              "updatedAt": "2023-04-27T00:15:40.837Z",
              "files": [
                {
                  "name": "526mixV145_expfail.safetensors",
                  "id": 18545,
                  "sizeKB": 2082642.022460938,
                  "type": "Model",
                  "metadata": {
                    "fp": "fp16",
                    "size": "full",
                    "format": "SafeTensor"
                  },
                  "pickleScanResult": "Success",
                  "pickleScanMessage": "No Pickle imports",
                  "virusScanResult": "Success",
                  "scannedAt": "2023-03-12T21:08:10.806Z",
                  "hashes": {
                    "AutoV1": "156143B4",
                    "AutoV2": "662E21E7F7",
                    "SHA256": "662E21E7F7FFE77C3ADC6703BA8F76C199E9833A307DDCBD0699C787DEA7184D",
                    "CRC32": "BEBB93BE",
                    "BLAKE3": "DD16CDBBEFD353FC55FE37673E473614196A5F87346A390690AF31B7116CEB02"
                  },
                  "downloadUrl": "https://civitai.com/api/download/models/22257",
                  "primary": true
                }
              ]
            },
            {
              "id": 18263,
              "modelId": 18263,
              "name": "V1.1",
              "description": "<p><strong>Edit: I probably wouldn't download this version, though it is pretty good at paintings and has more anime-like faces, if those are traits you like.</strong></p><p>This version takes some more skill to control and has a tendency to want to generate grand landscapes when generating a character in a certain location, but landscapes are sharper and prettier, and the model is more artistic in general. Higher risk, higher reward. Also likes mountains.</p><p><strong><br /></strong>This version incorporates a mix of Satyam_SSJ10's Fantasy Background model and ItsJayQz's Firewatch Diffusion to improve landscape sharpness and dramatic... ness? The RPG-Fantasy models and <a target=\\"_blank\\" rel=\\"ugc\\" href=\\"http://seek.art\\">seek.art</a> are mixed in at a somewhat higher addition, as well.</p><p><br />Model recipe:</p><p>Roboetic's Mix + Kenshi 01 * 0.15 weighted sum = RoboKen</p><p>RPG V4 + FantasyMixV1 * 0.35 weighted sum = RPGFant</p><p>Fantasy Background + Firewatch Diffusion * 0.6 weighted sum = FantWatch</p><p>(RoboKen + RPGFant *<em> </em>0.4 weighted sum) + FantWatch * 0.6 add difference</p><p>+<a target=\\"_blank\\" rel=\\"ugc\\" href=\\"http://seek.art\\">seek.art</a> * 0.35 add difference</p><p>+noise offset * 0.75 add difference</p>",
              "baseModel": "SD 1.5",
              "images": [
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/e08588bb-b787-4d92-13be-aecdcbab1500/width=450/188003.jpeg",
                  "hash": "U02?HO0L8wxFBE-.v|E4~oDPDi?uHsxtpIRk",
                  "width": 640,
                  "height": 1024,
                  "nsfw": false,
                  "meta": {
                    "seed": 3778376986,
                    "steps": 30,
                    "prompt": "cartoon portrait of a detective in the rain, after hours, dark, raining, film noir, low lighting, wallpaper, UHD, professional, eyes focus, 1940s, muted colors",
                    "negativePrompt": "umbrella, orange eyes, red eyes",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/d7e090c8-01c3-4b8b-b6ee-4c24ef838700/width=450/188002.jpeg",
                  "hash": "UWMEyj^%58Me}q-ToLw]adW-WVWC%KS#Rkni",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 2359399483,
                    "steps": 30,
                    "prompt": "a stunning misty river, magical, warm, pastel painting, oil painting, colorful, grass, autumn, falling leaves, soft focus, studio quality, volumetric lighting, highres, realistic, professional",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/581137f3-2505-4b76-06cf-66bd4a73e600/width=450/188001.jpeg",
                  "hash": "UdE_]aM|M|R,~VM|M|a}x[M|M|t6NIjFRkxa",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 2482125139,
                    "steps": 30,
                    "prompt": "digital painting of Little Red Riding Hood as a badass assassin on a medieval battlefield, gritty, gloomy, soft focus, studio quality, detailed, cinematic lighting, ambient occlusion, volumetric lighting, armor, distant castle",
                    "negativePrompt": "cleavage, wolf, 3d, render",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/70bdaa5b-da71-48c8-162f-222a5ba9ff00/width=450/188000.jpeg",
                  "hash": "U55}+]Ex4q}bXgx?btM#5Q-U-V5QxtNHsAoz",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 2815171421,
                    "steps": 30,
                    "prompt": "vector art of a fox sitting in the forest, fantastical, highres, sharp focus, absurdres, colored, after hours, dark, darkness, after hours",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/aa8e2b4f-ed6f-4588-1fb6-3fe1cc4dc800/width=450/187999.jpeg",
                  "hash": "U04nSn|@4n15$eS}oN+[05ow0.}VGEEN0hAI",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 1281633612,
                    "steps": 30,
                    "prompt": "closeup digital painting of a flaming demon warrior walking in a dark castle hallway, atmospheric lighting, character focus, volumetric lighting, masterpiece, trending on artstation, highres, soft focus, after hours",
                    "negativePrompt": "3d, render",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/97e91642-7541-4be0-4b25-6251b91d2500/width=450/187998.jpeg",
                  "hash": "U69t7P00.T-A~VE2x[oM%gIU^+9F-;Io%1W=",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 1931184633,
                    "steps": 30,
                    "prompt": "a portrait++ digital painting of a man in a dense winter forest, peaceful, volumetric lighting, masterpiece, realistic, trending on artstation, highres, soft focus",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/96412731-b8f0-4255-7dc9-8e1b77cd6b00/width=450/187997.jpeg",
                  "hash": "U0558^}m00LgMxX90K9a005=?v00~q-T~B~q",
                  "width": 640,
                  "height": 896,
                  "nsfw": false,
                  "meta": {
                    "seed": 3440948204,
                    "steps": 30,
                    "prompt": "(speed painting)+ of a Saxon warrior, after hours, dark, raining, wallpaper, UHD, professional",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/79a5fb05-8f6e-456b-87a6-dbc276f1f900/width=450/187996.jpeg",
                  "hash": "UWGadZ-m=_t6~T$~-nt6x[kBt6ba-nS4oJj[",
                  "width": 1024,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 2412383765,
                    "steps": 30,
                    "prompt": "wallpaper of a sorceress walking in a field, castle, character focus, volumetric lighting, masterpiece, realistic, trending on artstation, highres, fantasy",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/b97fc176-20c1-4fd1-bb1b-f91fa2f16c00/width=450/187995.jpeg",
                  "hash": "UoIqrXyDICnN~9bvV]sln5IWRjocRkM|V[Sg",
                  "width": 640,
                  "height": 1024,
                  "nsfw": false,
                  "meta": {
                    "seed": 3606066264,
                    "steps": 30,
                    "prompt": "digital painting of a pretty cottagecore girl walking by a stream, wallpaper, UHD, professional, full body",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/32d40de0-a5be-4ea1-7704-d4c87368c000/width=450/187994.jpeg",
                  "hash": "U13bjxD%00~q?bRjD%xv00%M_39F00xu_3IU",
                  "width": 640,
                  "height": 1024,
                  "nsfw": false,
                  "meta": {
                    "seed": 4169921064,
                    "steps": 30,
                    "prompt": "(\\"closeup portrait charcoal sketch of a man dissolving into a dark mist, emotional, hyperdetailed, highres,\\",\\"dark mist, sketch, chaotic, after hours, blackness, hyperdetailed, highres\\").blend(0.65,1)",
                    "cfgScale": 8
                  }
                }
              ],
              "triggers": [],
              "createdAt": "2023-03-04T01:51:52.033Z",
              "updatedAt": "2023-04-27T00:15:40.837Z",
              "files": [
                {
                  "name": "526mixV145_v11.safetensors",
                  "id": 15323,
                  "sizeKB": 2082642.022460938,
                  "type": "Model",
                  "metadata": {
                    "fp": "fp16",
                    "size": "full",
                    "format": "SafeTensor"
                  },
                  "pickleScanResult": "Success",
                  "pickleScanMessage": "No Pickle imports",
                  "virusScanResult": "Success",
                  "scannedAt": "2023-03-04T05:03:35.127Z",
                  "hashes": {
                    "AutoV1": "8BF80F0F",
                    "AutoV2": "12142B7C65",
                    "SHA256": "12142B7C650A9BF91F8C3D280DEBD68974AC3DA7A1D35632B01DF62E33B307C7",
                    "CRC32": "F0B112B8",
                    "BLAKE3": "1240C2B36C07C70FF87F08121B6747C5808E3F5F7440262D9D1E6A527C46C4C7"
                  },
                  "downloadUrl": "https://civitai.com/api/download/models/18263",
                  "primary": true
                }
              ]
            },
            {
              "id": 17699,
              "modelId": 17699,
              "name": "V1",
              "description": "<p>Model recipe (V1):</p><p>Roboetic's Mix + Kenshi 01 * 0.15 weighted sum = RoboKen</p><p>RPG V4 + FantasyMixV1 * 0.35 weighted sum = RPGFant</p><p>RoboKen + RPGFant * 0.4 weighted sum</p><p>+<a target=\\"_blank\\" rel=\\"ugc\\" href=\\"http://seek.art\\">seek.art</a> * 0.35 add difference</p><p>+noise offset * 0.7 add difference</p>",
              "baseModel": "SD 1.5",
              "images": [
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/35ac234d-d39b-42a6-f23e-ff3d05f4e400/width=450/180915.jpeg",
                  "hash": "U796?wGYJ,;j8wELI:=e~qbaWVnO4Tt7S~wd",
                  "width": 640,
                  "height": 896,
                  "nsfw": false,
                  "meta": {
                    "seed": 2160251903,
                    "steps": 30,
                    "prompt": "Little Red Riding Hood as a badass bounty hunter, gritty, stunning, soft focus, character concept art, studio quality, detailed, well-lit, ambient occlusion, volumetric lighting",
                    "negativePrompt": "cleavage"
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/6d5ee917-5edd-4719-f36a-81cc69dbf900/width=450/181208.jpeg",
                  "hash": "U13l2E9F00~W~pE19Z^+IUWBt7xuJAs.xZIp",
                  "width": 640,
                  "height": 896,
                  "nsfw": false,
                  "meta": {
                    "seed": 2025488943,
                    "steps": 30,
                    "prompt": "(speed painting)+ of an ominous viking, after hours, dark, raining, dripping wet, wallpaper, UHD, professional, dark fantasy, cinematic lighting",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/88c3a535-4b5f-4117-5890-175387e67b00/width=450/180914.jpeg",
                  "hash": "UD9PyLt64=Iq~9t658Iq?E-A5SEN=_xZ9wRQ",
                  "width": 896,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 1930186411,
                    "steps": 30,
                    "prompt": "vector art of a dragon flying through the night sky, fantastical, clouds, epic composition, flat shading, 3840x2160, sharp focus, absurdres, fantasy, colored, after hours, nighttime, dark",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/7134f435-21a9-4984-cce5-4c6b14df2700/width=450/180913.jpeg",
                  "hash": "UHL;pq~U^+M{0LtS4TDi~WRONFW=n$IV.8sm",
                  "width": 896,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 2750246529,
                    "steps": 30,
                    "prompt": "a cute round bird, soft colors, winter, breathtaking, digital painting, realistic, masterpiece, volumetric lighting, soft paint brush strokes",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/e9c4f200-5e5e-423b-0e86-bdc5f4a66800/width=450/180912.jpeg",
                  "hash": "UA8336I;$Ms:}DoJsA$i]jJB$iwc,DE%xFs9",
                  "width": 896,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 2888445640,
                    "steps": 30,
                    "prompt": "a flaming demon warrior in darkness, digital painting, ominous, medieval, dark fantasy, cinematic lighting, masterpiece, trending on artstation, wallpaper, full body",
                    "negativePrompt": "2888445640",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/6a13a629-7947-4a65-9ad2-e6d11a071200/width=450/180911.jpeg",
                  "hash": "U14Lg-X900~qs:kCx]xv00RO^kD%u5VsMdXm",
                  "width": 640,
                  "height": 896,
                  "nsfw": false,
                  "meta": {
                    "seed": 1173792956,
                    "steps": 30,
                    "prompt": "(speed painting)+ portrait of a detective in the rain, after hours, dark, raining, film noir, wallpaper, UHD, professional",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/b24d2795-d65f-473b-60f2-9570aac09b00/width=450/180910.jpeg",
                  "hash": "U13*xwI,0$^70^og;aNg5axB=#J6$[WHJCsj",
                  "width": 896,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 2010619592,
                    "steps": 30,
                    "prompt": "a stunning fantasy landscape at night, distant fortress, magical, after hours, darkness, digital painting, fireflies, forest, night sky, soft focus, studio quality, volumetric lighting, highres, realistic, professional, epic composition",
                    "negativePrompt": "mountains, mountainous",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/ffe684e2-8976-4c27-630e-bdbee6d72c00/width=450/180909.jpeg",
                  "hash": "UQNcNm~W_4tAz_xAMKn3%4RrOSXhsYrqo#kB",
                  "width": 640,
                  "height": 896,
                  "nsfw": false,
                  "meta": {
                    "seed": 2570728520,
                    "steps": 30,
                    "prompt": "multicolor thick loaded milkshake in a tall glass, quaint, cozy, pastel colors, colorful, studio quality, raytracing, masterpiece, magical, 3d",
                    "cfgScale": 9
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/dc8de22b-92b4-464b-4f2a-706f1da58a00/width=450/180908.jpeg",
                  "hash": "UTG@DANHV@NG}9Oss8ad}pr?tRW;]~r]W.g2",
                  "width": 896,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 2694075967,
                    "steps": 30,
                    "prompt": "a stunning waterfall, magical, warm, pastel painting, colorful, grass, autumn, falling leaves, soft focus, studio quality, volumetric lighting, highres, realistic, professional",
                    "cfgScale": 8
                  }
                },
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/db3ea5af-0108-461c-eaa1-3b1199df6200/width=450/180907.jpeg",
                  "hash": "UJD,1Q9Z00w{~WNGD%so~qMxD%%f%gjFR*j[",
                  "width": 896,
                  "height": 640,
                  "nsfw": false,
                  "meta": {
                    "seed": 2201178586,
                    "steps": 30,
                    "prompt": "Little Red Riding Hood as a badass ninja warrior, katana, gritty, fantasy, soft focus, digital painting, studio quality, detailed, cinematic lighting, ambient occlusion, volumetric lighting, wallpaper, epic composition, full body, blood splatter",
                    "negativePrompt": "cleavage",
                    "cfgScale": 8
                  }
                }
              ],
              "triggers": [],
              "createdAt": "2023-03-02T21:36:41.066Z",
              "updatedAt": "2023-04-27T00:15:40.837Z",
              "files": [
                {
                  "name": "526mixV145_v1.safetensors",
                  "id": 14854,
                  "sizeKB": 2082642.022460938,
                  "type": "Model",
                  "metadata": {
                    "fp": "fp16",
                    "size": "full",
                    "format": "SafeTensor"
                  },
                  "pickleScanResult": "Success",
                  "pickleScanMessage": "No Pickle imports",
                  "virusScanResult": "Success",
                  "scannedAt": "2023-03-02T22:28:26.549Z",
                  "hashes": {
                    "AutoV1": "E7D119D6",
                    "AutoV2": "AC3528D6E8",
                    "SHA256": "AC3528D6E83649BC44FA511CEE1DD8910FD6053E59E4AF592577C3A38C2FA83A",
                    "CRC32": "8FF64D6C",
                    "BLAKE3": "83AB80E20DFC4D984FF18A28A539B3C513823E70D53044368293A9BC624EE6B3"
                  },
                  "downloadUrl": "https://civitai.com/api/download/models/17699",
                  "primary": true
                }
              ]
            },
            {
              "id": 17739,
              "modelId": 17739,
              "name": "V1-inpainting",
              "description": "<p>Inpainting version of 526Mix V1. If you're using A1111 WebUI, make sure the config file is named the same as the model.</p>",
              "baseModel": "SD 1.5",
              "images": [
                {
                  "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/7ff50024-6cc4-42bc-9091-0abf6a00b200/width=450/181551.jpeg",
                  "hash": "UGN*%C02@GX1^6KP4;E#_$W@VsJUnTVE$$-=",
                  "width": 896,
                  "height": 640,
                  "nsfw": false
                }
              ],
              "triggers": [],
              "createdAt": "2023-03-03T01:02:31.927Z",
              "updatedAt": "2023-04-27T00:15:40.837Z",
              "files": [
                {
                  "name": "526mixV145_v1-inpainting.safetensors",
                  "id": 14887,
                  "sizeKB": 2082670.147460938,
                  "type": "Model",
                  "metadata": {
                    "fp": "fp16",
                    "size": "full",
                    "format": "SafeTensor"
                  },
                  "pickleScanResult": "Success",
                  "pickleScanMessage": "No Pickle imports",
                  "virusScanResult": "Success",
                  "scannedAt": "2023-03-03T01:12:45.965Z",
                  "hashes": {
                    "AutoV1": "E7D119D6",
                    "AutoV2": "B57C5280A8",
                    "SHA256": "B57C5280A82E5F6D1F00C1B080B4919F288C8AA6BEED2EEB1DF2E017EA0A2F48",
                    "CRC32": "2BEDCC38",
                    "BLAKE3": "28A7EF04265CD2DA5404AF4F1D5012BAC6B27242B88786452BAE4C57C785987A"
                  },
                  "downloadUrl": "https://civitai.com/api/download/models/17739",
                  "primary": true
                },
                {
                  "name": "526mixV145_v1-inpainting.yaml",
                  "id": 16517,
                  "sizeKB": 2.0126953125,
                  "type": "Config",
                  "metadata": {
                    "format": "Other"
                  },
                  "pickleScanResult": "Success",
                  "pickleScanMessage": "No Pickle imports",
                  "virusScanResult": "Success",
                  "scannedAt": "2023-03-07T11:00:38.308Z",
                  "hashes": {
                    "AutoV2": "30E980DCC7",
                    "SHA256": "30E980DCC7FAADBC2EEC39814D4C0BF1A98457799B9DFAE12AD93BF000F402C9",
                    "CRC32": "25BDF928",
                    "BLAKE3": "364D1D0D2F75894B4C012FE851C5FC2A86AD8533DBD6BC904628A9C08C84B594"
                  },
                  "downloadUrl": "https://civitai.com/api/download/models/17739?type=Config&format=Other"
                }
              ]
            }
          ]
        }`,
        },
      },
    },
    include: {
      metadata: {
        include: {
          versions: true,
        },
      },
    },
  });

  const currentVersion = model.metadata!.versions[0];
  await prisma.modelVersion.update({
    where: {
      id: currentVersion.id,
    },
    data: {
      metadataCurrentVersionId: model.metadata!.id,
    },
  });
}

main()
  .then(async () => {
    console.log('Seeded successfully.');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
