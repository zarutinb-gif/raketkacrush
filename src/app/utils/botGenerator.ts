export const playerNames = [
  'Lionel Messi',
  'Cristiano Ronaldo',
  'Neymar Jr',
  'Kylian Mbappé',
  'Mohamed Salah',
  'Kevin De Bruyne',
  'Robert Lewandowski',
  'Luka Modrić',
  'Karim Benzema',
  'Erling Haaland',
  'Harry Kane',
  'Vinicius Jr',
  'Jude Bellingham',
  'Bukayo Saka',
  'Phil Foden',
  'Bernardo Silva',
  'Rodri',
  'Trent Alexander-Arnold',
  'Virgil van Dijk',
  'Alisson Becker',
  'Ederson',
  'Marc-André ter Stegen',
  'Jan Oblak',
  'Thibaut Courtois',
  'Casemiro',
  'Bruno Fernandes',
  'Marcus Rashford',
  'Jack Grealish',
  'Raheem Sterling',
  'Son Heung-min',
  'Alexis Mac Allister',
  'Declan Rice',
  'Martin Ødegaard',
  'Gabriel Jesus',
  'Leroy Sané',
  'Serge Gnabry',
  'Thomas Müller',
  'Joshua Kimmich',
  'Manuel Neuer',
  'Florian Wirtz',
  'Jamal Musiala',
  'Victor Osimhen',
  'Rafael Leão',
  'Theo Hernández',
  'Federico Chiesa',
  'Nicolò Barella',
  'Lautaro Martínez',
  'João Félix',
  'Rúben Dias',
  'João Cancelo',
  'Pedri',
  'Gavi',
  'Antoine Griezmann',
  'Ousmane Dembélé',
  'Jules Koundé',
  'Aurélien Tchouaméni',
  'Eduardo Camavinga',
  'Christopher Nkunku',
  'Kingsley Coman',
  'Randal Kolo Muani',
  'Ivan Perišić',
  'Mateo Kovačić',
  'Dominik Szoboszlai',
  'Andrew Robertson',
  'Diogo Jota',
  'Darwin Núñez',
  'Cody Gakpo',
  'Luis Díaz',
  'Fabinho',
  'Jordan Henderson',
  'Thiago Alcântara',
  'Mason Mount',
  'Reece James',
  'Enzo Fernández',
  'Moisés Caicedo',
  'Cole Palmer',
  'Conor Gallagher',
  'Kai Havertz',
  'Christopher Nkunku',
  'Heung-Min Son',
  'James Maddison',
  'Dejan Kulusevski',
  'Richarlison',
  'Yves Bissouma',
  'Gabriel Martinelli',
  'William Saliba',
  'Ben White',
  'Thomas Partey',
  'Oleksandr Zinchenko',
  'Ivan Toney',
  'Douglas Luiz',
  'Ollie Watkins',
  'Emiliano Martínez',
  'Amadou Onana',
  'James Tarkowski',
  'Alexander Isak',
  'Sven Botman',
  'Callum Wilson',
  'Miguel Almirón'
];

export function generateBotBet() {
  const name = playerNames[Math.floor(Math.random() * playerNames.length)];
  const avatarId = Math.floor(Math.random() * 70) + 1;
  const avatar = `https://i.pravatar.cc/150?img=${avatarId}`;

  // Weighted random bet amount
  const random = Math.random();
  let amount;

  if (random < 0.5) {
    // 50% - small bets (5-50)
    amount = 5 + Math.random() * 45;
  } else if (random < 0.8) {
    // 30% - medium bets (50-200)
    amount = 50 + Math.random() * 150;
  } else if (random < 0.95) {
    // 15% - large bets (200-500)
    amount = 200 + Math.random() * 300;
  } else {
    // 5% - whale bets (500-2000)
    amount = 500 + Math.random() * 1500;
  }

  return {
    name,
    avatar,
    amount: Math.round(amount * 100) / 100
  };
}
