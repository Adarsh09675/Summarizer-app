'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2, X, FileText } from 'lucide-react'
import { deleteTask } from '@/app/actions' // Adjust import based on where deleteTask resides (check app/actions.ts)

interface SummaryCardProps {
    task: {
        id: string
        title: string
        description: string | null
        summary: string | null
        created_at: string
    }
}

export function SummaryCard({ task }: SummaryCardProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <div
                onClick={() => setIsOpen(true)}
                className="group cursor-pointer p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition hover:shadow-lg hover:border-white/20"
            >
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white line-clamp-1 group-hover:text-blue-400 transition-colors">
                        {task.title}
                    </h3>
                    {/* Delete button wrapper to stop propagation if needed, but here we might want it separate */}
                    <div onClick={(e) => e.stopPropagation()}>
                        <form action={async () => {
                            await deleteTask(task.id)
                        }}>
                            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-400 -mt-2 -mr-2">
                                <Trash2 className="h-5 w-5" />
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="bg-black/30 rounded-lg p-4 mb-4 border border-white/5">
                    <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">Summary Preview</h4>
                    <p className="text-gray-300 leading-relaxed line-clamp-3">
                        {task.summary || "Processing..."}
                    </p>
                </div>

                <div className="text-sm text-gray-500">
                    Click to view full details
                </div>
            </div>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div
                        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border border-white/20 rounded-2xl shadow-2xl p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        <h2 className="text-3xl font-bold text-white mb-6 pr-8">{task.title}</h2>

                        <div className="space-y-8">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-blue-400">
                                    <FileText className="h-5 w-5" />
                                    <h3 className="text-lg font-semibold uppercase tracking-wider">Generated Summary</h3>
                                </div>
                                <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-6 text-gray-200 leading-relaxed">
                                    {task.summary}
                                </div>
                            </div>

                            {task.description && (
                                <div className="space-y-3">
                                    <h3 className="text-lg font-semibold text-gray-400 uppercase tracking-wider border-b border-white/10 pb-2">
                                        Original Content
                                    </h3>
                                    <div className="text-gray-400 whitespace-pre-wrap leading-relaxed">
                                        {task.description}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                            <Button onClick={() => setIsOpen(false)} variant="secondary">
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
