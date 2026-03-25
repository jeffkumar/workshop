import { useState } from 'react'
import { Update, supabase } from '../lib/supabase'
import { useAuth } from '../context/useAuth'
import { UpdateForm } from './UpdateForm'

type UpdateCardProps = {
  update: Update
  onDeleted: () => void
  onUpdated: () => void
}

export function UpdateCard({ update, onDeleted, onUpdated }: UpdateCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLiking, setIsLiking] = useState(false)
  const { user } = useAuth()

  const isOwner = user?.id === update.user_id
  const authorName = update.profiles?.full_name || update.profiles?.username || 'Unknown'
  const formattedDate = new Date(update.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

  const likes = update.likes ?? []
  const likeCount = likes.length
  const isLiked = user ? likes.some((like) => like.user_id === user.id) : false

  const handleLike = async () => {
    if (!user || isLiking) return

    setIsLiking(true)
    if (isLiked) {
      await supabase
        .from('likes')
        .delete()
        .eq('update_id', update.id)
        .eq('user_id', user.id)
    } else {
      await supabase
        .from('likes')
        .insert({ update_id: update.id, user_id: user.id })
    }
    onUpdated()
    setIsLiking(false)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this update?')) return

    setIsDeleting(true)
    const { error } = await supabase
      .from('updates')
      .delete()
      .eq('id', update.id)

    if (!error) {
      onDeleted()
    }
    setIsDeleting(false)
  }

  if (isEditing) {
    return (
      <div 
        className="p-4 rounded-lg border"
        style={{ backgroundColor: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}
      >
        <UpdateForm
          initialContent={update.content}
          updateId={update.id}
          onSuccess={() => {
            setIsEditing(false)
            onUpdated()
          }}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    )
  }

  return (
    <div 
      className="p-4 rounded-lg border"
      style={{ backgroundColor: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium" style={{ color: 'var(--color-text)' }}>
              {authorName}
            </span>
            <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {formattedDate}
            </span>
            {update.updated_at !== update.created_at && (
              <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                (edited)
              </span>
            )}
          </div>
          <p className="whitespace-pre-wrap" style={{ color: 'var(--color-text)' }}>
            {update.content}
          </p>
          <div className="mt-3">
            <button
              onClick={handleLike}
              disabled={!user || isLiking}
              className={`like-button${isLiked ? ' liked' : ''}`}
              aria-label={isLiked ? 'Unlike this update' : 'Like this update'}
            >
              <span aria-hidden="true">{isLiked ? '♥' : '♡'}</span>
              <span data-testid="like-count">{likeCount}</span>
            </button>
          </div>
        </div>

        {isOwner && (
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setIsEditing(true)}
              className="px-2 py-1 rounded text-sm transition-colors"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-2 py-1 rounded text-sm transition-colors disabled:opacity-50"
              style={{ color: 'var(--color-error)' }}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
