let apiKey;
let secKey;
let spottedDifferences = [];
let globalassets = [];
let setcount = 1;

document.addEventListener("DOMContentLoaded", function() {
  //get api key from env
    fetch('/api-key')
    .then(response => response.json())
    .then(data => {
      apiKey = data.apiKey;
      secKey = data.secKey;
    })
    .catch(error => console.error('Error fetching API key:', error));
    
    function loadasset(){
      const assets = [];
      return fetch(`/api/queryasset?set=${"set" + setcount}`)
        .then(response => {
          if (!response.ok) {
            if (response.status === 400) {
              console.error('Error: Bad Request (400)');
              return { success: false};
            }
            console.error('Error:', response.status);
            return { success: false};
          }
          return response.json();
        })
        .then(data => {
          if (data.success === false) {
            // If the previous step indicated a problem, return the error object
            return data;
          }
          // Process the data
          console.log("asset data", data);
          const dbKeys = Object.keys(data.db);
          // Check if all required fields are defined
          for (let i = 0; i < dbKeys.length; i++) {
            const key = dbKeys[i];
            const additionalData = data.db[key].additionalData;
            // Check if all required fields are defined
            if (
              key !== undefined &&
              additionalData.qrWebARStorageID !== undefined &&
              additionalData.x !== undefined &&
              additionalData.y !== undefined &&
              additionalData.width !== undefined &&
              additionalData.height !== undefined
            ) {
              assets.push({
                key: key,
                qrid: additionalData.qrWebARStorageID,
                x: parseInt(additionalData.x, 10),
                y: parseInt(additionalData.y, 10),
                width: parseInt(additionalData.width, 10),
                height: parseInt(additionalData.height, 10)
              });
            } else {
              console.error('Missing or undefined values for key:', key);
            }
          }
          globalassets = assets
          return {success: true}
        })
        .catch(error => {
          // Handle any other errors that occur
          console.error('Error fetching data:', error);
          return { success: false};
        });
    }

    function loadset() {
      //set loader indicator
      var image1 = document.getElementById('image1');
      var image2 = document.getElementById('image2');
      //add loading indicator listener
      image1.style.visibility='hidden';
      image2.style.visibility='hidden';

      const loadingIndicator = document.getElementById('image-loading-indicator');
      loadingIndicator.style.display = 'block';

      image1.addEventListener('load', function(){
        console.log("image1 Loaded:");
        loadingIndicator.style.display = 'none';
        image1.style.visibility = 'visible';
      });
      image2.addEventListener('load', function(){
        console.log("image1 Loaded:");
        loadingIndicator.style.display = 'none';
        image2.style.visibility = 'visible';
      });
    
      const pics = [];
      return fetch(`/api/querypic?set=${"set" + setcount}`)
        .then(response => {
          if (!response.ok) {
            console.error('Error:', response.status);
            return { success: false};
          }
          return response.json();
        })
        .then(data => {
          if (data.success === false) {
            // If the previous step indicated a problem, return the error object
            return data;
          }
          // Process the data
          console.log(data);

          const dbKeys = Object.keys(data.db);
          for (let i = 0; i < dbKeys.length; i++) {
            const key = dbKeys[i];
            pics.push(data.db[key].additionalData.compressedImageStorageID);
          }
          if (pics.length === 2) {
            image1.setAttribute('src', `https://api.echo3D.com/query?key=${apiKey}&secKey=${secKey}&file=${pics[0]}`);
            image2.setAttribute('src', `https://api.echo3D.com/query?key=${apiKey}&secKey=${secKey}&file=${pics[1]}`);
            //load 3d models
            loadasset().then(result => {
              if (result.success) {
                console.log('API call was successful.');
              } else {
                console.log('API call failed or returned bad status.');
                return {success: false};
              }
            })
            setcount += 1;
          } else {
            console.error('image set improperly');
            return { success: false };
          }
          return { success: true}; // Return success and the pics array
        })
        .catch(error => {
          // Handle any other errors that occur
          console.error('Error fetching data:', error);
          return { success: false };
        });
    }
    
    //load first picture set
    loadset().then(result => {
      if (result.success) {
        console.log('API call was successful.');
      } else {
        console.log('API call failed or returned bad status.');
      }
    });


    function getQRCode(index){
      const loadingIndicator = document.getElementById('qr-loading-indicator');
      var qrcode = document.getElementById('qrcode');

      loadingIndicator.style.display = 'block';
      qrcode.style.visibility = 'hidden';

      qrcode.addEventListener('load', function(){
        console.log("QR Loaded:");
        loadingIndicator.style.display = 'none';
        qrcode.style.visibility = 'visible';
      });
      qrWebARStorageID = globalassets[index].qrid
      const srcUrl = `https://api.echo3D.com/query?key=${apiKey}&secKey=${secKey}&file=${qrWebARStorageID}`;
      qrcode.setAttribute('src', srcUrl);
    }

    function setModelViewerSrc(index) {
      var modelViewer = document.getElementById('model-viewer');
      var loadingIndicator = document.getElementById('loading-indicator');
  
      loadingIndicator.style.display = 'block';
      modelViewer.style.visibility = 'hidden';
      modelViewer.style.display = 'block';
      entryId = globalassets[index].key
      const srcUrl = `https://api.echo3D.com/download-model?key=${apiKey}&secKey=${secKey}&entry=${entryId}&convertMissing=true`;
      modelViewer.setAttribute('src', srcUrl);

      modelViewer.addEventListener('load', function() {
        console.log("Model Loaded:");
        loadingIndicator.style.display = 'none';
        modelViewer.style.visibility = 'visible';
      });
    }

    function handleImageClick(event) {
      const img = event.target;
      const rect = img.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      console.log(x, y);
  
      const {index: differenceIndex, coordinate: coordinate} = isDifference(x, y);
      if (differenceIndex !== -1) {
        if (!spottedDifferences.includes(differenceIndex)) {
          spottedDifferences.push(differenceIndex);
          setModelViewerSrc(differenceIndex);
          getQRCode(differenceIndex);
          create_rect(coordinate, 'canvas1');
          create_rect(coordinate, 'canvas2');
          openModal();
          console.log(`Spotted Differences: ${differenceIndex}`);
        } else {
          console.log('This difference has already been spotted.');
        }
      }
    }

    //iterate through the asset x,y,width,height
    function isDifference(x, y) {
      for (let i = 0; i < globalassets.length; i++) {
        const diff = globalassets[i];
        if (x >= diff.x && x <= diff.x + diff.width &&
            y >= diff.y && y <= diff.y + diff.height)
            {
            return {index: i, coordinate: { x: diff.x, y: diff.y, width: diff.width, height: diff.height}};
        }
      }
      return {index: -1};
    }

    function create_rect(coordinates, canvasId) {
      var canvas = document.getElementById(canvasId);
      var ctx = canvas.getContext('2d');
      
      if (!canvas.getAttribute('data-initialized')) {
        canvas.width = canvas.parentNode.offsetWidth;
        canvas.height = canvas.parentNode.offsetHeight;
        canvas.setAttribute('data-initialized', 'true');
      }
  
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 3;
      ctx.strokeRect(coordinates.x, coordinates.y, coordinates.width, coordinates.height);
    }

    function clear_canvas(canvasId) {
      var canvas = document.getElementById(canvasId);
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    

    function openModal() {
      const modal = document.getElementById("myModal");
      modal.style.display = "block";
    }
  
    function closeModal() {
      const modal = document.getElementById("myModal");
      modal.style.display = "none";
      const modelViewer = document.getElementById("model-viewer");
      modelViewer.setAttribute('src', '');
      console.log(modelViewer.getAttribute('src'));
    }

    function checkDifferencesAndRedirect() {
      const totalDifferences = globalassets.length; // Set this to the number of total differences
      const message = document.getElementById('message');
      
      if (spottedDifferences.length === totalDifferences) {
        loadset().then(result => {
          console.log(result)
          if (result.success){
            spottedDifferences=[];
            clear_canvas('canvas1');
            clear_canvas('canvas2');
          }
          else{
            location.href = '/end';
          }
        });
      } else {
          message.textContent = `You need to spot all ${totalDifferences} differences.`;
          message.style.color = 'red';
          message.style.font = ' 24px Arial';
      }
    }

    function backtolastset(){
      if (setcount === 2){
        var backbutton= document.getElementById('back-button');
        backbutton.setAttribute('href', history.back());
      }
      else{
        setcount-=2;
        loadset().then(result => {
          console.log(result)
          if (result.success){
            spottedDifferences=[];
            clear_canvas('canvas1');
            clear_canvas('canvas2');
          }
          else{
            console.log("error when going back");
          }
        }
      )}
    }

    document.querySelector(".close").addEventListener('click', closeModal);
    document.getElementById('image1').addEventListener('click', (event) => handleImageClick(event, 'set1'));
    document.getElementById('image2').addEventListener('click', (event) => handleImageClick(event, 'set1'));
    document.getElementById('next-button').addEventListener('click', () => checkDifferencesAndRedirect());
    document.getElementById('back-button').addEventListener('click', () => backtolastset());
});
