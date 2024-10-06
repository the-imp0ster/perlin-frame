/** @jsxImportSource frog/jsx */

import { Button, Frog, ImageResponse, CastActionHandler } from 'frog';
import { devtools } from 'frog/dev';
// import { neynar } from 'frog/hubs'
import { handle } from 'frog/next';
import { serveStatic } from 'frog/serve-static';
import { generatePerlinNoise } from '@/app/lib/perlinNoise';


const app = new Frog({
  assetsPath: '/',
  imageAspectRatio: '1:1',
  basePath: '/api',
  title: 'perlin noise',
});


app.frame('/', async (c) => {
  
  const fid = c.frameData?.fid;

  // if the button has been clicked
  if (c.status === 'response' && fid) {

    try {

      return c.res({
        // route to image on server
        image: (
          <img src={`/api/image/${fid}`} />
        ),
        intents: [<Button.Reset>Reset</Button.Reset>],
      });

      // error generating image
    } catch (error) {
      console.error('Error generating image:', error);

      return c.res({
        image: (
          <div
            style={{
              color: 'white',
              textAlign: 'center',
              padding: '20px',
            }}
          >
            <p>There was an error generating the image. Please try again.</p>
          </div>
        ),
      });
    }
  }

  return c.res({
    image: (
      <img src="/mfer.png" />
    ),
    imageOptions: { width: 600, height: 600},
    intents: [
      // <TextInput placeholder="input farcaster id..." />,
      <Button value="generate">generate</Button>,
    ],
  });
});

// handle image req, serve noise image
app.image('/image/:id', async (c) => {

  const id = c.req.param('id');
  
  const parsedId = parseInt(id, 10);

  const imageBuffer = await generatePerlinNoise(parsedId);

  const base64Image = imageBuffer.toString('base64');

  const dataUrl = `data:image/png;base64,${base64Image}`;

  const imgResponse: ImageResponse = {
    image: (
      <img src={dataUrl} />
    )
  }

  return c.res(imgResponse);

});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
