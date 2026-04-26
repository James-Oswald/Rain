export const enemyList = [
  {
    id: 'restless-gaze',
    name: 'Restless Gaze',
    label: 'Enemy',
    image: '/glaze.png',
    maxHp: 10,
    startingArmor: 0,
    intents: [
      {
        type: 'attack',
        text: 'Attack',
        value: 5
      },
      {
        type: 'attack',
        text: 'Bite!',
        value: 8
      },
      {
        type: 'defense',
        text: 'Defend',
        value: 4
      }
    ]
  },
  {
    id: 'rain-shadow',
    name: 'Shadow In the Rain',
    label: 'Enemy',
    image: '/rainshadow.png',
    maxHp: 20,
    startingArmor: 4,
    intents: [
      {
        type: 'attack',
        text: 'Whistle',
        value: 6
      },
      {
        type: 'attack',
        text: 'Roar',
        value: 10
      },
      {
        type: 'defense',
        text: 'Rain Condense',
        value: 6
      }
    ]
  }
]
