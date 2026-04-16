export const GAME_SAVE_KEY = 'startup-tycoon-save'
export const GAME_SAVE_VERSION = 1

function isBrowserStorageAvailable() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function isNumber(value) {
  return typeof value === 'number' && Number.isFinite(value)
}

function isValidUpgrade(upgrade) {
  return (
    isObject(upgrade) &&
    typeof upgrade.id === 'string' &&
    typeof upgrade.name === 'string' &&
    isNumber(upgrade.baseCost) &&
    isNumber(upgrade.incomePerSecondGain) &&
    isNumber(upgrade.count)
  )
}

function isValidSavedState(state) {
  return (
    isObject(state) &&
    isNumber(state.money) &&
    isNumber(state.incomePerSecond) &&
    isNumber(state.clickValue) &&
    Array.isArray(state.upgrades) &&
    state.upgrades.every(isValidUpgrade) &&
    isNumber(state.totalClicks) &&
    isNumber(state.totalEarned)
  )
}

function mergeSavedStateWithDefault(defaultState, savedState) {
  const savedUpgradesById = new Map(
    savedState.upgrades.map((upgrade) => [upgrade.id, upgrade]),
  )

  return {
    ...defaultState,
    money: savedState.money,
    incomePerSecond: savedState.incomePerSecond,
    clickValue: savedState.clickValue,
    upgrades: defaultState.upgrades.map((upgrade) => {
      const savedUpgrade = savedUpgradesById.get(upgrade.id)

      if (!savedUpgrade) {
        return upgrade
      }

      return {
        ...upgrade,
        count: savedUpgrade.count,
      }
    }),
    totalClicks: savedState.totalClicks,
    totalEarned: savedState.totalEarned,
  }
}

export function createSerializableGameState(state) {
  return {
    money: state.money,
    incomePerSecond: state.incomePerSecond,
    clickValue: state.clickValue,
    upgrades: state.upgrades.map((upgrade) => ({ ...upgrade })),
    totalClicks: state.totalClicks,
    totalEarned: state.totalEarned,
  }
}

export function createGameSave(state) {
  return {
    version: GAME_SAVE_VERSION,
    savedAt: Date.now(),
    state: createSerializableGameState(state),
  }
}

export function saveGameState(state) {
  if (!isBrowserStorageAvailable()) {
    return null
  }

  const save = createGameSave(state)
  window.localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(save))

  return save
}

export function deleteGameSave() {
  if (!isBrowserStorageAvailable()) {
    return
  }

  window.localStorage.removeItem(GAME_SAVE_KEY)
}

export function getLastSavedAt() {
  if (!isBrowserStorageAvailable()) {
    return null
  }

  const rawSave = window.localStorage.getItem(GAME_SAVE_KEY)

  if (!rawSave) {
    return null
  }

  try {
    const save = JSON.parse(rawSave)

    if (
      !isObject(save) ||
      save.version !== GAME_SAVE_VERSION ||
      !isNumber(save.savedAt)
    ) {
      return null
    }

    return save.savedAt
  } catch {
    return null
  }
}

export function loadGameSave(defaultState) {
  if (!isBrowserStorageAvailable()) {
    return defaultState
  }

  const rawSave = window.localStorage.getItem(GAME_SAVE_KEY)

  if (!rawSave) {
    return defaultState
  }

  try {
    const save = JSON.parse(rawSave)

    if (
      !isObject(save) ||
      save.version !== GAME_SAVE_VERSION ||
      !isNumber(save.savedAt) ||
      !isValidSavedState(save.state)
    ) {
      return defaultState
    }

    return mergeSavedStateWithDefault(defaultState, save.state)
  } catch {
    return defaultState
  }
}
