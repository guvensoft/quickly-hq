export interface Comment {
    user_id: string,
    connection_id: string,
    comment: string,
    feedback: CommentFeedback,
    timestamp: number,
    type: CommentType,
    _id?: string,
    _rev?: string
}

export interface Review {
    ambience: number,
    quality: number,
    service: number,
    speed: number,
}

export interface CommentFeedback {
    likes: number,
    dislikes: number
}

export enum CommentType {
    EVENT,
    STORE,
    USER,
    PRODUCT,
    PICTURE,
}