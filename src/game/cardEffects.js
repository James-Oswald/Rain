/**
 * 卡牌结算：把一张牌的效果应用到 battle state 上，返回不可变更新后的新对象。
 * 当前实现只支持基于 `a_value`（伤害）与 `d_value`（护甲）的基础效果。
 */
export function applyCardEffect({ battle, card }) {
  if (battle.player.energy < card.cost) {
    return battle
  }

  let nextBattle = {
    ...battle,
    player: {
      ...battle.player,
      energy: battle.player.energy - card.cost
    }
  }
  nextBattle = dealDamageToEnemy({
    battle: nextBattle,
    damage: card.a_value ?? 0
  })
  nextBattle = gainPlayerArmor({
    battle: nextBattle,
    armor: card.d_value ?? 0
  })
  return nextBattle
}

function dealDamageToEnemy({ battle, damage }) {
  if (damage <= 0) return battle

  const blockedDamage = Math.min(battle.enemy.armor, damage)
  const remainingArmor = battle.enemy.armor - blockedDamage
  const remainingDamage = damage - blockedDamage

  return {
    ...battle,
    enemy: {
      ...battle.enemy,
      armor: remainingArmor,
      hp: Math.max(0, battle.enemy.hp - remainingDamage)
    }
  }
}

function gainPlayerArmor({ battle, armor }) {
  if (armor <= 0) return battle

  return {
    ...battle,
    player: {
      ...battle.player,
      armor: battle.player.armor + armor
    }
  }
}