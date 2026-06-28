import { useEffect, useRef } from 'react'
import * as LucideIcons from 'lucide-react'
import { Sparkles, Swords } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext.jsx'
import LeagueBadge from '../../../components/LeagueBadge.jsx'
import { playSound } from '../../../utils/sounds.js'
import { rankColors, rankLabels } from '../../../utils/rankStyles.js'
import { getTier } from '../../../utils/leagues.js'

export default function FinishedState({ finalLeaderboard, onPlayAgain, onLeave }) {
  const { player, refreshPlayer } = useAuth()

  const myEntry = finalLeaderboard.find((p) => p.playerId === player?.id?.toString())
  const myRank  = myEntry ? finalLeaderboard.indexOf(myEntry) + 1 : 0
  const winner  = finalLeaderboard[0]

  const promoted         = myEntry?.promoted          ?? false
  const newTier          = myEntry?.newTier           ?? null
  const dailyBonus       = myEntry?.dailyBonusAwarded ?? false
  const dailyBonusAmt    = myEntry?.dailyBonusAmount  ?? 0
  const nearMiss         = !promoted && (myEntry?.nearMiss ?? false)
  const trophiesToNext   = myEntry?.trophiesToNextTier ?? 0
  const nextTierName     = myEntry?.nextTierName       ?? ''

  const soundPlayed = useRef(false)
  useEffect(() => {
    if (soundPlayed.current) return
    soundPlayed.current = true

    if (myRank === 1) playSound('victory')
    else              playSound('elimination')
    if (promoted)     playSound('promotion')

    const timer = setTimeout(() => refreshPlayer(), 600)
    return () => clearTimeout(timer)
  }, [myRank, promoted, refreshPlayer])

  const PromotionIcon = newTier
    ? (LucideIcons[getTier(myEntry?.trophies ?? 0).icon] ?? LucideIcons.Trophy)
    : null

  return (
    <div className="mx-auto max-w-xl">

      {/* Promotion banner */}
      {promoted && newTier && (
        <div className="animate-promotion-in mb-6 rounded-2xl border border-success/30 bg-success/8 p-5 text-center">
          {PromotionIcon && <PromotionIcon size={28} className="mx-auto mb-2 text-success" />}
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-success">Promotion!</p>
          <p className="mt-1 font-orbitron text-xl text-text">Promoted to {newTier}</p>
        </div>
      )}

      {/* Near-miss banner — only when not promoted */}
      {nearMiss && (
        <div className="animate-fade-in-up mb-6 rounded-2xl border border-pink-500/40 bg-pink-500/8 p-5 text-center shadow-[0_0_16px_rgba(255,61,129,0.15)]">
          <Swords size={24} className="mx-auto mb-2 text-pink-400" aria-hidden="true" />
          <p className="font-orbitron text-sm font-bold tracking-[-0.02em] text-text">So close!</p>
          <p className="mt-1 text-sm text-slate-400">
            Only{' '}
            <span className="font-data font-bold text-pink-400">{trophiesToNext}</span>
            {' '}trophies away from{' '}
            <span className="font-semibold text-text">{nextTierName}</span>
          </p>
          <button
            type="button"
            onClick={onPlayAgain}
            className="mt-4 min-h-10 w-full rounded-xl border border-pink-500/60 bg-pink-500/15 text-sm font-bold text-pink-400 transition hover:bg-pink-500/25 hover:-translate-y-0.5"
          >
            Play Again — go for it!
          </button>
        </div>
      )}

      {/* Winner */}
      {winner && (
        <div className="animate-fade-in-up mb-6 rounded-2xl border border-amber-400/25 bg-amber-400/8 p-6 text-center">
          <LucideIcons.Trophy size={32} className="mx-auto mb-2 text-amber-400" />
          <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Winner</p>
          <p className="mt-1 font-orbitron text-2xl text-text">{winner.name}</p>
          <p className="mt-1 font-data text-lg text-amber-400">{winner.score} pts</p>
        </div>
      )}

      {/* Your rank + trophy result */}
      {myRank > 0 && (
        <div className="animate-fade-in-up mb-6 rounded-2xl border border-pink-500/15 bg-panel/85 p-5 text-center delay-100">
          <p className="text-xs uppercase tracking-widest text-slate-400">Your rank</p>
          <p className="mt-1 font-orbitron text-4xl text-text">#{myRank}</p>
          <p className="mt-1 text-sm text-slate-400">
            {myRank === 1 ? 'You won!' : myRank <= 3 ? 'Great game!' : 'Better luck next time!'}
          </p>

          {myEntry?.trophies !== undefined && (
            <div className="mt-3 space-y-2">
              {/* Trophy delta row */}
              <div className="flex items-center justify-center gap-3">
                <LeagueBadge trophies={myEntry.trophies} showCount size="md" />
                {myEntry.trophyDelta !== undefined && (
                  <span className={`font-data text-sm font-bold ${myEntry.trophyDelta >= 0 ? 'text-lime-400' : 'text-danger'}`}>
                    {myEntry.trophyDelta >= 0 ? `+${myEntry.trophyDelta}` : myEntry.trophyDelta}
                  </span>
                )}
              </div>

              {/* Daily bonus line — visually distinct */}
              {dailyBonus && (
                <div className="flex items-center justify-center gap-2 rounded-xl border border-amber-400/25 bg-amber-400/8 px-4 py-2">
                  <Sparkles size={13} className="shrink-0 text-amber-400" aria-hidden="true" />
                  <span className="text-xs font-semibold text-amber-400">Daily Bonus</span>
                  <span className="font-data text-xs font-bold text-amber-400">
                    +{dailyBonusAmt}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Final leaderboard */}
      <div className="animate-fade-in-up mb-6 overflow-hidden rounded-2xl border border-pink-500/15 bg-panel/85 delay-150">
        <div className="border-b border-pink-500/10 px-5 py-3">
          <h2 className="font-orbitron text-[0.85rem] tracking-[-0.02em] text-text">Final standings</h2>
        </div>
        <ul className="divide-y divide-pink-500/8">
          {finalLeaderboard.map((p, i) => {
            const isMe = p.playerId === player?.id?.toString()
            return (
              <li key={p.playerId} className={`flex items-center gap-3 px-5 py-3 ${isMe ? 'bg-pink-500/8' : ''}`}>
                <span className={`w-6 text-lg ${rankColors[i] ?? 'text-slate-500'}`}>
                  {rankLabels[i] ?? `${i + 1}.`}
                </span>
                <span className="flex-1 text-sm text-text">
                  {p.name}{isMe ? ' (you)' : ''}
                </span>
                <span className="font-data text-sm text-text">{p.score}</span>
                <span className="text-xs text-slate-500">HP {p.hp}</span>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Actions */}
      <div className="animate-fade-in-up flex gap-3 delay-200">
        <button
          type="button"
          onClick={onPlayAgain}
          className="min-h-12 flex-1 rounded-2xl border border-pink-500/40 bg-pink-500 font-bold text-white transition hover:-translate-y-0.5 hover:bg-pink-400"
        >
          Play again
        </button>
        <button
          type="button"
          onClick={onLeave}
          className="min-h-12 rounded-2xl border border-pink-500/20 px-6 text-sm text-slate-400 transition hover:text-pink-400"
        >
          Dashboard
        </button>
      </div>
    </div>
  )
}
