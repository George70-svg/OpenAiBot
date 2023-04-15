const commands = `
/start - Запустить бота
`

const keywords = [
  'Джарвис',
  'Jarvis',
  'ДЖАРВИС',
  'JARVIS',
  'джарвис',
  'jarvis',
  'Д.Ж.А.Р.В.И.С.',
  'J.A.R.V.I.S.',
  'д.ж.а.р.в.и.с.',
  'j.a.r.v.i.s.',
  'Д.Ж.А.Р.В.И.С',
  'J.A.R.V.I.S',
  'д.ж.а.р.в.и.с',
  'j.a.r.v.i.s',
]

const phrases = {
  wellcome: 'Привет! Я искусственный интелект от openAI. начни общение со мной со слов "Джарвис, ..."',
  reject: 'Сэр, у нас критические проблемы, нужно перезапустить систему'
}

module.exports.commands = commands
module.exports.keywords = keywords
module.exports.phrases = phrases

