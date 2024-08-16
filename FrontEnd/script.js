const gallery = document.querySelector(".gallery");
const categoriesContainer = document.querySelector(".categories");
let connected = false;
let allWorks = [];
const log = document.querySelector("#login")
const hideBorder = document.querySelector("#editorBorder")
const iconSideModifier = document.querySelector("#iconSide")
const token = localStorage.getItem("Token");
const addImage = document.querySelector("#fileInput")
const imagePreview = document.querySelector("#imagePreview")




/*fonction qui retourne le tableau des works*/
const getWorks = async () => {
    gallery.innerHTML = ""
    try {
        const response = await fetch("http://localhost:5678/api/works");
        const works = await response.json();
        console.log(works)

        //On s'assure d'abord que le tableau est vide
        allWorks.length = 0;
        //On met tous les works récupéré dans le tableau allWorks
        allWorks = works
        console.log("L'ensemble des works est", allWorks)

        for (let work of works) {
            const figure = creatWorksByFigure(work)
            gallery.appendChild(figure)
            console.log(figure)
            console.log(gallery)
        }

    } catch (error) {
        console.error("error fetching works:", error)
        throw new Error(`api error status with status code ${response.status}`)
    }
}
getWorks();

/*Affichage des works dans le dom*/
const creatWorksByFigure = (work) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;
    figure.appendChild(img);

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = work.title;
    figure.appendChild(figcaption);

    return figure;
}



const API = "http://localhost:5678/api/categories"
let allCategories = []
const categorieData = async () => {
    try {
        const result = await fetch (`${API}`);
        const dataJson = await result.json(); //conversion en json 
        dataJson.unshift({id:0,name:"Tous"})
        console.log(dataJson);
        allCategories = dataJson
        for(let category of allCategories){
            const button = document.createElement("button")
            button.innerHTML = category.name
            button.setAttribute("data-categoryId", category.id)
            categoriesContainer.appendChild(button)
        }
    } catch (error) {
        console.error(error)
        throw new Error (`API error status code ${result.status}`)
    }
};
categorieData();

categoriesContainer.addEventListener("click", (event)=>{
    const buttons = document.querySelectorAll(".categories button")
    console.log(buttons)
    if (event.target.getAttribute("data-categoryId")){
        buttons.forEach((button)=>{
            button.classList.remove("active-filter") //on supprime la classe active filter de tout les boutons
        })
        const categoryId = parseInt(event.target.getAttribute("data-categoryId"))
        event.target.classList.add("active-filter")
        createFilterButtons(categoryId)
    }
})

const createFilterButtons = (categoryId) => {
    gallery.innerHTML="" //on vide la gallerie 
    if (categoryId === 0) {
        // Si la catégorie sélectionnée est "Tous", affichez tous les travaux
        for (let work of allWorks) {
            const figure = creatWorksByFigure(work);
            gallery.appendChild(figure);
        }
    } else {
        // Sinon, filtrez les travaux par catégorie
        const filteredWorks = allWorks.filter((work) => work.categoryId === categoryId);
        for (let work of filteredWorks) {
            const figure = creatWorksByFigure(work);
            gallery.appendChild(figure);
        }
    }
};


//formulaire MODAL




const addPhotoModal = document.getElementById("ajout-photo-modal");
const closeModalButton = document.querySelector(".close");
const modalGallery = document.querySelector(".gallery-modal")
const modifier = document.querySelector("#ajout-photo-button") 
const modalBlock = document.querySelector(".modal")



const showModal = () => {
    if (modalBlock){
        modalBlock.style.display = "block";  
    }else{
        console.log("erreur")
    }
}
modifier.addEventListener("click", showModal,);

const hideModal = () => {
    if(closeModalButton)
        modalBlock.style.display = "none"
    else{
        console.log("Je veux pas me fermer")
    }
}
closeModalButton.addEventListener("click", hideModal);


const creatWorksByFigureModal = (work) => {
    const figure = document.createElement("figure");
    figure.setAttribute("data-work", work.id)
    const img = document.createElement("img");
    const icon = document.createElement("div")
    img.src = work.imageUrl;
    img.alt = work.title;
    icon.innerHTML = '<i class="fa-solid fa-trash-can fa-xs"></i>'
    icon.classList.add("delete-icon")
    icon.style.cursor = "pointer"
    figure.appendChild(img);
    figure.appendChild(icon);

    return figure;
}
const modalWork = async () => {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        const workModal = await response.json();
        console.log(workModal)

        //On s'assure d'abord que le tableau est vide
        allWorks.length = 0;
        //On met tous les works récupéré dans le tableau allWorks
        allWorks = workModal
        console.log("L'ensemble des works est", allWorks)

        for (let work of workModal) {
            const figure = creatWorksByFigureModal(work)
            modalGallery.appendChild(figure)
            console.log(figure)
            console.log(gallery)
        }

    } catch (error) {
        console.error("error fetching works:", error)
        throw new Error(`api error status with status code ${response.status}`)
    }
}
modalWork();

