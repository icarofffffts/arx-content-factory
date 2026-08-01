import { useState } from 'react'

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  draft: { label: 'Rascunho', color: 'text-yellow-400 bg-yellow-400/10' },
  scheduled: { label: 'Agendado', color: 'text-blue-400 bg-blue-400/10' },
  paused: { label: 'Pausado', color: 'text-orange-400 bg-orange-400/10' },
  posted_linkedin: { label: 'LinkedIn OK', color: 'text-blue-300 bg-blue-300/10' },
  posted_instagram: { label: 'Instagram OK', color: 'text-pink-400 bg-pink-400/10' },
  published: { label: 'Publicado', color: 'text-green-400 bg-green-400/10' },
  rendering: { label: 'Renderizando', color: 'text-purple-400 bg-purple-400/10' },
}

export default function PostCard({ post, onPublish, onPause, onDelete, onReschedule, onGenerateVideo }: {
  post: any
  onPublish: (id: string) => void
  onPause: (id: string) => void
  onDelete: (id: string) => void
  onReschedule: (id: string) => void
  onGenerateVideo?: (id: string) => void
}) {
  const st = STATUS_MAP[post.status] || { label: post.status, color: 'text-gray-400 bg-gray-400/10' }
  const isScheduled = post.status === 'scheduled' || post.status === 'paused'
  const scheduledDate = post.scheduled_at ? new Date(post.scheduled_at).toLocaleString('pt-BR') : '—'
  const videoProcessing = post.video_status === 'processing'
  const hasVideo = !!post.video_url

  return (
    <div className="card-glass p-5 card-hover group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm leading-snug line-clamp-2">{post.topic}</h3>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ml-3 whitespace-nowrap ${st.color}`}>
          {st.label}
        </span>
      </div>

      <div className="w-full h-1.5 bg-surface-600 rounded-full overflow-hidden mb-3">
        <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${post.progress_percentage}%` }} />
      </div>

      <div className="text-xs text-gray-500 mb-4">
        {isScheduled ? `📅 ${scheduledDate}` : `🕐 ${new Date(post.created_at).toLocaleString('pt-BR')}`}
      </div>

      <div className="flex flex-wrap gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
        {isScheduled && (
          <button onClick={() => onPublish(post.id)}
            className="text-xs bg-accent hover:bg-accent-light text-white px-3 py-1.5 rounded-lg transition-all hover:shadow-lg hover:shadow-accent/20">
            Publicar Agora
          </button>
        )}
        {(post.status === 'scheduled' || post.status === 'paused') && (
          <>
            <button onClick={() => onPause(post.id)}
              className="text-xs btn-ghost px-3 py-1.5">
              {post.status === 'paused' ? '▶ Retomar' : '⏸ Pausar'}
            </button>
            <button onClick={() => onReschedule(post.id)}
              className="text-xs btn-ghost px-3 py-1.5">
              📅 Reagendar
            </button>
          </>
        )}
        {onGenerateVideo && (
          <button
            onClick={() => onGenerateVideo(post.id)}
            disabled={videoProcessing}
            title={hasVideo ? 'Vídeo gerado' : 'Gerar Reels/Shorts do conteúdo'}
            className={`text-xs px-3 py-1.5 rounded-lg transition-all disabled:opacity-40 ${
              hasVideo
                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                : 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 border border-pink-500/20 hover:border-pink-400/40'
            }`}
          >
            {videoProcessing ? '⏳ Gerando...' : hasVideo ? '🎬 Ver vídeo' : '🎬 Gerar Vídeo'}
          </button>
        )}
        <button onClick={() => onDelete(post.id)}
          className="text-xs text-red-400/60 hover:text-red-300 px-3 py-1.5 transition-colors ml-auto">
          🗑
        </button>
      </div>
    </div>
  )
}
