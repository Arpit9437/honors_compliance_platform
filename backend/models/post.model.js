import mongoose from 'mongoose'


const postSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        feedId: { 
            type: String,
            sparse: true // Allows null/undefined while maintaining uniqueness for non-null values
        },
        title: {
            type: String,
            required: true,
            unique: true
        },
        content: {
            type: String,
            required: true
        },
        link: String,
        summary: String,
        tag: {
            type: String,
            default: 'uncategorized'
        },
        category: {
            type: String,
            default: 'uncategorized'
        },
        slug: {
            type: String,
            required: true,
            unique: true
        },
        source: String,
        generatedAt: Date,
        embedding: { type: [Number], default: [] },
        isGenerated: {
            type: Boolean,
            default: false
        }
    }, 
    { 
        timestamps: true 
    }
);

// Set userId to 'ai' for AI-generated posts before saving
postSchema.pre('save', function(next) {
    if (this.isGenerated && !this.userId) {
        this.userId = 'ai';
    }
    next();
});

// Create indexes for vector search
postSchema.index({ embedding: '2d' }, { 
    sparse: true // Only index documents that have embeddings
});

const Post = mongoose.model('Post', postSchema);
export default Post;