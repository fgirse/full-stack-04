import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, User, Calendar } from "lucide-react"

interface PostCardProps {
  post: {
    id: string
    title: string
    content: string | null
    published: boolean
    createdAt: Date
    author: {
      name: string | null
      email: string | null
    } | null
  }
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="w-5 h-5" />
          {post.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {post.content && <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>}
        {post.author && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="w-4 h-4" />
            {post.author.name || post.author.email || "Anonymous"}
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {post.createdAt.toLocaleDateString()}
          </div>
          <Badge className={post.published ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}>
            {post.published ? "Published" : "Draft"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
