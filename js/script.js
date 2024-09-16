$(document).ready(function () {
    // Requête API Météo pour une ville donnée
    $('#btnEnvoyer').on('click', function () {
        let ville = $('#chercher').val().trim();

        if (ville !== "") {
            getWeather(ville);
        } else {
            alert("Veuillez entrer une ville.");
        }
    });

    // Requête API pour la géolocalisation de l'utilisateur
    $('#maposition').on('click', function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;
                getWeatherByCoords(latitude, longitude);
            });
        } else {
            alert("La géolocalisation n'est pas supportée par ce navigateur.");
        }
    });

    // Fonction pour récupérer la météo en fonction du nom de la ville
    function getWeather(ville) {
        $.ajax({
            url: `https://www.prevision-meteo.ch/services/json/${ville}`,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                $('.container').show(); 
                updateUI(data);
            },
            error: function (error) {
                alert("Ville introuvable. Veuillez vérifier l'orthographe.");
            }
        });
    }

    // Fonction pour récupérer la météo en fonction de la géolocalisation
    function getWeatherByCoords(lat, lon) {
        $.ajax({
            url: `https://www.prevision-meteo.ch/services/json/lat=${lat}lng=${lon}`,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                $('.container').show(); 
                updateUI(data, lat, lon);
            },
            error: function (error) {
                alert("Erreur lors de la récupération des données météorologiques.");
            }
        });
    }

    function updateUI(data, lat, lon) {
        // Vérification si le nom de la ville est "NA"
        const cityName = data.city_info.name !== "NA" ? data.city_info.name : `Lat: ${lat},<br> Lon: ${lon}`;
    
        // Affichage du nom de la ville ou des coordonnées
        $('#position').html(`<h4>${cityName}</h4>`);

        // Météo du jour
        $('#jour1').html(`
            <div style="display: flex; align-items: center;">
                <img src="${data.fcst_day_0.icon}" alt="icone météo" style="margin-right: 10px;">
                <h5 style="margin: 0;">${data.fcst_day_0.day_long} - ${data.fcst_day_0.date}  ${data.fcst_day_0.tmax}°C</h5>
            </div>
        `);

        // Météo pour les 4 jours suivants
        $('#jour2').html(`
            <div style="display: flex; align-items: center;">
                <img src="${data.fcst_day_1.icon}" alt="icone météo" style="margin-right: 10px;">
                <h5 style="margin: 0;">${data.fcst_day_1.day_long} - ${data.fcst_day_1.date}  ${data.fcst_day_1.tmax}°C</h5>
            </div>
        `);
        $('#jour3').html(`
            <div style="display: flex; align-items: center;">
                <img src="${data.fcst_day_2.icon}" alt="icone météo" style="margin-right: 10px;">
                <h5 style="margin: 0;">${data.fcst_day_2.day_long} - ${data.fcst_day_2.date}  ${data.fcst_day_2.tmax}°C</h5>
            </div>
        `);        
        $('#jour4').html(`
            <div style="display: flex; align-items: center;">
                <img src="${data.fcst_day_3.icon}" alt="icone météo" style="margin-right: 10px;">
                <h5 style="margin: 0;">${data.fcst_day_3.day_long} - ${data.fcst_day_3.date} ${data.fcst_day_3.tmax}°C</h5>
            </div>
        `);       
        $('#jour5').html(`
            <div style="display: flex; align-items: center;">
                <img src="${data.fcst_day_4.icon}" alt="icone météo" style="margin-right: 10px;">
                <h5 style="margin: 0;">${data.fcst_day_4.day_long} - ${data.fcst_day_4.date} ${data.fcst_day_4.tmax}°C </h5>
            </div>
        `);
    }
});