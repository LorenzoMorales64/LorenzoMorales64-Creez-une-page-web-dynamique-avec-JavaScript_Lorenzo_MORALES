# Backend API - Sophie Bluel

Ce repo contient le code backend de l'architecte Sophie Bluel. 

## Lancement du backend

Après avoir récupéré le REPO executez la commande `npm install` pour installer les dépendances du projet

Une fois les dépendances installées lancez le projet avec la commande `npm start`

Compte de test pour Sophie Bluel

```
email: sophie.bluel@test.tld
 
password: S0phie
```
Lien pour voir la
[documentation Swagger](http://localhost:5678/api-docs/)

Pour lire la documentation, utiliser Chrome ou Firefox
formFiles.addEventListener("submit", async (event) => {
    event.preventDefault();
    await uploadFiles();
    
});

const uploadFiles = async () => {
    const formData = new FormData(formFiles); 


    if (!token) {
        alert('Il vous faut une compte administrateur pour pouvoir ajouter des photos');
        return;
    }

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const addedPhoto = await response.json();
        console.log('Photo ajoutée:', addedPhoto);
        alert('Photo ajoutée avec succès!');
        modalBlock.style.display = "none";
        formFiles.reset();

        // Ajouter la nouvelle photo à la galerie
        const figure = creatWorksByFigure(addedPhoto);
        gallery.appendChild(figure);

    } catch (error) {
        console.error('Erreur lors de l\'ajout de la photo:', error);
        alert('Erreur lors de l\'ajout de la photo');
    }
}