"use strict";

// _____________________________________________________________

// Script réalisé avec plaisir chez Simplon Hauts-de-France le 31/01/2022
// https://alexandrevenet.github.io
// _____________________________________________________________

// Fields

let DOMAudioCri, DOMAudioGagne, DOMAudioPerdu, DOMAudioOk;
let DOMLetterField;
let DOMCurrentChance;
let DOMLettersUsed;
let DOMUserWord;
let DOMUserInputZone;
let SVGHeadCircle;
let SVGEye1, SVGEye2;
let SVGHead;

let wordsList = 
[
    'pause',
    'maton',
    'pédagogie',
	'active',
	'google',
	'react',
	'distanciel',
	'présenciel'
];
let chosenWord;

let userWord;
let charHidden = '*';
let lettersUsed = [];

let currentChance = 0;
let totalChances = 10;

let bodyParts = 
[
	'SVGFloor',
	'SVGGibbetV',
	'SVGGibbetH',
	'SVGRope',
	'SVGHead',
	'SVGBody',
	'SVGArmL',
	'SVGArmR',
	'SVGLegL',
	'SVGLegR'
];

let SVGBodyParts = [];

let DOMPoleEmploi;
let DOMSvg;

// _____________________________________________________________

// Methods

// Obtenir un nombre aléatoire dans l'intervalle [0,max].
function GetRandomInt(max)
{
    return Math.floor( Math.random() * max );
}

// Afficher le mot de l'utilisateur dans le DOM
function DisplayUserWord(str)
{
    DOMUserWord.innerHTML = str; 
}

// Afficher la chance actuelle de l'utilisateur
function DisplayUserChance(str)
{
	DOMCurrentChance.innerHTML = str;
}

// _____________________________________________________________

// Loading

window.addEventListener("load",() =>
{
    // Références DOM
    DOMAudioCri = document.getElementById('DOMAudioCri');
	DOMAudioOk = document.getElementById('DOMAudioOk');
	DOMAudioGagne = document.getElementById('DOMAudioGagne');
	DOMAudioPerdu = document.getElementById('DOMAudioPerdu');

    DOMLetterField = document.getElementById('DOMLetterField');
    DOMCurrentChance = document.getElementById('DOMCurrentChance');
    DOMLettersUsed = document.getElementById('DOMLettersUsed');
    DOMUserWord = document.getElementById('DOMUserWord');
	DOMUserInputZone = document.getElementById('DOMUserInputZone');
	
	SVGHeadCircle = document.getElementById('SVGHeadCircle');
	SVGEye1 = document.getElementById('SVGEye1');
	SVGEye2 = document.getElementById('SVGEye2');
	SVGHead = document.getElementById('SVGHead');

	DOMPoleEmploi = document.getElementById('DOMPoleEmploi');
	DOMSvg = document.getElementById('DOMSvg');

	for (let i = 0; i < bodyParts.length; i++) {
		SVGBodyParts[i] = document.getElementById(bodyParts[i]);
		// SVGBodyParts[i].style.display = 'none';
	}
	 
	// Au démarrage
	DisplayUserWord('');

    // Choisir aléatoirement un mot dans la liste
    chosenWord = wordsList[GetRandomInt(wordsList.length)];
    
    // Renseigner le mot de l'utilisateur avec des lettres de masquage et de même longueur que le mot choisi
    userWord = charHidden.repeat(chosenWord.length);
    
    // L'afficher
    DisplayUserWord(userWord);

    console.log(`Le mot à trouver est : ${chosenWord}`);
    
    // Champ de saisie
    DOMLetterField.addEventListener('input',() =>
    {        
		// La lettre tapée
		let letter = DOMLetterField.value;

		// Vider le champ de saisie
		DOMLetterField.value = "";
		
		// Si la lettre n'entre pas dans le motif attendu, annuler
		if(!letter.match(/^[a-zA-Zé]/g)) return;
		
		// La lettre existe-t-elle dans le mot ?
		if(chosenWord.includes(letter))
		{
			// Explorer le mot choisi. 
			// Pour chaque index correspondant à la lettre, renseigner à cet index la lettre dans le mot de l'utilisateur
			let str = '';
			for (let i = 0; i < chosenWord.length; i++) {
				const letterAtIndex = chosenWord[i];
				let myLetter = '';
				if(letterAtIndex == letter)
				{
					myLetter = letter;
				}
				else
				{
					myLetter = userWord[i];
				}
				str += myLetter;
			}			
			userWord = str;
			DisplayUserWord(str);
			DOMAudioOk.play();
		}
		// Si la lettre n'existe pas dans le mot
		else
		{
			// Si on a déjà trouvé la lettre, annuler
			if(lettersUsed.includes(letter)) return;

			DOMAudioCri.play();
			
			SVGBodyParts[currentChance].classList.remove('invisible');

			// On perd une chance
			currentChance ++;

			DisplayUserChance(currentChance);
		}
        
		// Si la lettre n'a pas déjà été tapée, la conserver dans la liste
		if(!lettersUsed.includes(letter))
		{
			lettersUsed.push(letter);
			DOMLettersUsed.innerHTML = lettersUsed;
		}

		// A-t-on joué toutes les chances ? Si oui, perdu
		if(currentChance == totalChances)
		{
			DOMUserInputZone.innerHTML = 'PERDU';
			SVGHeadCircle.style.stroke = 'crimson';
			SVGEye1.style.fill = 'crimson';
			SVGEye2.style.fill = 'crimson';
			SVGHead.setAttribute("transform", "translate(280, -120), rotate(90)");
			DOMAudioPerdu.play();
		}

		// Le mot est trouvé ? Victoire
		if(userWord == chosenWord)
		{
			DOMUserInputZone.innerHTML = 'VICTOIRE';
			DOMAudioGagne.play();
			DOMPoleEmploi.classList.remove('invisible');
			DOMSvg.classList.add('invisible');
		}

    });


});

// _____________________________________________________________

// Fin de fichier