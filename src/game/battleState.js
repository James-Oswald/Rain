/**
 * 战斗状态初始化与基础数值配置，设定maxEnergy / maxHp，可以在未来增加属性上限。
 */
export function getPlayerMaxEnergy() {
  return 1
}
export function getPlayerMaxHP() {
  return 20
}
export function createInitialBattleState({ enemy }) {
  const maxEnergy = getPlayerMaxEnergy()
  const maxHp = getPlayerMaxHP()

  return {
    player: {
      name: '？？？',
      hp: maxHp,
      maxHp,
      armor: 0,
      energy: maxEnergy,
      maxEnergy
    },
    enemy: {
      ...enemy,
      hp: enemy.maxHp,
      armor: enemy.startingArmor ?? 0
    }
  }
}
