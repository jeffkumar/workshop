import { useState, FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

type UpdateFormProps = {
  onSuccess: () => void
  initialContent?: string
  updateId?: string
  onCancel?: () => void
}

export function UpdateForm({ onSuccess, initialContent = '', updateId, onCancel }: UpdateFormProps) {
  const [content, setContent] = useState(initialContent)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()

  const isEditing = !!updateId

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !user) return

    setLoading(true)
    setError('')

    try {
      if (isEditing) {
        const { error } = await supabase
          .from('updates')
          .update({ content: content.trim(), updated_at: new Date().toISOString() })
          .eq('id', updateId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('updates')
          .insert({ content: content.trim(), user_id: user.id })

        if (error) throw error
      }

      setContent('')
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div 
          className="p-3 rounded text-sm"
          style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-error)' }}
        >
          {error}
        </div>
      )}
      
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        rows={3}
        className="w-full px-3 py-2 rounded border outline-none resize-none transition-colors"
        style={{ 
          backgroundColor: 'var(--color-bg)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-text)'
        }}
      />
      
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded font-medium transition-colors"
            style={{ 
              backgroundColor: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)'
            }}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="px-4 py-2 rounded font-medium transition-colors disabled:opacity-50"
          style={{ 
            backgroundColor: 'var(--color-primary)',
            color: '#ffffff'
          }}
        >
          {loading ? (isEditing ? 'Saving...' : 'Posting...') : (isEditing ? 'Save' : 'Post Update')}
        </button>
      </div>
    </form>
  )
}
