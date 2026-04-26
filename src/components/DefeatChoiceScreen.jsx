function DefeatChoiceScreen({ defeatChoice }) {
  return (
    <div className="ending-screen">
      <h1>It's...really over?</h1>

      <div className="choice-box">
        <p className={defeatChoice === 0 ? 'choice selected-choice' : 'choice'}>
          Yes.
        </p>

        <p className={defeatChoice === 1 ? 'choice selected-choice' : 'choice'}>
          No… I want to give it another shot… to change how this ends.
        </p>
      </div>

      <p className="story-hint">Click Space：Swap / Double Space：Select</p>
    </div>
  )
}

export default DefeatChoiceScreen
