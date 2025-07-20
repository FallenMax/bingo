'use client'

import confetti from 'canvas-confetti'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

// 国际化文案
const i18n = {
  zh: {
    title: '动物园宾戈卡',
    bingoCount: '宾戈',
    resetButton: '再来一次',
    resetConfirm: '确定要重新开始游戏吗？这将清除所有已找到的动物。',
    rules: {
      title: '游戏规则:',
      items: ['• 点击动物格子来"找到"它们', '• 当一行、一列或一条对角线的5个动物都被找到时，就完成了一个宾戈', '• 完成的宾戈线会显示为粗黄线', '• 未完成的宾戈线显示为细白虚线', '• 目标：完成所有12条宾戈线！', '🎉 完成宾戈时会有烟花庆祝！'],
    },
    animals: [
      { name: '企鹅', icon: '🐧' },
      { name: '大熊猫', icon: '🐼' },
      { name: '丹顶鹤', icon: '🦢' },
      { name: '犀牛', icon: '🦏' },
      { name: '商店', icon: '🏪' },
      { name: '河马', icon: '🦛' },
      { name: '清洁员', icon: '🧹' },
      { name: '长颈鹿', icon: '🦒' },
      { name: '孔雀', icon: '🦚' },
      { name: '鹿', icon: '🦌' },
      { name: '夜行性动物', icon: '🦉' },
      { name: '火烈鸟', icon: '🦩' },
      { name: '门票', icon: '🎫' },
      { name: '大象', icon: '🐘' },
      { name: '斑马', icon: '🦓' },
      { name: '猴子', icon: '🐒' },
      { name: '钟表', icon: '🕐' },
      { name: '大猩猩', icon: '🦍' },
      { name: '鳄鱼', icon: '🐊' },
      { name: '广场', icon: '🏛️' },
      { name: '狮子', icon: '🦁' },
      { name: '袋鼠', icon: '🦘' },
      { name: '卫生间', icon: '🚻' },
      { name: '变色龙', icon: '🦎' },
      { name: '售货亭', icon: '🏪' },
    ],
  },
  en: {
    title: 'Zoo Bingo Card',
    bingoCount: 'Bingo',
    resetButton: 'Play Again',
    resetConfirm: 'Are you sure you want to restart the game? This will clear all found animals.',
    rules: {
      title: 'Game Rules:',
      items: [
        '• Click on animal squares to "find" them',
        '• Complete a bingo by finding all 5 animals in a row, column, or diagonal',
        '• Completed bingo lines are shown as thick yellow lines',
        '• Incomplete bingo lines are shown as thin dashed white lines',
        '• Goal: Complete all 12 bingo lines!',
        '🎉 Fireworks celebrate when you complete a bingo!',
      ],
    },
    animals: [
      { name: 'Penguin', icon: '🐧' },
      { name: 'Panda', icon: '🐼' },
      { name: 'Swan', icon: '🦢' },
      { name: 'Rhino', icon: '🦏' },
      { name: 'Shop', icon: '🏪' },
      { name: 'Hippo', icon: '🦛' },
      { name: 'Cleaner', icon: '🧹' },
      { name: 'Giraffe', icon: '🦒' },
      { name: 'Peacock', icon: '🦚' },
      { name: 'Deer', icon: '🦌' },
      { name: 'Owl', icon: '🦉' },
      { name: 'Flamingo', icon: '🦩' },
      { name: 'Ticket', icon: '🎫' },
      { name: 'Elephant', icon: '🐘' },
      { name: 'Zebra', icon: '🦓' },
      { name: 'Monkey', icon: '🐒' },
      { name: 'Clock', icon: '🕐' },
      { name: 'Gorilla', icon: '🦍' },
      { name: 'Crocodile', icon: '🐊' },
      { name: 'Plaza', icon: '🏛️' },
      { name: 'Lion', icon: '🦁' },
      { name: 'Kangaroo', icon: '🦘' },
      { name: 'Restroom', icon: '🚻' },
      { name: 'Chameleon', icon: '🦎' },
      { name: 'Kiosk', icon: '🏪' },
    ],
  },
}

// 宾戈线定义 (行、列、对角线)
const bingoLines = [
  // 行
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  // 列
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  // 对角线
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
]

// 响应式网格配置
const GRID_CONFIG = {
  // 桌面端配置
  desktop: {
    cellSize: 96,
    gap: 8,
    padding: 32,
    iconSize: 'text-3xl',
    textSize: 'text-xs',
    overlayText: 'text-sm',
  },
  // 移动端配置
  mobile: {
    cellSize: 64,
    gap: 6,
    padding: 16,
    iconSize: 'text-xl',
    textSize: 'text-[10px]',
    overlayText: 'text-xs',
  },
}

