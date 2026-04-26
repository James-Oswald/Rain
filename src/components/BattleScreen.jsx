import CharacterPanel from './CharacterPanel'
import HandArea from './HandArea'

function BattleScreen({ battle, cards, selectedCard }) {
  return (
    <div className="game-screen">
      <div className="battle-center">
        <CharacterPanel character={battle.player} side="player" />
        <CharacterPanel character={battle.enemy} side="enemy" />
      </div>

      <HandArea cards={cards} selectedCard={selectedCard} />
    </div>
  )
}

export default BattleScreen
