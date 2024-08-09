const email = document.getElementById("email")
const password = document.getElementById("password")
const API = "http://localhost:5678/api/users/login"
const form = document.querySelector("form")
const errorMessage = document.createElement("div")
form.appendChild(errorMessage)



form.addEventListener("submit", async (e) => {
    //Empeche le comportement par defaut du formulaire
    e.preventDefault(); 
    //Appelle la methode connexion
    await connectLogin();
})


const connectLogin = async () => {
    const request = {email:email.value , password:password.value}
    try {
    const reponse = await fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body:JSON.stringify(request)
    });
    console.log("La réponse est", reponse)
    if (!reponse.ok){
    errorMessage.style.visibility = "visible"
    errorMessage.style.backgroundColor = "rgba(200,0,0,1)";
    errorMessage.innerHTML = "Erreur de connexion: identifiant ou mot de passe incorrect"
    return
    }
    const reponseData = await reponse.json();
    const token = reponseData.token;
    console.log(token)
    localStorage.setItem("Token", token)
    window.location.href="index.html"

    }catch(error){
    console.error("Erreur lors de la connexion", error)
    };
}
