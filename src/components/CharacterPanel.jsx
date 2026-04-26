function CharacterPanel({ character, side }) {
  const isEnemy = side === 'enemy'
  const toPublicUrl = (path) => {
    if (!path) return path
    return path.startsWith('/')
      ? `${import.meta.env.BASE_URL}${path.slice(1)}`
      : path
  }

  return (
    <div className={isEnemy ? 'enemy-side' : 'player-side'}>
      {isEnemy && (
        <div className="enemy-intent">
          <p>{character.intent.text}</p>
          <strong>
            {character.intent.type === 'defense'
              ? `Gain ${character.intent.value} Armor`
              : `Deal ${character.intent.value} Damage`}
          </strong>
        </div>
      )}

      {!isEnemy && (
        <div className="energy-display">
          Energy：{character.energy} / {character.maxEnergy}
        </div>
      )}

      {isEnemy && <div className="character-name">{character.name}</div>}

      <div className={isEnemy ? 'enemy-character' : 'player-character'}>
        <img
          src={toPublicUrl(isEnemy ? character.image : '/plcharacter.png')}
          alt="character"
          className="character-image"
        />
      </div>

      <div className="hp-bar">
        <div
          className="hp-fill"
          style={{ width: `${(character.hp / character.maxHp) * 100}%` }}
        />
        <span>
          {character.hp} / {character.maxHp}
        </span>
      </div>

      <p className="armor-text">Armor：{character.armor}</p>
    </div>
  )
}

export default CharacterPanel