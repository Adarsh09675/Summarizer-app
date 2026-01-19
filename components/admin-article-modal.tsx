'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateArticle, deleteArticle, adminUpdateTask, adminDeleteTask } from '@/app/admin/articles/actions'

interface AdminArticleModalProps {
    item: any
    type: 'assignment' | 'summary'
    onClose: () => void
}

export function AdminArticleModal({ item, type, onClose }: AdminArticleModalProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)


    // Normalize field names (tasks use 'description', articles use 'content')
    const initialContent = type === 'assignment' ? item.content : item.description

    if (!item) return null

    const handleSave = async (formData: FormData) => {
        setLoading(true)
        setError(null)

        let result
        if (type === 'assignment') {
            result = await updateArticle(item.id, formData)
        } else {
            result = await adminUpdateTask(item.id, formData)
        }

        if (result?.error) {
            setError(result.error)
            setLoading(false)
            return
        }

        setLoading(false)
        setIsEditing(false)
        onClose() // Close after save? Or stay open? Let's closer for simplicity.
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this item?')) return
        setLoading(true)
        setError(null)

        let result
        if (type === 'assignment') {
            result = await deleteArticle(item.id)
        } else {
            result = await adminDeleteTask(item.id)
        }

        if (result?.error) {
            setError(result.error)
            setLoading(false)
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
                            {isEditing ? 'Edit Item' : item.title}
                        </h2>
                        <div className="text-xs text-gray-400">
                            Type: <span className="uppercase text-blue-400">{type}</span> • Created by: {type === 'assignment' ? 'Admin' : (item.profiles?.full_name || item.profiles?.email)}
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-2xl leading-none">&times;</button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {isEditing ? (
                        <form action={handleSave} className="space-y-6">
                            {error && (
                                <div className="bg-red-900/20 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm text-gray-300">Title</label>
                                <Input name="title" defaultValue={item.title} className="bg-white/5 border-white/20 text-white" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-300">Content / Description</label>
                                <textarea
                                    name={type === 'assignment' ? 'content' : 'description'}
                                    defaultValue={initialContent}
                                    rows={10}
                                    className="w-full rounded-md border border-white/20 bg-white/5 p-3 text-sm text-white focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-300">Generated Summary (Optional)</label>
                                <textarea
                                    name="summary"
                                    defaultValue={item.summary || ''}
                                    rows={5}
                                    className="w-full rounded-md border border-white/20 bg-white/5 p-3 text-sm text-white focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                                <Button type="button" variant="ghost" onClick={() => setIsEditing(false)} disabled={loading} className="text-gray-300 hover:text-white">Cancel</Button>
                                <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-500 text-white">Save Changes</Button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">Original Content</h3>
                                <div className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                                    {initialContent}
                                </div>
                            </div>

                            {item.summary && (
                                <div className="bg-blue-900/10 rounded-lg p-4 border border-blue-500/20">
                                    <h3 className="text-sm font-semibold text-blue-300 mb-2 uppercase tracking-wide">Summary</h3>
                                    <div className="text-blue-100 whitespace-pre-wrap leading-relaxed">
                                        {item.summary}
                                    </div>
                                </div>
                            )}

                            {/* Footer Actions */}
                            {error && !isEditing && (
                                <div className="bg-red-900/20 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-4">
                                    {error}
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-6 mt-6 border-t border-white/10">
                                <Button variant="destructive" onClick={handleDelete} disabled={loading} className="bg-red-900/20 text-red-400 hover:bg-red-900/40 border-red-900/50 border">
                                    Delete {type === 'assignment' ? 'Assignment' : 'Task'}
                                </Button>
                                <Button onClick={() => setIsEditing(true)} className="bg-white/10 text-white hover:bg-white/20">
                                    Edit {type === 'assignment' ? 'Assignment' : 'Task'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
