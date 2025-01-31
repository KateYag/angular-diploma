export type CommentType = {

      id: string,
      text: string,
      date: string,
      likesCount: number,
      dislikesCount: number,
      user: {
        id: string,
        name: string
      };
  isLiked?: boolean;
  isDisliked?: boolean;
  hasReported?: boolean;

};
