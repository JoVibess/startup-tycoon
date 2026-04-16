import { create } from 'zustand'
import { initialUpgrades } from '../data/upgrades'
import { getUpgradeCost } from '../utils/getUpgradeCost'
import {
  deleteGameSave,
  loadGameSave,
  saveGameState,
} from '../services/gameSave'

function createInitialState() {
  return {
    money: 0,
    clickValue: 1,
    incomePerSecond: 0,
    upgrades: initialUpgrades.map((upgrade) => ({ ...upgrade })),
    totalClicks: 0,
    totalEarned: 0,
  }
}

export const useGameStore = create((set, get) => ({
  ...loadGameSave(createInitialState()),

  click() {
    set((state) => ({
      money: state.money + state.clickValue,
      totalClicks: state.totalClicks + 1,
      totalEarned: state.totalEarned + state.clickValue,
    }))
  },

  tick() {
    set((state) => ({
      money: state.money + state.incomePerSecond,
      totalEarned: state.totalEarned + state.incomePerSecond,
    }))
  },

  buyUpgrade(upgradeId) {
    const state = get()
    const upgradeToBuy = state.upgrades.find(
      (upgrade) => upgrade.id === upgradeId,
    )

    if (!upgradeToBuy) {
      return
    }

    const currentCost = getUpgradeCost(
      upgradeToBuy.baseCost,
      upgradeToBuy.count,
    )

    if (state.money < currentCost) {
      return
    }

    set({
      money: state.money - currentCost,
      incomePerSecond:
        state.incomePerSecond + upgradeToBuy.incomePerSecondGain,
      upgrades: state.upgrades.map((upgrade) =>
        upgrade.id === upgradeId
          ? { ...upgrade, count: upgrade.count + 1 }
          : upgrade,
      ),
    })

    saveGameState(get())
  },

  resetGame() {
    set(createInitialState())
    saveGameState(get())
  },

  resetSave() {
    set(createInitialState())
    deleteGameSave()
  },
}))
