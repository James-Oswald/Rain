function Card({ card, selected }) {
  const toPublicUrl = (path) => {
    if (!path) return path
    return path.startsWith('/')
      ? `${import.meta.env.BASE_URL}${path.slice(1)}`
      : path
  }

  return (
    <div className={`card ink ${selected ? 'selected' : ''}`}>
      <div className="card-cost">{card.cost}</div>
      <img
        src={toPublicUrl(card.image)}
        alt={card.name}
        className="card-image"
      />
      <h3>{card.name}</h3>
      <p>{card.desc}</p>
    </div>
  )
}

export default Card
