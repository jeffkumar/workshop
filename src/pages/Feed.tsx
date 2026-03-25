import { useEffect, useState } from 'react'
import { supabase, Update } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Layout } from '../components/Layout'
import { UpdateForm } from '../components/UpdateForm'
import { UpdateCard } from '../components/UpdateCard'

export function Feed() {
  const [updates, setUpdates] = useState<Update[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchUpdates = async () => {
    const { data, error } = await supabase
      .from('updates')
      .select(`
        *,
        profiles (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setUpdates(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUpdates()

    const channel = supabase
      .channel('updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'updates' },
        () => {
          fetchUpdates()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <Layout>
      <div className="space-y-6">
        {user && (
          <div 
            className="p-4 rounded-lg border"
            style={{ backgroundColor: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}
          >
            <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
              Share an Update
            </h2>
            <UpdateForm onSuccess={fetchUpdates} />
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
            Team Updates
          </h2>

          {loading ? (
            <div className="text-center py-8" style={{ color: 'var(--color-text-secondary)' }}>
              Loading updates...
            </div>
          ) : updates.length === 0 ? (
            <div 
              className="text-center py-8 rounded-lg border"
              style={{ 
                backgroundColor: 'var(--color-bg-secondary)', 
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-secondary)'
              }}
            >
              No updates yet. {user ? 'Be the first to share!' : 'Sign in to post an update.'}
            </div>
          ) : (
            <div className="space-y-4">
              {updates.map((update) => (
                <UpdateCard
                  key={update.id}
                  update={update}
                  onDeleted={fetchUpdates}
                  onUpdated={fetchUpdates}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
