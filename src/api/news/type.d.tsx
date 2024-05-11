/* eslint-disable eslint-comments/no-unlimited-disable */
// @ts-ignore
/* eslint-disable */

export declare namespace NEWS {
  //unit basic
  namespace Basic {}

  // response type
  namespace Response {
    type News = {
      id: number;
      image?: string;
      title?: string;
      createDate: string;
      content?: string;
      time: string | null;
      type: 'news' | 'video';
    };
  }

  // request type
  namespace Request {}
}
