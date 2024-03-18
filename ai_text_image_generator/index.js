const OPENAI_API_KEY = "Your API kEY";

const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");
const icon = document.getElementById("icon");
const shareBtn = document.querySelector(".share-btn");
const shareOptions = document.querySelector(".share-options"); // Corrected typo here

let isImageGenerating = false;

// Share button
shareBtn.addEventListener('click', () => {
    shareOptions.classList.toggle('active');
});

// Dark theme
icon.onclick = function () {
    document.body.classList.toggle("dark-theme");
    icon.src = document.body.classList.contains("dark-theme") ? "images/sun.svg" : "images/moon.svg";
};

const updateImageCard = (imageDataArray) => {
    imageDataArray.forEach((imgObject, index) => {
        const imgCard = imageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");
        const downloadBtn = imgCard.querySelector(".download-btn");

        const aiGeneratedImg = `data:image/jpeg;base64, ${imgObject.b64_json}`;

        imgElement.src = aiGeneratedImg;

        imgElement.onload = () => {
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href", aiGeneratedImg);
            downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
        };
    });
};

const generateAiImages = async (userPrompt, userImgQuantity) => {
    try {
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: parseInt(userImgQuantity),
                size: "512x512",
                response_format: "b64_json"
            })
        });

        if (!response.ok) {
            throw new Error("Failed to generate images! Please try again.");
        }

        const { data } = await response.json();
        updateImageCard([...data]);
    } catch (error) {
        console.error(error);
        alert("An error occurred while generating images. Please try again.");
    } finally {
        isImageGenerating = false;
    }
};

const handleFormSubmission = (e) => {
    e.preventDefault();
    if (isImageGenerating) return;
    isImageGenerating = true;
    const userPrompt = e.srcElement[0].value;
    const userImgQuantity = e.srcElement[1].value;

    const imgCardMarkup = Array.from({length:userImgQuantity}, () => `
    <div class="img-card loading">
    <img src="images/loading.svg" alt="loading svg">
    <a href="#" class="download-btn" >
        <img src="images/download.svg" alt="download icon">              
    </a>
    
    <div class="share-btn-container">
        <button class="share-btn" onclick="toggleShareOptions()">
            <img src="images/share.svg" alt="share icon">
        </button>
        <div class="share-options">
            <div class="social-media">
                <button class="social-media-btn"><i class="fab fa-whatsapp"></i></button>
                <button class="social-media-btn"><i class="fab fa-instagram"></i></button>
                <button class="social-media-btn"><i class="fab fa-twitter"></i></button>
                <button class="social-media-btn"><i class="fab fa-facebook-f"></i></button>
                <button class="social-media-btn"><i class="fab fa-linkedin-in"></i></button>
            </div>
            <div class="link-container">
                <p class="link">https://ai.com/share</p>
                <button class="copy-btn">copy</button>
            </div>
        </div>
    </div>
    
</div>
    `).join(" ");
    imageGallery.innerHTML = imgCardMarkup;
    generateAiImages(userPrompt, userImgQuantity);
};
generateForm.addEventListener("submit", handleFormSubmission); 
