let apiKey;
let secKey;
let spottedDifferences = [];
let globalAssets = [];
let setCount = 1;

document.addEventListener("DOMContentLoaded", async function() {
  // Get API key from env
  try {
    const response = await fetch('/api-key');
    const data = await response.json();
    apiKey = data.apiKey;
    secKey = data.secKey;
  } catch (error) {
    console.error('Error fetching API key:', error);
  }

  function updateDifferenceCount(count) {
    document.getElementById('difference-count').textContent = count;
  }

  async function loadAsset() {
    try {
      const response = await fetch(`/api/queryasset?set=set${setCount}`);
      if (!response.ok) {
        if (response.status === 400) {
          console.error('Error: Bad Request (400)');
        } else {
          console.error('Error:', response.status);
        }
        return { success: false };
      }

      const data = await response.json();
      if (!data) {
        return data;
      }

      const assets = Object.keys(data.db).map(key => {
        const additionalData = data.db[key].additionalData;
        if (key && additionalData.qrWebARStorageID && additionalData.x && additionalData.y && additionalData.width && additionalData.height) {
          return {
            key: key,
            qrid: additionalData.qrWebARStorageID,
            x: parseInt(additionalData.x, 10),
            y: parseInt(additionalData.y, 10),
            width: parseInt(additionalData.width, 10),
            height: parseInt(additionalData.height, 10),
          };
        } else {
          console.error('Missing or undefined values for key:', key);
          return null;
        }
      }).filter(asset => asset);

      globalAssets = assets;
      updateDifferenceCount(globalAssets.length);
      console.log("globalAssets", globalAssets);
      return { success: true };
    } catch (error) {
      console.error('Error fetching data:', error);
      return { success: false };
    }
  }


  async function loadSet() {
    const image1 = document.getElementById('image1');
    const image2 = document.getElementById('image2');
    const loadingIndicator = document.getElementById('image-loading-indicator');

    image1.style.visibility = 'hidden';
    image2.style.visibility = 'hidden';
    loadingIndicator.style.display = 'block';

    image1.addEventListener('load', () => {
      loadingIndicator.style.display = 'none';
      image1.style.visibility = 'visible';
    });
    image2.addEventListener('load', () => {
      loadingIndicator.style.display = 'none';
      image2.style.visibility = 'visible';
    });

    try {
      const response = await fetch(`/api/querypic?set=set${setCount}`);
      if (!response.ok) {
        console.error('Error:', response.status);
        return { success: false };
      }

      const data = await response.json();
      if (!data) {
        return data;
      }

      const pics = Object.keys(data.db).map(key => data.db[key].additionalData.compressedImageStorageID);
      if (pics.length === 2) {
        image1.src = `https://api.echo3D.com/query?key=${apiKey}&secKey=${secKey}&file=${pics[0]}`;
        image2.src = `https://api.echo3D.com/query?key=${apiKey}&secKey=${secKey}&file=${pics[1]}`;
        const result = await loadAsset();
        if (result.success) {
          console.log('API call was successful.');
          setCount += 1;
          return { success: true };
        } else {
          console.error('API call failed or returned bad status.');
          return { success: false };
        }
      } else {
        console.error('image set improperly');
        return { success: false };
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return { success: false };
    }
  }
  
   // Load first picture set
   const initialLoadResult = await loadSet();
   if (!initialLoadResult.success) {
     console.error('Initial load failed.');
   }

  function getQRCode(index) {
    const loadingIndicator = document.getElementById('qr-loading-indicator');
    const qrcode = document.getElementById('qrcode');

    loadingIndicator.style.display = 'block';
    qrcode.style.visibility = 'hidden';

    qrcode.addEventListener('load', () => {
      loadingIndicator.style.display = 'none';
      qrcode.style.visibility = 'visible';
    });

    const qrWebARStorageID = globalAssets[index].qrid;
    const srcUrl = `https://api.echo3D.com/query?key=${apiKey}&secKey=${secKey}&file=${qrWebARStorageID}`;
    qrcode.src = srcUrl;
  }

  function setModelViewerSrc(index) {
    const modelViewer = document.getElementById('model-viewer');
    const loadingIndicator = document.getElementById('loading-indicator');

    loadingIndicator.style.display = 'block';
    modelViewer.style.visibility = 'hidden';
    modelViewer.style.display = 'block';

    const entryId = globalAssets[index].key;
    const srcUrl = `https://api.echo3D.com/download-model?key=${apiKey}&secKey=${secKey}&entry=${entryId}&convertMissing=true&fileFormat=glb`;
    modelViewer.src = srcUrl;

    modelViewer.addEventListener('load', () => {
      loadingIndicator.style.display = 'none';
      modelViewer.style.visibility = 'visible';
    });
  }

  function handleImageClick(event) {
    const img = event.target;
    const rect = img.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const difference = isDifference(x, y);
    if (difference.index !== -1) {
      if (!spottedDifferences.includes(difference.index)) {
        spottedDifferences.push(difference.index);
        setModelViewerSrc(difference.index);
        getQRCode(difference.index);
        createRect(difference.coordinate, 'canvas1');
        createRect(difference.coordinate, 'canvas2');
        openModal();
        console.log(`Spotted Differences: ${difference.index}`);
      } else {
        console.log('This difference has already been spotted.');
      }
    }
  }

  function isDifference(x, y) {
    for (let i = 0; i < globalAssets.length; i++) {
      const diff = globalAssets[i];
      if (x >= diff.x && x <= diff.x + diff.width &&
          y >= diff.y && y <= diff.y + diff.height) {
        return { index: i, coordinate: { x: diff.x, y: diff.y, width: diff.width, height: diff.height } };
      }
    }
    return { index: -1 };
  }

  function createRect(coordinates, canvasId) {
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

  function clearCanvas(canvasId) {
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


  async function checkDifferencesAndRedirect() {
    const totalDifferences = globalAssets.length;
    const message = document.getElementById('message');

    if (spottedDifferences.length === totalDifferences) {
      clearCanvas('canvas1');
      clearCanvas('canvas2');
      const result = await loadSet();
      if (result.success) {
        spottedDifferences.length = 0;
      } else {
        location.href = '/end';
      }
    } else {
      message.textContent = `You need to spot all ${totalDifferences} differences.`;
      message.style.color = 'red';
      message.style.font = '24px Arial';
    }
  }


  async function backToLastSet() {
    clearCanvas('canvas1');
    clearCanvas('canvas2');
    if (setCount === 2) {
      history.back();
    } else {
      setCount -= 2;
      const result = await loadSet();
      if (result.success) {
        spottedDifferences.length = 0;
      } else {
        console.error("Error when going back");
      }
    }
  }

  document.querySelector(".close").addEventListener('click', closeModal);
  document.getElementById('image1').addEventListener('click', (event) => handleImageClick(event));
  document.getElementById('image2').addEventListener('click', (event) => handleImageClick(event));
  document.getElementById('next-button').addEventListener('click', checkDifferencesAndRedirect);
  document.getElementById('back-button').addEventListener('click', backToLastSet);
});

