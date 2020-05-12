const URL = "https://opendata.paris.fr/api/records/1.0/search/?dataset=coronavirus-commercants-parisiens-livraison-a-domicile&q=&rows=300&facet=code_postal&facet=type_de_commerce"


axios
    // récupere URL api
    .get(URL)
    // .then((res) => {console.log(res)})
    // si promesse ok ==> execute start 
    .then((res) => start(res))
    // sinon affiche error dans console
    .catch((err) => console.error(err));

// démarrage
function start(res) {
    // récupere les données de l'url avec chemin
    const commerces = res.data.records;
    // execute fonction afficher Commerce
    afficherCommerce(commerces);
    document.getElementById("input").oninput = function (evt) {
        const checkedRadio = document.querySelector("[name=type-tri]:checked");
        var filteredList;
        if (checkedRadio.value === "nom") {
            filteredList = triNom(commerces, evt.target.value);
        } else {
            filteredList = triType(commerces, evt.target.value);
        }
        afficherCommerce(filteredList)
    }
}

function afficherCommerce(commerces) {
    // on récupere l'ul 
    const list = document.getElementById("list");
    // on le vide 
    list.innerHTML = "";
    // on parcours tous les commerces et on crée des li avec les infos de chaque commerce + boutton dans le ul #list
    commerces.forEach(commerce => (
        list.innerHTML += `<li><span>${commerce.fields.nom_du_commerce}</span><br> ${commerce.fields.type_de_commerce}<br><button class="btn" data-nom="${commerce.fields.nom_du_commerce}" data-type="${commerce.fields.type_de_commerce}" data-adress="${commerce.fields.adresse}" data-cp ="${commerce.fields.code_postal}" data-phone="${commerce.fields.telephone}">En savoir +</button>
   </li>`

    ));
    // on récupere le boutton .btn
    const btns = list.querySelectorAll(".btn");
    // on parcours tous les bouttons pour qu'au click d'un bouton on affiche les détails
    btns.forEach((btn) => (btn.onclick = afficherDetails))
}

function triType(commerces, search) {
    // on execute la fonction filter pour filtrer dans un nouveau tableau tous les types de commerce
    return commerces.filter(function (commerce) {
        // on met tous les types en minuscule + on verifie que la recherche(en minuscule) match/coincide 
        return commerce.fields.type_de_commerce.toLowerCase().replace('é', 'e').replace('ô', 'o').match(search.toLowerCase().replace('é', 'e').replace('ô', 'o'));
    })
};

function triNom(commerces, search) {
    // on execute la fonction filter pour filtrer dans un nouveau tableau tous les types de commerce
    return commerces.filter(function (commerce) {
        // on met tous les types en minuscule + on verifie que la recherche(en minuscule) match/coincide 
        return commerce.fields.nom_du_commerce.toLowerCase().replace('é', 'e').replace('ô', 'o').match(search.toLowerCase().replace('é', 'e').replace('ô', 'o'));
    })
};


// afficher les infos dans un div
function afficherDetails(evt) {
    // récupere div #infos
    const infos = document.getElementById("infos");
    // on stock dans des const les data-attribut
    const adress = evt.target.getAttribute("data-adress");
    const nom = evt.target.getAttribute("data-nom");
    const type = evt.target.getAttribute("data-type");
    const cp = evt.target.getAttribute("data-cp");
    const phone = evt.target.getAttribute("data-phone")
    // on récupere la balise figure et on l'a rend invisible au click du boutton "en savoir +"
    document.getElementById('pix').style.display = 'none';
    // on enlève la class "is-hidden" à la div pour la rendre visible
    infos.classList.remove("is-hidden");
    // on crée  à l'interieur de la div "infos" les elements html h2/h3/p avec les data stockées dans les const
    infos.innerHTML = `<h2>${nom}</h2><h3>${type}</h3>
    <p>${adress}<br>${cp}, Paris<br>Tél : ${phone}</p>`
}