// 庆祝烟花效果
const celebrateBingo = () => {
  // 创建多种烟花效果
  const duration = 3000
  const animationEnd = Date.now() + duration

  const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min
  }

  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500']

  // 第一波烟花
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.7 },
    colors: colors,
  })

  // 连续的烟花效果
  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      clearInterval(interval)
      return
    }

    const particleCount = 50 * (timeLeft / duration)

    confetti({
      particleCount,
      spread: randomInRange(50, 100),
      origin: {
        x: randomInRange(0.1, 0.9),
        y: randomInRange(0.6, 0.8),
      },
      colors: colors,
    })
  }, 250)

  // 额外的彩带效果
  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 160,
      origin: { y: 0.6 },
      shapes: ['star'],
      colors: colors,
    })
  }, 1000)
}

export default function BingoCard() {
  const [openedCells, setOpenedCells] = useState<boolean[]>(new Array(25).fill(false))
  const [completedLines, setCompletedLines] = useState<number[]>([])
  const [newlyCompletedLines, setNewlyCompletedLines] = useState<number[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [language, setLanguage] = useState<'zh' | 'en'>('en')

  // 检测语言
  useEffect(() => {
    const detectLanguage = () => {
      const browserLang = navigator.language || navigator.languages?.[0] || 'en'
      // 检查是否为简体中文
      const isZh = browserLang.toLowerCase().includes('zh') && (browserLang.toLowerCase().includes('cn') || browserLang.toLowerCase().includes('hans') || browserLang === 'zh')
      setLanguage(isZh ? 'zh' : 'en')
    }

    detectLanguage()
  }, [])

  // 检测移动端设备
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 检查宾戈线
  useEffect(() => {
    const newCompletedLines: number[] = []
    bingoLines.forEach((line, index) => {
      if (line.every((cellIndex) => openedCells[cellIndex])) {
        newCompletedLines.push(index)
      }
    })

    // 检测新完成的宾戈线
    const newlyCompleted = newCompletedLines.filter((line) => !completedLines.includes(line))

    if (newlyCompleted.length > 0) {
      setNewlyCompletedLines(newlyCompleted)
      // 触发庆祝效果
      setTimeout(() => celebrateBingo(), 100)

      // 重置新完成状态
      setTimeout(() => setNewlyCompletedLines([]), 2000)
    }

    setCompletedLines(newCompletedLines)
  }, [openedCells])

  const toggleCell = (index: number) => {
    setOpenedCells((prev) => {
      const newState = [...prev]
      newState[index] = !newState[index]
      return newState
    })
  }

  // 重置游戏
  const resetGame = () => {
    const confirmed = window.confirm(t.resetConfirm)
    if (confirmed) {
      setOpenedCells(new Array(25).fill(false))
      setCompletedLines([])
      setNewlyCompletedLines([])
    }
  }

  // 获取当前配置和文案
  const config = isMobile ? GRID_CONFIG.mobile : GRID_CONFIG.desktop
  const t = i18n[language]
  const animals = t.animals

  // 计算网格线位置
  const calculateLinePosition = (startCell: number, endCell: number) => {
    const { cellSize, gap, padding } = config

    const startRow = Math.floor(startCell / 5)
    const startCol = startCell % 5
    const endRow = Math.floor(endCell / 5)
    const endCol = endCell % 5

    // 计算每个卡片中心点的坐标
    const cellCenterX = cellSize / 2
    const cellCenterY = cellSize / 2

    const startX = padding + startCol * (cellSize + gap) + cellCenterX
    const startY = padding + startRow * (cellSize + gap) + cellCenterY
    const endX = padding + endCol * (cellSize + gap) + cellCenterX
    const endY = padding + endRow * (cellSize + gap) + cellCenterY

    const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2))
    const angle = (Math.atan2(endY - startY, endX - startX) * 180) / Math.PI

    return { startX, startY, length, angle }
  }

  // 计算总网格宽度
  const totalGridWidth = config.cellSize * 5 + config.gap * 4 + config.padding * 2

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* 标题和宾戈计数 - 响应式布局 */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 md:mb-8">
          <div className="bg-red-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg shadow-lg">
            <h1 className="text-xl md:text-2xl font-bold">{t.title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <motion.div
              className="bg-yellow-400 text-black px-3 md:px-4 py-2 rounded-lg shadow-lg font-bold text-lg md:text-xl"
              animate={
                newlyCompletedLines.length > 0
                  ? {
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0],
                      backgroundColor: ['#fbbf24', '#ef4444', '#10b981', '#fbbf24'],
                    }
                  : {}
              }
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              {t.bingoCount}: {completedLines.length}
            </motion.div>

            <button onClick={resetGame} className="bg-gray-500 hover:bg-gray-600 text-white px-3 md:px-4 py-2 rounded-lg shadow-lg font-bold text-sm md:text-base transition-colors duration-200">
              {t.resetButton}
            </button>
          </div>
        </div>

        {/* 宾戈卡 - 水平居中，响应式 */}
        <div className="flex justify-center">
          <div
            className="relative bg-blue-300 rounded-xl shadow-2xl"
            style={{
              width: totalGridWidth,
              padding: config.padding,
            }}
          >
            {/* 宾戈线 */}
            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
              {bingoLines.map((line, index) => {
                const isCompleted = completedLines.includes(index)
                const isNewlyCompleted = newlyCompletedLines.includes(index)
                const { startX, startY, length, angle } = calculateLinePosition(line[0], line[4])

                return (
                  <motion.div
                    key={index}
                    className={`absolute origin-left transition-all duration-300 ${
                      isCompleted ? `${isMobile ? 'border-t-2' : 'border-t-4'} border-yellow-400 drop-shadow-lg` : `${isMobile ? 'border-t-1' : 'border-t-2'} border-white border-dashed opacity-50`
                    }`}
                    style={{
                      left: `${startX}px`,
                      top: `${startY}px`,
                      width: `${length}px`,
                    }}
                    // 新完成的宾戈线脉冲效果 - 保持正确的旋转角度
                    initial={{ rotate: angle }} // 初始状态设置旋转角度，避免启动动画
                    animate={
                      isNewlyCompleted
                        ? {
                            scale: isMobile ? [1, 1.1, 1, 1.05, 1] : [1, 1.2, 1, 1.1, 1],
                            rotate: angle,
                            opacity: [0.8, 1, 0.9, 1, 0.95],
                            filter: [
                              'drop-shadow(0 0 0px #fbbf24)',
                              `drop-shadow(0 0 ${isMobile ? '4px' : '8px'} #fbbf24)`,
                              `drop-shadow(0 0 ${isMobile ? '2px' : '4px'} #fbbf24)`,
                              `drop-shadow(0 0 ${isMobile ? '3px' : '6px'} #fbbf24)`,
                              `drop-shadow(0 0 ${isMobile ? '1px' : '2px'} #fbbf24)`,
                            ],
                          }
                        : {
                            filter: isCompleted ? `drop-shadow(0 0 ${isMobile ? '1px' : '2px'} #fbbf24)` : undefined,
                          }
                    }
                    transition={{
                      duration: isNewlyCompleted ? 2 : 0.3,
                      ease: 'easeInOut',
                      repeat: isNewlyCompleted ? 2 : 0,
                    }}
                  />
                )
              })}
            </div>

            {/* 动物格子网格 */}
            <div
              className="grid grid-cols-5 relative z-20"
              style={{
                gap: config.gap,
              }}
            >
              {animals.map((animal, index) => {
                // 检查这个卡片是否在新完成的宾戈线上
                const isInNewBingo = newlyCompletedLines.some((lineIndex) => bingoLines[lineIndex].includes(index))

                return (
                  <motion.div
                    key={index}
                    className="bg-yellow-400 border-4 border-yellow-500 rounded-lg cursor-pointer overflow-hidden shadow-lg relative"
                    style={{
                      width: config.cellSize,
                      height: config.cellSize,
                      touchAction: 'manipulation',
                    }}
                    onClick={() => toggleCell(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    // 新宾戈线上的卡片闪烁效果
                    animate={
                      isInNewBingo && openedCells[index]
                        ? {
                            scale: [1, 1.1, 1, 1.05, 1],
                            borderColor: ['#eab308', '#ef4444', '#10b981', '#3b82f6', '#eab308'],
                            boxShadow: ['0 10px 15px -3px rgb(0 0 0 / 0.1)', '0 0 20px rgb(239 68 68 / 0.5)', '0 0 20px rgb(16 185 129 / 0.5)', '0 0 20px rgb(59 130 246 / 0.5)', '0 10px 15px -3px rgb(0 0 0 / 0.1)'],
                          }
                        : {
                            scale: 1,
                            borderColor: '#eab308',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                          }
                    }
                    transition={{ duration: isInNewBingo && openedCells[index] ? 1.5 : 0.3, ease: 'easeInOut' }}
                  >
                    {/* 动物内容 */}
                    <div className={`flex flex-col items-center justify-center h-full ${isMobile ? 'p-1' : 'p-2'}`}>
                      <div className={`${config.iconSize} mb-1`}>{animal.icon}</div>
                      <div className={`${config.textSize} font-bold text-center leading-tight text-gray-800`}>{animal.name}</div>
                    </div>

                    {/* 红色蒙层 */}
                    <AnimatePresence>
                      {!openedCells[index] && (
                        <motion.div
                          className="absolute inset-0 bg-red-500 bg-opacity-90 flex items-center justify-center"
                          initial={{ y: 0 }}
                          exit={{
                            y: -config.cellSize,
                            transition: {
                              duration: 0.5,
                              ease: 'easeInOut',
                            },
                          }}
                        >
                          <div className={`text-white ${config.overlayText} font-bold text-center px-1`}>{animal.name}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* 打开状态的光效 */}
                    {openedCells[index] && <motion.div className="absolute inset-0 bg-gradient-to-t from-transparent to-white opacity-30" initial={{ opacity: 0 }} animate={{ opacity: [0, 0.6, 0] }} transition={{ duration: 0.8 }} />}
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        {/* 游戏说明 - 响应式 */}
        <div className="mt-6 md:mt-8 bg-white bg-opacity-90 p-4 md:p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
          <h3 className="font-bold text-base md:text-lg mb-2 md:mb-3">{t.rules.title}</h3>
          <ul className="text-xs md:text-sm space-y-1 md:space-y-2">
            {t.rules.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
