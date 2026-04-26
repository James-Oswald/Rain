import Card from './Card'

function HandArea({ cards, selectedCard }) {
  return (
    <div className="hand-area" style={{ '--card-count': cards.length }}>
      {cards.map((card, index) => (
        <Card
          key={card.id}
          card={card}
          selected={selectedCard === index}
        />
      ))}
    </div>
  )
}

export default HandArea
