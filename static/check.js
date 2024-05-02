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
    const file = fileUploadInput.files[0];
    if (!file) {
      showResult("Kindly upload an audio file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    fetch("/predict", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          showResult(data.error);
        } else {
          showResult(data.result);
        }
      })
      .catch((error) => {
        showResult("Error occurred. Please try again later.");
        console.error("Error:", error);
      });
  });

  function showResult(result) {
    const resultContainer = document.querySelector(".result-container");
    resultContainer.textContent = result;
  }
});
