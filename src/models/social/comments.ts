export class Comment {
    constructor(
        public user_id: string,
        public connection_id: string,
        public comment: string,
        public feedback: CommentFeedback,
        public timestamp: number,
        public type: CommentType,
        public _id?: string,
        public _rev?: string
    ) { }
}

export class Review {
    constructor(
        public ambience: number,
        public quality: number,
        public service: number,
        public speed: number,
    ) { }

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