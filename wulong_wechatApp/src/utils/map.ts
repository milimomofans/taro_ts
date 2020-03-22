import { QuestionDetail } from '@/Typings/index'

export const mapQuestion = (data): QuestionDetail => {
  const { q_nick, q_avatar, q_question, q_answer } = data
  return {
    nick: q_nick,
    avatar: q_avatar,
    question: q_question,
    answer: q_answer
  }
}
