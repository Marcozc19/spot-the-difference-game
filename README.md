# spot-the-difference-game

![image](/public/pics/readme/begin_demo.png)

## Overview

This project demonstrates a "Spot the Difference" game integrated with AR components using echo3D. The game involves identifying differences between two images, and upon spotting a difference, users can view a 3D model related to the difference in AR.

![image](/public/pics/readme/set1_demo.png)
![image](/public/pics/readme/set2_demo.png)
## Features

- Spot the difference between two images.
- View high-fidelity 3D models in AR upon identifying differences.
- 3D assets are managed and streamed via the echo3D cloud for optimal performance.
- Web-based game built with HTML, CSS, and JavaScript.
![image](/public/pics/readme/3dmodel_demo.png)

## Getting Started

### Prerequisites

- A free [echo3D account](https://console.echo3d.co/#/auth/register).
- A web server to serve your HTML, CSS, and JavaScript files.
### Setup

1. **Clone the repository:**
   ```bash
   git clone <https://github.com/Marcozc19/spot-the-difference-game.git>
   cd spot-the-difference-game
   ```

2. **Add items to your Echo3D account:**
   1. Images
       - You can find two sets of spot the difference images in ```/public/pics/```
       - Upload the two sets of images to your Echo3D platform.
       - Double click on the asset, go to ```Metadata&Tags```Add tags  ```sdf```, ```set<set number>``` and ```asset``` to the images.
    
       - *Note:* The ```set<set number>``` tag is used to group the images, if two images belong together, they should have the same ```set<set number>``` tag. e.g. ```set1``` and ```set2```.
    ![image](/public\pics\readme\pictag_demo.png)
   1. 3D models
      1. Downloading the assets
       - You should create an account on [sketchfab](https://sketchfab.com/), and find any model you like to download.
       - For reference, I used these models:
         - [Lion](https://sketchfab.com/3d-models/lion-fc6eeed56f6e44048be4e6051a77c072#download)
         - [Monkey](https://sketchfab.com/3d-models/monkey-a066533da18f4caca0afc879bee0fe24)
         - [Bird](https://sketchfab.com/3d-models/blue-jay-6233ad12a9be46e496e27233b9b3b7de#download)
         - [Cow](https://sketchfab.com/3d-models/cow-cd0d161476d64a9ca80f059bff3ccddd)
         - [Duck](https://sketchfab.com/3d-models/hybrid-duck-2e9082cfd8c444d9b3b1b20821a0e101#download)
         - [Chicken](https://sketchfab.com/3d-models/chicken-pepe-friend-e61d16e2c1d94b3ab75dfcee75569502)
      2. Uploading the assets to your Echo3D account.
       - Upload the downloaded of 3D models to your Echo3D platform.
       - Same thing, Add tags ```sdf```, ```set<set number>``` and ```asset``` to the 3D models.     
       - *Note:* The ```set<set number>``` tag is used to identify the set of images and 3D models, be sure to name the same asset with the same set number as the image.
    ![image](/public\pics\readme\assettag_demo.png)
1. **Add Metadata to Assets**
   Now we need to add the coordinates of the assets in the picture so that the game knows which asset corresponds to which difference.
   - Go to the ```Metadata&Tags``` tab of the asset and add the coordinates of the asset in the picture.
   - The coordinates are in the format ```x```, ```y```, ```width```,```height```.
  ![image](/public/pics/readme/metadata_demo.png)
   - For reference, I used these as the coordinates for all my assets:

        |Animal   |x        |y        |width    |height   |
        |---------|---------|---------|---------|---------|
        |Lion     |540      |62       |85       |160      |
        |Monkey   |290      |90       |90       |90       |
        |Bird     |15       |323      |120      |100      |
        |Cow      |95       |275      |155      |85       |
        |Duck     |550      |410      |110      |95       |
        |Chicken  |270      |115      |105      |120      |

    
1. **Fetch the your Echo3D API keys:**
    Create a ```bash``` file named ```.env``` in the root directory of the project and add your ```API_KEY``` and ```SEC_KEY``` as follows:
    ```bash
    API_KEY=<your-api-key>
    API_SECRET=<your-api-secret>
    ```
2. **Install dependencies:**
    ```bash
    npm install
    ```
3. **Start the server:**
    ```bash
    node server.js
    ```
4. **Open the game in your browser:**
    ```bash
    http://localhost:3000
    ```

## Support
For any questions or issues, feel free to reach out to our support team at support@echo3D.com or join our support channel on [Slack](https://echo3d.slack.com/ssb/redirect).

## Troubleshooting
Visit our troubleshooting guide [here](https://docs.echo3d.com/unity/troubleshooting).

## About Echo3D
![image](/public/pics/echo3d.png)
*echo3D (www.echo3D.com) is a 3D asset management platform that enables developers to manage, update, and stream 3D, AR/VR, Metaverse, & Spatial Computing content to real-time apps and games.*