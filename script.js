//This help to load random image from pexels
const imagesWrapper = document.querySelector(".images");
//This will load more image after clicking load button
const loadMoreBtn = document.querySelector(".load-more");
//Lets search images by input words
const searchInput = document.querySelector(".search-box input");
//Lets show lightbox on image click
const lightBox = document.querySelector(".lightbox");
//Lets hide the lightbox on close btn click
const closeBtn = lightBox.querySelector(".uil-times");
//Lets download the image on download btn click in lightbox
const downloadImgBtn = lightBox.querySelector(".uil-import");

//API Key,Pagination,searchTerm varibles
// To make images dynamic we will use pexels API
const apikey="NJxm9UXV16s2UprbkaJOdXFPZJV5zN798qhwoxEaMDgZJm9TvEhOMFMh";
const perPage = 5;  //We'll load 15 images on every API calls
let currentPage = 1;   //Later,we'll increment the currentPage on load more button click
let searchTerm = null;

//Getting blob object of image .Now we can download it
//URL.createObjectURL() --this creates URL of passed object
const downloadImg = (imgURL) => {
    //Converting received img to blob,creating its download link , & downloading it
    fetch(imgURL).then(res => res.blob()) // Convert the image response to a Blob
    .then(file => {
        // Create a temporary link (<a>) element to trigger the download
        const a = document.createElement("a");
        // Create an Object URL for the Blob file (to treat it as a downloadable link)
        a.href = URL.createObjectURL(file);
        // File will be saved with a name based on current time
        a.download = new Date().getTime() ; //Passing current time in milliseconds as <a> download value
         // Programmatically "click" the link to trigger the download
        a.click();
    }).catch(() =>alert("Failed to download images!"));
}

const showLightbox = (name,img) =>{
    //Showing lightbox and setting img source ,name and button attribute
    lightBox.querySelector("img").src = img;
    lightBox.querySelector("span").innerText = name;
    downloadImgBtn.setAttribute("data-img", img)  //Storing the image url as a btn attribute , so we can download it later
    lightBox.classList.add("show");
    //Lets hide the scrollbar when lightbox is shown
    document.body.style.overflow = "hidden";
}

const hideLightbox = () => { 
    lightBox .classList.remove("show"); 
    document.body.style.overflow = "auto";  
}


//${img.src.large2x}--This is often used for responsive images, where different sizes are used depending on the screen resolution
//stopPropagation()--prevents propagation of the same event from being called
const generateHTML = (images) => {
    //Making li of all fetched images and adding them to the existing image wrapper
    imagesWrapper.innerHTML += images.map(img =>
        //After adding this line we can remove images from index.html
        `<li class="card" onclick="showLightbox('${img.photographer}', '${img.src.large2x}')">
                <img src="${img.src.large2x}" alt="img">
                <div class="details">
                    <div class="photographer">
                        <i class="uil uil-camera"></i>
                        <span>${img.photographer}</span>
                    </div>
                    <button onclick="downloadImg('${img.src.large2x}');event.stopPropagation();"> 
                    <i class="uil uil-import"></i>
                    </button>
                </div>
            </li>`
    ).join("");
}

const getImages = (apiURL) => {
    //Fetching images by API calls with authorization header
    loadMoreBtn.innerText = "Loading...";
    loadMoreBtn.classList.add("Disabled");
    fetch(apiURL , {
        headers:{Authorization : apikey}
    }).then(res => res.json()).then(data =>{
        // console.log(data);\
        generateHTML(data.photos);
        //Once data has been fetched , we'll cahnge button state back to normal
        loadMoreBtn.innerText = "Load More";
        loadMoreBtn.classList.remove("Disabled");
    }).catch(() => alert("Failed to load images!"))  //Showing an alert if API failed with any reason
}

const loadMoreImages = () => {
    currentPage++;  //Increment currentPage by 1
    //If searchTerm has some value the call API with searchTerm wlse call default API
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiURL;
    getImages(apiURL);
}

const loadSearchImages = (e) =>{
    //If the search input is empty ,set the search term to null and return from here
    if(e.target.value === "") return searchTerm = null;
    //If pressed key is Enter ,update the current page ,search term and call the getImages
    if(e.key === "Enter") {
        currentPage = 1;
        searchTerm = e.target.value;
        imagesWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);
    }
}

//This link will give--This endpoint enables you to receive real-time photos curated by the Pexels team.
getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
//Add eventlister to loadmore button
loadMoreBtn.addEventListener("click", loadMoreImages);
//Keyup--This event is commonly used to detect when the user finishes typing 
searchInput.addEventListener("keyup", loadSearchImages);
closeBtn.addEventListener("click", hideLightbox);
//Passing btn img attribute value as argument to the downloading function
downloadImgBtn.addEventListener("click" , (e) => downloadImg(e.target.dataset.img));