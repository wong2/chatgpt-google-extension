import { Answer } from '../messaging'

export type Event =
  | {
      type: 'answer'
      data: Answer
    }
  | {
      type: 'done'
    }
