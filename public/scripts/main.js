LION = "f918312b-01a9-4dbb-80a3-184db160b32e";
BIRD = "dde6880e-7465-42ae-ac9b-72354da8d405";
MONKEY = "5dc9b3ba-e2ff-4bb1-82c8-35efd549c149";
let apiKey;
let secKey;
document.addEventListener("DOMContentLoaded", function() {
    fetch('/api-key')
    .then(response => response.json())
    .then(data => {
      apiKey = data.apiKey;
      secKey = data.secKey;
    })
    .catch(error => console.error('Error fetching API key:', error));

    function setModelViewerSrc(apiKey, secKey, entryId) {
      const modelViewer = document.getElementById('model-viewer');
      const srcUrl = `https://api.echo3D.com/download-model?key=${apiKey}&secKey=${secKey}&entry=${entryId}&convertMissing=true`;
      modelViewer.setAttribute('src', srcUrl);
    }

    function handleImageClick(event, modelId) {
      const img = event.target;
      const rect = img.getBoundingClientRect();
      const x = event.clientX - rect.left; // x position within the element.
      const y = event.clientY - rect.top;  // y position within the element.
      console.log(x, y);
  
      // Check if the click position corresponds to a known difference.
      const {index: differenceIndex, coordinates: coordinate} = isDifference(x, y, modelId);
      if (differenceIndex !== -1) {
        triggerEvent(differenceIndex, modelId);
        create_rect(coordinate, 'canvas1')
        create_rect(coordinate, 'canvas2')
        openModal()
      }
    } 

    function isDifference(x, y, modelid) {
      let differences = []
      switch(modelid){
        case 'set1':
            differences = [
                { x: 480, y: 62, width: 85, height: 160 },//lion
                { x: 250, y: 90, width: 90, height: 90 },//monkey
                { x: 15, y: 293, width: 120, height: 100 }//bird
            ];
            break;
        default:
            return {index:-1, coordinates: null};
      }
  
      // Return the index of the matched difference, or -1 if no match
      for (let i = 0; i < differences.length; i++) {
        const diff = differences[i];
        if (x >= diff.x && x <= diff.x + diff.width &&
            y >= diff.y && y <= diff.y + diff.height) {
          return {index: i, coordinates: diff};
        }
      }
      return {index:-1, coordinates: null};
    }
  
    function triggerEvent(differenceIndex, modelId) {
      switch (modelId) {
        case 'set1':
          // Perform different actions based on the differenceIndex
          switch (differenceIndex) {
            case 0:
              console.log("lion");
              setModelViewerSrc(apiKey, secKey,  LION);
              break;
            case 1:
              console.log("monkey");
              setModelViewerSrc(apiKey, secKey, MONKEY);
              break;
            case 2:
              console.log("bird");
              setModelViewerSrc(apiKey, secKey, BIRD);
              break;
            default:
              console.log("Unknown difference detected");
              break;
          }
          break;
        default:
          console.log("Unknown model ID");
          break;
      }
    }

    

    function create_rect(coordinates, canvasId){
        var canvas = document.getElementById(canvasId);
        var ctx = canvas.getContext('2d');
        
        // Ensure the canvas size matches its image
        if (!canvas.getAttribute('data-initialized')) {
            canvas.width = canvas.parentNode.offsetWidth;
            canvas.height = canvas.parentNode.offsetHeight;
            canvas.setAttribute('data-initialized', 'true');
        }
    
        ctx.strokeStyle = 'red'; // Color of the border
        ctx.lineWidth = 2; 

        ctx.strokeRect(coordinates.x, coordinates.y, coordinates.width, coordinates.height);
    }

    function openModal() {
      const modal = document.getElementById("myModal");
      modal.style.display = "block";
    }
  
    // Close the modal
    function closeModal() {
      const modal = document.getElementById("myModal");
      modal.style.display = "none";
      const modelViewer = document.getElementById("model-viewer");
      modelViewer.setAttribute('src', '');
      console.log(modelViewer.getAttribute('src'))
    }
  
    // Attach the click event listener to the images
    document.querySelector(".close").addEventListener('click', closeModal);
    document.getElementById('image1').addEventListener('click', (event) => handleImageClick(event, 'set1'));
    document.getElementById('image2').addEventListener('click', (event) => handleImageClick(event, 'set1'));
  });
  