document.querySelector(".modal").addEventListener("click", (event) => {   ///////////////////
    if (event.target.classList.contains("fa-trash-can")) {
        const figure = event.target.closest("figure");
        const workId = figure.getAttribute("data-work");
        console.log("l'Id de work est", workId);
        getWorks();
        deleteData(`http://localhost:5678/api/works/${workId}`, figure);
    }
})
const deleteData = async (urlId,figure) => {
    if (!token) {
        alert("Vous devez être connecté pour effectuer cette action");
        return;
      }
    
      const confirmation = confirm("Etes-vous bien sûr de vouloir supprimer ce projet ?");
      if (!confirmation) {
        return;
    }

    try {
        let response = await fetch(urlId, {
            method: 'DELETE',
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error(`Erreur http: ${response.status}`);
          }
          figure.remove();
          alert('Le work a été supprimé');
    }catch (error) {
        console.error("erreur lorsque l'on essaye de supprimer le work")
    }
    gallery.innerHTML = ""
    getWorks()
}

const ajoutPhotoForm = document.getElementById("ajout-photo-dans-modal");
const showForm = document.querySelector(".showForm")
const formFiles = document.querySelector("#modalForm2 form")

const showModalForm = () => {
    if (showForm){
        showForm.style.display = "block"; 
    }else{
        console.log("erreur")
    }
}
ajoutPhotoForm.addEventListener("click", showModalForm);


//Lorsqu'on est connecté
if (token) {
    connected = true
}
if (connected) {
    log.innerHTML = "logout"
    categoriesContainer.style.display = "none"
    modifier.style.display = "flex"
    iconSideModifier.style.display = "flex"
    
} else {
    log.innerHTML = "login"
    categoriesContainer.style.display = "flex"
    modifier.style.display = "none"
    hideBorder.style.display = "none"
}

const logout = () => {
    localStorage.removeItem("Token");
    
    window.location.href = "./index.html";
    
    console.log("L'utilisateur s'est déconnecté");
}

document.addEventListener("DOMContentLoaded", () => {
    const logoutLink = document.getElementById("login");
    
    if (connected) {
        logoutLink.addEventListener('click', (event) => {
            event.preventDefault(); 
            logout(); 
        });
    }
});


const modalBlock2 = document.querySelector(".modal2")
const boutonAjoutModale = document.querySelector("#ajout-photo-dans-modal")
const boutonClose2 = document.querySelector(".close2")
const formGroupe3 = document.querySelector(".form-group2")
const formGroupe4 = document.querySelector(".form-group3")

const showModal2 = () => {
    if (modalBlock2){
        modalBlock2.style.display = "block";
        modalBlock.style.display = "none";
        imagePreview.style.display = "none"
        hideInputFile.style.display = "block"
        hideInputBouton.style.display = "block"
        hideInputText.style.display = "block"
        formFiles.reset()
    }else{
        console.log("erreur")
    }
    updateSubmitButtonState()
}
boutonAjoutModale.addEventListener("click", showModal2);

const hideModal2 = () => {
    if(boutonClose2)
        modalBlock2.style.display = "none"
    else{
        console.log("Je veux pas me fermer")
    }
}
boutonClose2.addEventListener("click", hideModal2);

const arrowReturnModale = document.querySelector("#arrowReturn")
const returnModal = () => {
    if (modalBlock2) {
        modalBlock.style.display = "block";
        modalBlock2.style.display = "none";
}
}
arrowReturnModale.addEventListener("click", returnModal)


document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById("category");
    const form = document.getElementById("modalForm2");

    async function fetchCategories() {
        try {
            const response = await fetch("http://localhost:5678/api/categories");
            const categories = await response.json();
            
            categories.forEach(category => {
                const option = document.createElement("option");
                option.setAttribute("category-id", category.id);
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des catégories:', error);
        }
    }


    fetchCategories();
});

const submitButton = document.querySelector("#modalForm2 form button[type = 'submit']")

const updateSubmitButtonState = () => {
    const title = document.getElementById("title").value.trim()
    const categorySelected = document.getElementById("category").value.trim();
    const imageSelected = addImage.files[0];
    if (title && categorySelected && imageSelected) {
        submitButton.classList.remove("submitDisabled")
        submitButton.classList.add("submitValidated")
        submitButton.disabled = false 
    }else {
        submitButton.classList.add("submitDisabled")
        submitButton.classList.remove("submitValidated");
        submitButton.disabled = true
    }
}



const hideInputFile = document.querySelector("#hideInputFile")
const hideInputBouton = document.querySelector("#hideInputBouton")
const hideInputText = document.querySelector("#hideInputText")

//lorsqu'on télécharge une image 
addImage.addEventListener("change", async (event) => {
    const selectedFile = event.target.files[0]
    const EXTENSIONFILES = ["png", "jpeg", "jpg"]
    const fileName = selectedFile.name
    const extractedExtension = fileName.split(".").pop().toLowerCase()
    if (selectedFile && selectedFile.size <= 4* 1024 * 1024 && EXTENSIONFILES.includes(extractedExtension)) {
        const reader = new FileReader()
        reader.onload = async (e) => {
            imagePreview.src = e.target.result //on met à jour la source de l'image
            imagePreview.style.display = "block"
            hideInputFile.style.display = "none"
            hideInputBouton.style.display = "none"
            hideInputText.style.display = "none"

        }
        reader.readAsDataURL(selectedFile)
    }else {
        console.error("Le fichier est trop volumineux ou le fichier a une extension incorrect")
    }
    updateSubmitButtonState() //Met à jour l'état du bouton valider 
})

document.addEventListener("DOMContentLoaded", () => {
    updateSubmitButtonState()  //Lorsque la page est chargé, on remet à jour le bouton
} )
document.getElementById("title").addEventListener("input", updateSubmitButtonState)
document.getElementById("category").addEventListener("change", updateSubmitButtonState)
addImage.addEventListener("change", updateSubmitButtonState)

// Envoie du formulaire



formFiles.addEventListener("submit", async (event) => {
    event.preventDefault();
    await uploadFiles()
    hideModal2()
    
    
});





const uploadFiles = async () => {

    if (!token) {
        alert("Vous devez être connecté pour publier un work");
        return;
    }
    console.log(token)

    const titleProjet = document.getElementById("title").value;
    const select = document.getElementById("category");
    const optionName = select.options[select.selectedIndex].innerText;
    const optionId = select.options[select.selectedIndex].getAttribute("category-id");
    const selectedFile = addImage.files[0];

    const reader = new FileReader()
    console.log(reader)
    reader.onloadend = async (event) => {
        console.log(reader.onloadend)
        try {
            const base64String = event.target.result;
            console.log(base64String)
            /*On convertit l'image en blob qui est plus avantageux entre autres,  réduit l'utilisation de la mémoire
            et améliore les performances de l'applications etc */
            const blobImg = await dataURLtoBlob(base64String);
            console.log(blobImg)
            console.log("optionId est", optionId)
            const formData = new FormData();
            formData.append("image",blobImg);
            formData.append("title", titleProjet);
            formData.append("category", optionId);

            await sendDataToBdd(token, formData, titleProjet, optionName)
        } catch (error) {
            console.log("erreur: ", error)
        }
        
    }  
    reader.readAsDataURL(selectedFile)
}

//Pour transformer l'image en blob (binary large object) afin de faciliter le televersement.
const dataURLtoBlob = async (dataurl) => {
    const response = await fetch(dataurl);
    const blob = await response.blob();
    console.log(blob)
    return blob;
};
const sendDataToBdd = async (token, formData, titleProjet, optionName) => {
    const workUrl = "http://localhost:5678/api/works" 
    console.log(token)
    console.log(workUrl)
    const confirmation = confirm(`Voulez-vous ajouter ${titleProjet} à la gallerie?`);
    if (!confirmation) return;
    
    try {
        const response = await fetch (workUrl, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`},
            body: formData,
        });
        console.log(response)
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const responseData = await response.json();
        console.log('Successful response:', responseData);
        addWorkGallery(responseData, optionName)
        //vide la gallerie et rafraichit la gallerie
    } catch (error) {
        console.log("erreur: ", error)
    }
}

const addWorkGallery = (data, option) => {
    let newWork = {}
    console.log(newWork)
    newWork.title = data.title,
    newWork.id = data.id,
    newWork.category = {id: data.optionId , name: option},
    newWork.imageUrl = data.imageUrl,
    allWorks.push(newWork)
    const figure = creatWorksByFigure(newWork);
    gallery.appendChild(figure);
}







