/** General helpers for controllers */
lastBusTanControllers.service('Helpers', function($http) {

    /* Action when pushed on the back button */
    this.backToList = function(type) {
        this.currentArret = false;
        this.loading = false;
        this.errorMessage = false;
        this.arretData = [];

        if (type == 'lignes') {
            this.pageHeader = 'Liste des lignes';
        } else if (type == 'arrets') {
            this.pageHeader = 'Liste des arrêts';
        }
    }

    /* orderBy filter for hours */
    this.hourIncreasing = function(arret) {
        var arretArray = arret.heure.split('h');
        var hours = parseInt(arretArray[0]);
        var minutes = arretArray[1];

        // if the last char is not a number (it can happen sometimes), we substract it
        if (isNaN(parseInt(minutes[minutes.length-1]))) {
            minutes = minutes.substr(0, minutes.length-1);
        }

        // we only have hours between 6am and 2am, so we use it
        if (hours < 4) { hours += 24; }
        // we return the total minutes for comparison
        return hours*60 + minutes;
    }

    /* Trigerred to show a specific stop */
    // this.showArret = function(arret) {
    //     var that = this;
    //     this.loading = true;
    //     this.errorMessage = false;
    //     this.currentArret = arret.libelle;
    //     this.pageHeader = 'Arrêt ' + arret.libelle;
    //     $http.get('/api/arret/' + arret.codeLieu)
    //         .success(function(data) {
    //             that.arretData = data;
    //             that.loading = false;
    //             if (data.length === 0) {
    //                 that.errorMessage = 'Erreur : aucune donnée pour l\'arrêt ' + arret.libelle;
    //             }
    //         })
    //         .error(function(data) {
    //             console.log('Error: ' + data);
    //             that.loading = false;
    //             that.errorMessage = 'Erreur pendant le chargement des données';
    //         });
    // }

    // this.showArret = function(codeLieu) {
    //     console.log(codeLieu);
    //     var that = this;
    //     this.loading = true;
    //     this.errorMessage = false;
    //     this.currentArret = codeLieu;
    //     this.pageHeader = 'Arrêt ' + codeLieu;
    //     $http.get('/api/arret/' + codeLieu)
    //         .success(function(data) {
    //             console.log(data);
    //             that.arretData = data;
    //             that.loading = false;
    //             if (data.length === 0) {
    //                 that.errorMessage = 'Erreur : aucune donnée pour l\'arrêt ' + codeLieu;
    //             }
    //         })
    //         .error(function(data) {
    //             console.log('Error: ' + data);
    //             that.loading = false;
    //             that.errorMessage = 'Erreur pendant le chargement des données';
    //         });
    // };


    /* Triggered when click on a "ligne" or "arret" */
    this.showMoreData = function(type) {
        if (type == 'lignes') {
            // if we loaded the data
            if (this.lastLigne !== null) {
                // we show 10 more lignes (or less if we are at the end)
                for (var i = this.lastLigne; i < this.lastLigne + this.loadingStep && i < this.dataLoaded.length; i++) {
                    this.lignes.push(this.dataLoaded[i]);
                }
                this.lastLigne += this.loadingStep;
            }
        } else { // arrets
            if (this.lastArret !== null) {
                // we show 10 more lignes (or less if we are at the end)
                for (var i = this.lastArret; i < this.lastArret + this.loadingStep && i < this.dataLoaded.length; i++) {
                    this.arrets.push(this.dataLoaded[i]);
                }
                this.lastArret += this.loadingStep;
            }
        }
    }

    /* Get the int value of a "ligne", in order to sort the list */
    this.getLigneValue = function(ligne) {
        // if it's C* or LU or another...
        if (isNaN(parseInt(ligne))) {
            if (isNaN(parseInt(ligne[1]))) {
                // 1000 + sum of charCode ==> always at the end of the list
                returnValue = 1000 + ligne.charCodeAt(0) + ligne.charCodeAt(1);
            } else {
                // 100 + (C or E)*10 + ligne number ==> always after normal numbers and
                // *10 is for preventing E1 coming after C2.
                returnValue = 100 + ligne.charCodeAt(0)*10 + parseInt(ligne[1]);
            }
        } else { // else if it's ligne number
            returnValue = parseInt(ligne);
        }
        return returnValue;
    }

    /* Quick search for arrets list */
    this.quickSearch = function () {
        // if the input is not empty, search and pick results
        var keyword = this.searchInput;
        if (keyword !== undefined) {
            var matches = this.dataLoaded.filter(function(arret) {
                return arret.libelle.toLowerCase().substring(0, keyword.length) == keyword.toLowerCase();
            });
            // display only ten first results
            this.arrets = [];
            for (var i=0; i < this.loadingStep && i < matches.length; i++) {
                this.arrets.push(matches[i]);
            }
        } else {
            // reinitialize arrets if data loaded
            if (this.dataLoaded !== null) {
                this.arrets = [];
                for (var i=0; i < this.loadingStep; i++) {
                    this.arrets.push(thise.dataLoaded[i]);
                }
            }
        }
    };
});