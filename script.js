// script.js

// Set up event listener for when the DOM content is loaded
document.addEventListener("DOMContentLoaded", function() {
  // Get the canvas element and its 2d context
  const canvas = document.getElementById('drawingCanvas');
  const ctx = canvas.getContext('2d');
  // Set the initial width and height of the canvas
  canvas.width = 1500;
  canvas.height = 600;

  // Initialize variables for painting, erasing, brush color, and brush size
  let painting = false;
  let erasing = false;
  let brushColor = document.getElementById('colorPicker').value;
  let brushSize = document.getElementById('brushSize').value;
  
  // Added background color variable and set its initial value
  let backgroundColor = document.getElementById('backgroundColorPicker').value;

  // Function to set the starting position for drawing or erasing
  function startPosition(e) {
      painting = true;
      if (!erasing) {
        ctx.beginPath(); // Start a new drawing path
        draw(e);
      } else {
        erase(e);
      }
  }

  // Function to set the finishing position for drawing or erasing
  function finishedPosition() {
      painting = false;
  }
  
  // Function to erase part of the canvas
  function erase(e) {
      ctx.globalCompositeOperation = 'destination-out';
      draw(e);
      ctx.globalCompositeOperation = 'source-over';
  }

  // Event listener for clearing the canvas
  document.getElementById('clearCanvas').addEventListener('click', function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  // Event listener for toggling erase mode
  document.getElementById('eraseMode').addEventListener('click', function() {
    erasing = !erasing;
    if (erasing) {
      canvas.style.cursor = 'url("./icon/eraser.png"), auto'; // Change cursor to delete image
      eraseMode.src = './icon/pen.png'
      eraseMode.title = 'pen'
      document.ge
    } else {
      canvas.style.cursor = 'url("./icon/pen.png"), auto'; // Change cursor to pen image
      eraseMode.src = './icon/eraser.png'
      eraseMode.title = 'delete'


    }
    this.textContent = erasing ? 'painter' : 'delete';
  });
  
  // Function to draw on the canvas
  function draw(e) {
      if (!painting) return;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.strokeStyle = brushColor;

      // Adjusted the calculation to consider the canvas bounding rectangle
      ctx.lineTo(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
  }

  // Event listeners for mouse actions on the canvas
  canvas.addEventListener('mousedown', startPosition);
  canvas.addEventListener('mouseup', finishedPosition);
  canvas.addEventListener('mousemove', function(e) {
    if (erasing) erase(e);
    else draw(e);
  });

  // Event listener for adding an image to the canvas
  const imageInput = document.getElementById('addImg');
  imageInput.type = 'file';
  imageInput.accept = 'image/*';
  imageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
      const img = new Image();
      img.onload = function() {
        ctx.drawImage(img, 0, 0,  canvas.width, canvas.height); // Set image size to canvas size
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);

    
    // delete img on the painter
    const deleteButton = document.createElement('ion-icon');
    deleteButton.setAttribute('name', 'trash-outline')
    deleteButton.textContent = 'Delete Image';
    deleteButton.classList = 'tool';
    deleteButton.addEventListener('click', function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      document.getElementById('uploadImg').removeChild(deleteButton);
    });
    document.getElementById('uploadImg').append(deleteButton)
  });

  // Event listener for changing the brush color
  document.getElementById('colorPicker').addEventListener('change', function() {
    brushColor = this.value;
  });
  
  // Event listener for changing the brush size
  document.getElementById('brushSize').addEventListener('input', function() {
    brushSize = this.value;
    document.getElementById('valueRange').innerText = brushSize;
  });

  // Event listener for changing the background color of the canvas
  document.getElementById('backgroundColorPicker').addEventListener('input', function() {
      backgroundColor = this.value;
      canvas.style.backgroundColor = backgroundColor; // Change canvas background color
  });

  // Event listener for saving the canvas as an image
  document.getElementById('saveImage').addEventListener('click', function() {
    const savedCanvas = document.createElement('canvas');
    savedCanvas.width = canvas.width;
    savedCanvas.height = canvas.height;
    const savedCtx = savedCanvas.getContext('2d');
    
    // Fill the saved canvas with the background color
    savedCtx.fillStyle = backgroundColor;
    savedCtx.fillRect(0, 0, savedCanvas.width, savedCanvas.height);
    
    // Draw the content of the main canvas onto the saved canvas
    savedCtx.drawImage(canvas, 0, 0);
    
    // Convert the saved canvas to a data URL and trigger download
    const image = savedCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const link = document.createElement('a');
    link.href = image;
    link.download = 'drawing.png';
    link.click();
  });
  
})