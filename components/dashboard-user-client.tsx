'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { summarizeArticle } from '@/app/actions'
import { SummaryCard } from '@/components/summary-card'
import { FileText } from 'lucide-react'
import { UserArticleModal } from '@/components/user-article-modal'

interface UserDashboardClientProps {
    tasks: any[]
    articles: any[]
}

export function UserDashboardClient({ tasks, articles }: UserDashboardClientProps) {
    const [selectedArticle, setSelectedArticle] = useState<any | null>(null)

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-12">

            {/* Summarize Section */}
            <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-blue-900/40 to-purple-900/40 p-8 backdrop-blur-xl transition shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                <h2 className="text-3xl font-bold text-white mb-6">Summarize New Article</h2>
                <form action={summarizeArticle} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300">Article Title</label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="e.g., The Future of AI"
                            required
                            className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300">Article Content / Description</label>
                        <textarea
                            id="description"
                            name="description"
                            rows={5}
                            required
                            className="flex w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white"
                            placeholder="Paste the article text or description here..."
                        />
                    </div>

                    <div className="pt-2">
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            Summarize
                        </Button>
                    </div>
                </form>
            </section>

            {/* Recent Summaries Section */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold text-white">Recent Summaries</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tasks?.map(task => (
                        <SummaryCard key={task.id} task={task} />
                    ))}
                    {tasks?.length === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-500 bg-white/5 rounded-xl border border-white/10 border-dashed">
                            No summaries yet. Use the form above to get started.
                        </div>
                    )}
                </div>
            </section>

            {/* Assigned Articles Section */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold text-white">Assigned Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles?.map((article) => (
                        <div
                            key={article.id}
                            onClick={() => setSelectedArticle(article)}
                            className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition cursor-pointer group hover:border-blue-500/30"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400 group-hover:bg-purple-500/30 transition">
                                    <FileText className="h-6 w-6" />
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1 group-hover:text-blue-300 transition">{article.title}</h3>
                            <p className="text-sm text-gray-400 mb-4 line-clamp-3">{article.content}</p>
                            <Button variant="outline" size="sm" className="w-full border-white/20 hover:bg-white/10 text-white">
                                Read & Summarize
                            </Button>
                        </div>
                    ))}
                    {articles?.length === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-500 bg-white/5 rounded-xl border border-white/10 border-dashed">
                            No articles assigned to you yet.
                        </div>
                    )}
                </div>
            </section>

            {selectedArticle && (
                <UserArticleModal
                    article={selectedArticle}
                    onClose={() => setSelectedArticle(null)}
                />
            )}
        </div>
    )
}
