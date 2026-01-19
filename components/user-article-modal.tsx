'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { summarizeArticle } from '@/app/actions'

interface UserArticleModalProps {
    article: any
    onClose: () => void
}

export function UserArticleModal({ article, onClose }: UserArticleModalProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    // State for local edits before summarization
    const [title, setTitle] = useState(article.title)
    const [content, setContent] = useState(article.content)

    if (!article) return null

    const handleSummarize = async () => {
        setLoading(true)
        setError(null)

        // We create a FormData object to mimic the form submission expected by the server action
        const formData = new FormData()
        formData.append('title', title)
        formData.append('description', content) // The action expects 'description'

        const result = await summarizeArticle(null, formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
            return
        }

        if (result?.success) {
            setSuccess(result.message ?? null)
            // Wait a bit before closing to let user see message
            setTimeout(() => {
                setLoading(false)
                onClose()
            }, 2000)
            return
        }

        setLoading(false)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-start sticky top-0 bg-[#0A0A0A] z-10">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-1">
                            {isEditing ? 'Editing Article' : 'Read & Summarize'}
                        </h2>
                        <div className="text-xs text-gray-400">
                            Original Title: {article.title}
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-2xl leading-none">&times;</button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {isEditing ? (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-300">Title</label>
                                {error && (
                                    <div className="bg-red-900/20 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-4">
                                        {error}
                                    </div>
                                )}
                                {success && (
                                    <div className="bg-green-900/20 border border-green-500/20 text-green-400 p-3 rounded-lg text-sm mb-4">
                                        {success}
                                    </div>
                                )}
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="bg-white/5 border-white/20 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-300">Content</label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    rows={15}
                                    className="w-full rounded-md border border-white/20 bg-white/5 p-3 text-sm text-white focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                                <Button variant="ghost" onClick={() => setIsEditing(false)} disabled={loading} className="text-gray-300 hover:text-white">Cancel</Button>
                                {/* Saving local edits implies preparing for summarization, not updating the original article record */}
                                <Button onClick={() => setIsEditing(false)} disabled={loading} className="bg-blue-600 hover:bg-blue-500 text-white">Done Editing</Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-white">{title}</h3>
                                <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-gray-200 whitespace-pre-wrap leading-relaxed h-[40vh] overflow-y-auto">
                                    {content}
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="flex items-center gap-4 pt-6 mt-6 border-t border-white/10">
                                <Button onClick={() => setIsEditing(true)} className="flex-1 bg-white/10 text-white hover:bg-white/20 py-6 text-lg">
                                    Edit Content
                                </Button>
                                <Button onClick={handleSummarize} disabled={loading} className="flex-[2] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-6 text-lg shadow-lg hover:shadow-xl transition-all">
                                    Summarize Article
                                </Button>
                            </div>
                            <p className="text-center text-xs text-gray-500">
                                Clicking "Summarize" will generate a summary and save it to your Recent Summaries.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
