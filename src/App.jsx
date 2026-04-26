/**
 * title → story → guide → game → (ending/nextScene/gameClear)
 */
import { useEffect, useState } from 'react'
import './styles/App.css'

import { startingDeck } from './data/cards/startingDeck'
import { enemyList } from './data/enemies/enemyList'
import { storyTexts, trueEndTexts, retryTexts } from './data/story/storyTexts'

import { useTypewriter } from './hooks/useTypewriter'
import { useSpaceInput } from './hooks/useSpaceInput'
import { applyCardEffect } from './game/cardEffects'
import { createInitialBattleState, getPlayerMaxEnergy, getPlayerMaxHP } from './game/battleState'

import TitleScreen from './components/TitleScreen'
import StoryScreen from './components/StoryScreen'
import GuideScreen from './components/GuideScreen'
import DefeatChoiceScreen from './components/DefeatChoiceScreen'
import TextScreen from './components/TextScreen'
import BattleScreen from './components/BattleScreen'

function App() {
  // ====== 全局流程 ======
  const [screen, setScreen] = useState('title')

  // ====== 叙事/CG/结局选择======
  const [storyIndex, setStoryIndex] = useState(0)
  const [cgIndex, setCgIndex] = useState(0)
  const [defeatChoice, setDefeatChoice] = useState(0)

  // ====== 战斗数据（敌人、牌堆、手牌、选中牌）======
  const [enemyIndex, setEnemyIndex] = useState(0)
  const [drawPile, setDrawPile] = useState([])
  const [hand, setHand] = useState([])
  const [selectedCard, setSelectedCard] = useState(0)
  const currentEnemy = enemyList[enemyIndex]

  // battle: 战斗主状态（玩家/敌人 hp/armor/energy + enemy intent 等）
  const [battle, setBattle] = useState(() =>
    createInitialBattleState({
      enemy: {
        ...currentEnemy,
        intent: getRandomIntent(currentEnemy)
      }
    })
  )

  const currentStoryText = storyTexts[storyIndex]
  const { displayText, skipText, resetTypewriter } = useTypewriter({
    text: currentStoryText,
    active: screen === 'story',
    speed: 50
  })

  // 从 pile 随机抽取若干张加入手牌
  function drawCardsFromPile(pile, currentHand, count) {
    const drawnCards = []

    for (let i = 0; i < count; i++) {
      if (pile.length === 0) break

      const randomIndex = Math.floor(Math.random() * pile.length)
      const drawnCard = pile[randomIndex]

      drawnCards.push(drawnCard)
    }


    return {
      nextPile: pile,
      nextHand: [...currentHand, ...drawnCards]
    }
  }

  //敌人意图随机选择
  function getRandomIntent(enemy) {
    const intents = enemy.intents ?? [enemy.intent]
    const randomIndex = Math.floor(Math.random() * intents.length)

    return intents[randomIndex]
  }

  //重置战斗：初始化敌人、抽取起手牌，并把 UI 选择状态清零。
  function resetBattle(nextEnemyIndex = enemyIndex) {
    const nextEnemy = enemyList[nextEnemyIndex]

    const initialPile = startingDeck.slice(0, 9)
    const { nextPile, nextHand } = drawCardsFromPile(initialPile, [], 3)

    setBattle(
      createInitialBattleState({
        enemy: {
          ...nextEnemy,
          intent: getRandomIntent(nextEnemy)
        }
      })
    )

    setDrawPile(nextPile)
    setHand(nextHand)
    setSelectedCard(0)
    setDefeatChoice(0)
    setCgIndex(0)
  }

  //回到标题
  function resetToTitle() {
    resetBattle(0)
    setEnemyIndex(0)
    setStoryIndex(0)
    resetTypewriter()
    setScreen('title')
  }

  //单击切换手牌
  function switchCard() {
    if (hand.length === 0) return

    setSelectedCard((prev) => (prev + 1) % hand.length)
  }

  //双击打出手牌，能量不足得忽略
  function playSelectedCard() {
    if (hand.length === 0) return

    const card = hand[selectedCard]

    if (battle.player.energy < card.cost) return

    setBattle((prev) => applyCardEffect({ battle: prev, card }))

    setHand((prev) => {
      const nextHand = prev.filter((_, index) => index !== selectedCard)

      if (nextHand.length === 0) {
        setSelectedCard(0)
      } else if (selectedCard >= nextHand.length) {
        setSelectedCard(nextHand.length - 1)
      }

      return nextHand
    })
  }

  //长按结束回合，敌人按意图结算，刷新敌人意图，抽牌并重置选中牌。
  function endPlayerTurn() {
    setBattle((prev) => {
      let nextPlayer = {
        ...prev.player,
        armor: 0,
        maxEnergy: getPlayerMaxEnergy(),
        energy: getPlayerMaxEnergy()
      }

      let nextEnemy = {
        ...prev.enemy
      }

      //护甲抵扣伤害
      if (prev.enemy.intent.type?.includes('attack')) {
        const realDamage = Math.max(
          0,
          prev.enemy.intent.value - prev.player.armor
        )

        nextPlayer.hp = Math.max(0, prev.player.hp - realDamage)
      }

      if (prev.enemy.intent.type === 'defense') {
        nextEnemy.armor += prev.enemy.intent.value
      }

      // 敌人下一回合意图在回合结束时决定。
      nextEnemy.intent = getRandomIntent(nextEnemy)

      return {
        ...prev,
        player: nextPlayer,
        enemy: nextEnemy
      }
    })

    setHand((prevHand) => {
      const { nextHand } = drawCardsFromPile(drawPile, prevHand, 2)
      return nextHand
    })

    setSelectedCard(0)
  }

  //击败第一位敌人后进入下一位敌人，全部打完进入结局
  function goToNextEnemy() {
    const nextEnemyIndex = enemyIndex + 1

    if (nextEnemyIndex >= enemyList.length) {
      setScreen('nextScene')
      return
    }
    if (screen === 'gameClear') {
      resetToTitle()
    }

    setEnemyIndex(nextEnemyIndex)
    resetBattle(nextEnemyIndex)
    setScreen('game')
  }

  //剧情推进
  function handleSpaceDown() {
    if (screen === 'title') {
      setScreen('story')
      return
    }

    if (screen === 'story') {
      if (displayText !== currentStoryText) {
        skipText()
        return
      }

      if (storyIndex < storyTexts.length - 1) {
        setStoryIndex((prev) => prev + 1)
      } else {
        setScreen('guide')
      }
      return
    }

    if (screen === 'guide') {
      setScreen('game')
      return
    }

    if (screen === 'ending') {
      setScreen('defeatChoice')
      return
    }

    if (screen === 'trueEndCg') {
      if (cgIndex < trueEndTexts.length - 1) {
        setCgIndex((prev) => prev + 1)
      } else {
        resetToTitle()
      }
      return
    }

    if (screen === 'retryCg') {
      if (cgIndex < retryTexts.length - 1) {
        setCgIndex((prev) => prev + 1)
      } else {
        resetBattle(enemyIndex)
        setScreen('game')
      }
      return
    }

    if (screen === 'nextScene') {
      goToNextEnemy()
    }

    if (screen === 'gameClear') {
      resetToTitle()
      return
    }
  }

  //单击语义
  function handleSingleClick() {
    if (screen === 'defeatChoice') {
      setDefeatChoice((prev) => (prev === 0 ? 1 : 0))
      return
    }

    if (screen === 'game') {
      switchCard()
    }
  }

  //双击语义
  function handleDoubleClick() {
    if (screen === 'defeatChoice') {
      setCgIndex(0)
      setScreen(defeatChoice === 0 ? 'trueEndCg' : 'retryCg')
      return
    }

    if (screen === 'game') {
      playSelectedCard()
    }
  }

  //长按语义
  function handleLongPress() {
    if (screen === 'game') {
      endPlayerTurn()
    }
  }

  // 统一把 Space 输入映射为 4 类动作（按 screen 再做二次分发）。
  useSpaceInput({
    screen,
    onSpaceDown: handleSpaceDown,
    onSingleClick: handleSingleClick,
    onDoubleClick: handleDoubleClick,
    onLongPress: handleLongPress
  })

  useEffect(() => {
    // 屏幕进入 guide后开战，初始化战斗并切到 game。
    if (screen === 'guide') {
      resetBattle(enemyIndex)
      setScreen('game')
      return
    }

    if (screen !== 'game') return

    // 胜负判定：玩家先死进入 ending；敌人死亡则进入 nextScene 或最终通关。
    if (battle.player.hp <= 0) {
      setScreen('ending')
      return
    }

    if (battle.enemy.hp <= 0) {
      if (battle.enemy.id === 'rain-shadow') {
        setScreen('gameClear')
      } else {
        setScreen('nextScene')
      }
    }
  }, [screen, battle.player.hp, battle.enemy.hp])

  // ====== 渲染：根据 screen 输出对应页面======
  if (screen === 'title') return <TitleScreen />

  if (screen === 'story') {
    return <StoryScreen displayText={displayText} />
  }

  if (screen === 'guide') return <GuideScreen />

  if (screen === 'ending') {
    return (
      <TextScreen
        title="Ending"
        text="The skies of bygone days looks down upon you, as overcast clouds are mirrored in your eyes. The cascading deluge drowns your final breath."
      />
    )
  }

  if (screen === 'defeatChoice') {
    return <DefeatChoiceScreen defeatChoice={defeatChoice} />
  }

  if (screen === 'trueEndCg') {
    return <TextScreen text={trueEndTexts[cgIndex]} />
  }

  if (screen === 'retryCg') {
    return <TextScreen text={retryTexts[cgIndex]} />
  }

  if (screen === 'nextScene') {
    return (
      <TextScreen
        title="Next Scene"
        text="The enemy is down. Rain and mist still cover the path ahead."
      />
    )
  }

  if (screen === 'gameClear') {
    return (
      <TextScreen
        title="End"
        text="The shadow in the rain has fallen. The overcast sky finally shows a glimmer of light, but the days that are gone cannot return."
        hint="press space to return title"
      />
    )
  }

  return (
    <BattleScreen
      battle={battle}
      cards={hand}
      selectedCard={selectedCard}
    />
  )
}

export default App
