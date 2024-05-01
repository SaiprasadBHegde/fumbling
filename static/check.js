document.addEventListener("DOMContentLoaded", function () {
  const fileUploadInput = document.getElementById("file-upload");
  const audioPreview = document.getElementById("audio-preview");

  fileUploadInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        audioPreview.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  });

  const predictButton = document.getElementById("predict-button");

  predictButton.addEventListener("click", function () {
    // Dummy result for demonstration
    const result = "Result: No fumbling detected";

    showResult(result);
  });

  function showResult(result) {
    const resultContainer = document.querySelector(".result-container");
    resultContainer.textContent = result;
  }
});
