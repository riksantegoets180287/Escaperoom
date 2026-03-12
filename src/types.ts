export interface Progress {
  completedGames: { [key: number]: boolean };
  skippedGames: { [key: number]: boolean };
  attempts: { [key: number]: number };
  startTime: number;
}

export interface AdminConfig {
  appTitle: string;
  codePieces: { [key: number]: string };
  game1: {
    gridSize: number;
    patternLength: number;
    maxAttempts: number;
  };
  game2: {
    targetText: string;
    passPercent: number;
    minWords: number;
  };
  game3: {
    emails: Array<{
      id: string;
      from: string;
      subject: string;
      body: string;
      isPhishing: boolean;
    }>;
    minCorrect: number;
  };
  game4: {
    questions: Array<{
      id: string;
      prompt: string;
      acceptableAnswers: string[];
    }>;
  };
  game5: {
    words: string[];
    gridSize: number;
  };
  game6: {
    showExample: boolean;
  };
}

export const DEFAULT_ADMIN_CONFIG: AdminConfig = {
  appTitle: "Operation Virusvrij",
  codePieces: {
    1: "E",
    2: "U",
    3: "re",
    4: "k",
    5: "a",
    6: "!"
  },
  game1: {
    gridSize: 7,
    patternLength: 5,
    maxAttempts: 3
  },
  game2: {
    targetText: "Het Summa College is een mbo-instelling in Eindhoven en omgeving. Wij bieden meer dan 250 beroepsopleidingen aan in verschillende sectoren. Onze missie is om studenten optimaal voor te bereiden op de arbeidsmarkt en de maatschappij. We werken nauw samen met het bedrijfsleven om ervoor te zorgen dat onze opleidingen aansluiten bij de praktijk. Innovatie en persoonlijke aandacht staan bij ons centraal. Of je nu kiest voor techniek, zorg, economie of een andere richting, bij Summa krijg je de ruimte om je talenten te ontdekken en te ontwikkelen voor een mooie toekomst!",
    passPercent: 90,
    minWords: 80
  },
  game3: {
    emails: [
      { id: '1', from: 'support@bank-veilig.nl', subject: 'Dringend: Uw account is geblokkeerd', body: 'Beste klant, we hebben verdachte activiteiten opgemerkt. Klik hier om uw account te deblokkeren.', isPhishing: true },
      { id: '2', from: 'it-servicedesk@summacollege.nl', subject: 'Wachtwoord verloopt bijna', body: 'Beste collega, uw wachtwoord verloopt over 3 dagen. U kunt dit wijzigen via de standaard portal.', isPhishing: false },
      { id: '3', from: 'belastingdienst@teruggave-nu.com', subject: 'U heeft recht op €450,00', body: 'Gefeliciteerd! Uw belastingteruggave staat klaar. Vul uw gegevens in om het bedrag te ontvangen.', isPhishing: true },
      { id: '4', from: 'noreply@microsoft.com', subject: 'Beveiligingswaarschuwing', body: 'Er is ingelogd op uw account vanaf een nieuw apparaat in Brazilië. Was u dit niet? Controleer uw activiteit.', isPhishing: false },
      { id: '5', from: 'pakket@post-nl-zending.net', subject: 'Uw pakket is vertraagd', body: 'We konden uw pakket niet bezorgen. Betaal €1,50 verzendkosten om een nieuwe afspraak te maken.', isPhishing: true }
    ],
    minCorrect: 5
  },
  game4: {
    questions: [
      { id: '1', prompt: 'Wat is de hoogte van de Eiffeltoren (in meters)?', acceptableAnswers: ['330', '324', '300'] },
      { id: '2', prompt: 'In welke stad staat het Vrijheidsbeeld?', acceptableAnswers: ['New York', 'NYC', 'New York City'] },
      { id: '3', prompt: 'Wat is de langste rivier van Afrika?', acceptableAnswers: ['Nijl', 'De Nijl'] },
      { id: '4', prompt: 'In welk land start de Nijl (bij het Victoriameer)?', acceptableAnswers: ['Oeganda', 'Uganda'] },
      { id: '5', prompt: 'Wat is de hoofdstad van Australië?', acceptableAnswers: ['Canberra'] },
      { id: '6', prompt: 'Wat is de munteenheid van Oeganda?', acceptableAnswers: ['Shilling', 'Oegandese Shilling', 'UGX'] }
    ]
  },
  game5: {
    words: ["OPMAKEN", "FORMULE", "PHISHING", "MUISKNOP", "OPSLAAN", "PDF", "WACHTWOORD", "HOOFDLETTER", "DOWNLOADEN", "UPLOADEN", "WIFI", "ONEDRIVE", "CLOUD", "CANVA", "BEANTWOORDEN", "DOORSTUREN", "CC", "GOOGLE", "OPZOEKEN", "AFBEELDING"],
    gridSize: 16
  },
  game6: {
    showExample: false
  }
};
