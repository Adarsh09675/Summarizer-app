'use client'

import { useState } from 'react'
import { AdminArticleModal } from '@/components/admin-article-modal'

interface AdminArticleListProps {
    items: any[]
}

export function AdminArticleList({ items }: AdminArticleListProps) {
    const [selectedItem, setSelectedItem] = useState<{ item: any, type: 'assignment' | 'summary' } | null>(null)

    return (
        <>
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-white/5">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Article Title</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Assigned To / Author</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Content Preview</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created By</th>
                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {items.map((item) => (
                            <tr
                                key={`${item.type}-${item.id}`}
                                onClick={() => setSelectedItem({ item: item.original, type: item.type })}
                                className="hover:bg-white/5 transition-colors cursor-pointer group"
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white group-hover:text-blue-300 transition-colors">
                                    {item.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                    {item.type === 'assignment' ? (
                                        <span className="text-blue-400">to: {item.assigneeEmail}</span>
                                    ) : (
                                        <span className="text-gray-300">{item.authorEmail}</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                                    {item.contentPreview}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${item.type === 'assignment' ? 'bg-purple-900/30 text-purple-300' : 'bg-green-900/30 text-green-300'}`}>
                                        {item.createdBy}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                    {new Date(item.created_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                        {items.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">No articles or tasks found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedItem && (
                <AdminArticleModal
                    item={selectedItem.item}
                    type={selectedItem.type}
                    onClose={() => setSelectedItem(null)}
                />
            )}
        </>
    )
}
